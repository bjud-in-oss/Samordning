import { AudioResampler } from "./audioResampler";
import { HotSwapManager } from "./hotSwapManager";
import { SupportedLanguage } from "./types";
import { AudioProcessor } from "../workers/AudioProcessor.worklet";
import { calculateRegressionModel, SAFE_MODE_MODEL, PredictionModel, DataPoint } from "./adaptiveLogic";

export type TokenProvider = () => Promise<string>;

export interface BridgeCallbacks {
  onAudioData: (samples: Int16Array) => void;
  onStatusChange: (status: "idle" | "connecting" | "active" | "rotating" | "error") => void;
  onError: (error: string) => void;
  onTranscription?: (text: string, isInput: boolean) => void;
}

export class TranslationBridge {
  private ws: WebSocket | null = null;
  private nextWs: WebSocket | null = null;
  private hotSwapManager: HotSwapManager;
  private sampleBuffer: number[] = [];
  private readonly MAX_BUFFERED_BYTES = 128 * 1024;
  private readonly FRAME_SAMPLES_100MS = 1600;
  private reconnectAttempts = 0;
  private isIntentionalDisconnect = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private goAwayTimer: ReturnType<typeof setTimeout> | null = null;
  private sfuAudioContext: AudioContext | null = null;
  private adaptiveModel: PredictionModel = SAFE_MODE_MODEL;
  private latencyHistory: DataPoint[] = [];
  private currentSlewRate = 1.0;
  public processorRef: AudioProcessor | null = null;
  private tokenProvider?: TokenProvider;
  private currentApiKey: string = "";

  constructor(apiKeyOrProvider: string | TokenProvider, private targetLanguage: SupportedLanguage, private readonly callbacks: BridgeCallbacks, tokenProvider?: TokenProvider) {
    if (typeof apiKeyOrProvider === "function") this.tokenProvider = apiKeyOrProvider;
    else { this.currentApiKey = apiKeyOrProvider; if (tokenProvider) this.tokenProvider = tokenProvider; }
    this.hotSwapManager = new HotSwapManager((handle) => this.executeHotSwap(handle));
  }

  public get apiKey(): string { return this.currentApiKey; }
  public clampSample(sample: number): number { return Math.max(-1, Math.min(1, sample)); }
  public getAdaptiveSlewRate(): number { return this.currentSlewRate; }
  public getResumptionHandle(): string | null { return this.hotSwapManager.getResumptionHandle(); }
  public setLanguage(lang: SupportedLanguage): void { this.targetLanguage = lang; }
  public dispose(): void { this.disconnect(); }
  public destroy(): void { this.disconnect(); }

  private async resolveApiKey(): Promise<string> {
    if (this.tokenProvider) {
      try {
        const freshToken = await this.tokenProvider();
        if (freshToken) this.currentApiKey = freshToken;
      } catch (err) { console.warn("[TranslationBridge] Kunde inte hämta färsk token:", err); }
    }
    return this.currentApiKey;
  }

  public async connect(isRetry = false): Promise<void> {
    this.isIntentionalDisconnect = false;
    if (!isRetry) this.reconnectAttempts = 0;
    this.callbacks.onStatusChange("connecting");

    if (this.tokenProvider && (!this.currentApiKey || isRetry)) {
      await this.resolveApiKey();
    }
    if (this.tokenProvider && !this.currentApiKey) {
      this.handleConnectionFailure("Ingen sessionstoken tillgänglig via tokenProvider");
      return;
    }

    const isEphemeral = this.currentApiKey.startsWith("auth_tokens/");
    const wsUrl = isEphemeral
      ? `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(this.currentApiKey)}`
      : `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(this.currentApiKey)}`;

    try {
      this.ws = new WebSocket(wsUrl);
      this.setupSocketHandlers(this.ws, false);
    } catch (err) {
      this.handleConnectionFailure(err instanceof Error ? err.message : "WebSocket-fel");
    }
  }

  private handleConnectionFailure(errorMsg: string): void {
    if (this.isIntentionalDisconnect) return;
    this.reconnectAttempts++;
    const delay = Math.min(10000, 1000 * Math.pow(1.5, Math.min(this.reconnectAttempts, 8)));
    this.callbacks.onError(`${errorMsg} (återansluter... försök ${this.reconnectAttempts})`);
    this.callbacks.onStatusChange("connecting");

    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(async () => {
      if (!this.isIntentionalDisconnect) {
        if (this.tokenProvider) await this.resolveApiKey();
        this.connect(true);
      }
    }, delay);
  }

  private setupSocketHandlers(socket: WebSocket, isPrewarmed: boolean): void {
    socket.onopen = () => {
      const handle = this.hotSwapManager.getResumptionHandle();
      const setup: Record<string, unknown> = {
        model: "models/gemini-3.5-live-translate-preview",
        generationConfig: {
          responseModalities: ["AUDIO"],
          translationConfig: { targetLanguageCode: this.targetLanguage, echoTargetLanguage: false },
        },
        inputAudioTranscription: {},
        outputAudioTranscription: {},
      };
      if (handle) setup.sessionResumption = { handle };
      socket.send(JSON.stringify({ setup }));
      if (!isPrewarmed) { this.callbacks.onStatusChange("active"); this.hotSwapManager.armTimer(); }
    };

    socket.onmessage = (event: { data: string }) => {
      try {
        if (!event.data) return;
        const data = JSON.parse(event.data);
        if (data?.sessionResumptionUpdate?.newHandle) this.hotSwapManager.updateResumptionHandle(String(data.sessionResumptionUpdate.newHandle));
        if (data?.goAway) {
          const timeLeft = Number(data.goAway.timeLeft ?? 5000);
          if (this.goAwayTimer) clearTimeout(this.goAwayTimer);
          this.goAwayTimer = setTimeout(() => this.executeHotSwap(this.hotSwapManager.getResumptionHandle()), Math.max(0, timeLeft - 2000));
        }
        const parts = data?.serverContent?.modelTurn?.parts;
        if (Array.isArray(parts)) {
          for (const part of parts) {
            if (part?.inlineData?.data) {
              const samples = AudioResampler.base64ToInt16(part.inlineData.data);
              this.updateAdaptiveSlew(samples.length);
              this.callbacks.onAudioData(samples);
            }
          }
        }
      } catch (e) { console.warn("[TranslationBridge] Meddelandefel:", e); }
    };

    socket.onclose = (evt?: { code?: number; reason?: string }) => {
      if (isPrewarmed) return;
      this.hotSwapManager.disarmTimer();
      if (this.isIntentionalDisconnect || evt?.code === 1000) { this.callbacks.onStatusChange("idle"); return; }
      const reason = evt?.reason || "";
      const isAuthError = evt?.code === 1007 || evt?.code === 1008 || /api key|token|auth|unauthorized|permission|forbidden/i.test(reason) || this.apiKey === "demo_key" || !this.apiKey;
      if (isAuthError) {
        const errorMsg = reason || (this.apiKey === "demo_key" || !this.apiKey ? "Ingen giltig Gemini API-nyckel/token konfigurerad." : "Ogiltig eller utgången Gemini API-nyckel/token. Kontrollera behörighet och API-inställningar.");
        this.callbacks.onError(errorMsg);
        this.callbacks.onStatusChange("error");
        return;
      }
      this.handleConnectionFailure(reason || "Nätverksanslutningen avbröts");
    };
  }

  private updateAdaptiveSlew(chunkSize: number): void {
    this.latencyHistory.push({ inputDuration: 100, responseDuration: chunkSize / 24 });
    if (this.latencyHistory.length > 20) this.latencyHistory.shift();
    this.adaptiveModel = calculateRegressionModel(this.latencyHistory);
    this.currentSlewRate = Math.max(0.95, Math.min(1.05, 1.0 + (this.adaptiveModel.expansionRate - 1.2) * 0.05));
  }

  public enqueueAudioSamples(samples: Int16Array): void {
    for (let i = 0; i < samples.length; i++) this.sampleBuffer.push(samples[i]!);
    while (this.sampleBuffer.length >= this.FRAME_SAMPLES_100MS) {
      const chunk = new Int16Array(this.sampleBuffer.splice(0, this.FRAME_SAMPLES_100MS));
      this.sendAudioChunk(chunk);
    }
  }

  public sendAudioChunk(pcm16Samples: Int16Array): void {
    if (!this.ws || this.ws.readyState !== 1) return;
    if (this.ws.bufferedAmount > this.MAX_BUFFERED_BYTES) { console.warn("[TranslationBridge] Backpressure: 128KB överskriden"); return; }
    const clamped = new Int16Array(pcm16Samples.length);
    for (let i = 0; i < pcm16Samples.length; i++) {
      const c = this.clampSample(pcm16Samples[i]! / 0x7fff);
      clamped[i] = c < 0 ? c * 0x8000 : c * 0x7fff;
    }
    const data = AudioResampler.int16ToBase64(clamped);
    this.ws.send(JSON.stringify({ realtimeInput: { mediaChunks: [{ mimeType: "audio/pcm;rate=16000", data }] } }));
  }

  public attachSFUStream(stream: MediaStream): void {
    try {
      const AudioCtx = typeof AudioContext !== "undefined" ? AudioContext : (typeof window !== "undefined" ? ((window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext || null) : null);
      if (!AudioCtx) return;
      this.sfuAudioContext = new AudioCtx({ sampleRate: 48000 });
      const src = this.sfuAudioContext.createMediaStreamSource(stream);
      const proc = this.sfuAudioContext.createScriptProcessor(4096, 1, 1);
      proc.onaudioprocess = (e) => this.enqueueAudioSamples(AudioResampler.downsample48kTo16k(e.inputBuffer.getChannelData(0)));
      src.connect(proc);
      proc.connect(this.sfuAudioContext.destination);
    } catch (err) { console.warn("[TranslationBridge] Kunde inte koppla SFU-ström:", err); }
  }

  private async executeHotSwap(_handle: string | null): Promise<void> {
    this.callbacks.onStatusChange("rotating");
    if (this.tokenProvider) await this.resolveApiKey();

    if (this.tokenProvider && !this.currentApiKey) {
      console.warn("[TranslationBridge] Hot Swap avbröts: saknar sessionstoken");
      this.callbacks.onStatusChange("active");
      return;
    }

    const isEphemeral = this.currentApiKey.startsWith("auth_tokens/");
    const wsUrl = isEphemeral
      ? `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(this.currentApiKey)}`
      : `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(this.currentApiKey)}`;
    try {
      this.nextWs = new WebSocket(wsUrl);
      this.setupSocketHandlers(this.nextWs, true);
      this.nextWs.addEventListener("open", () => {
        const oldWs = this.ws; this.ws = this.nextWs; this.nextWs = null;
        if (oldWs) oldWs.close();
        this.callbacks.onStatusChange("active");
        this.hotSwapManager.armTimer();
      }, { once: true });
    } catch (err) {
      console.warn("[TranslationBridge] Hot Swap misslyckades:", err);
      this.callbacks.onStatusChange("active");
    }
  }

  public disconnect(): void {
    this.isIntentionalDisconnect = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.goAwayTimer) clearTimeout(this.goAwayTimer);
    if (this.sfuAudioContext && this.sfuAudioContext.state !== "closed") {
      void this.sfuAudioContext.close();
      this.sfuAudioContext = null;
    }
    this.hotSwapManager.reset();
    if (this.ws) { this.ws.close(); this.ws = null; }
    if (this.nextWs) { this.nextWs.close(); this.nextWs = null; }
    this.sampleBuffer = []; this.latencyHistory = []; this.processorRef = null;
    this.callbacks.onStatusChange("idle");
  }
}
