import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TranslationBridge } from "../translationBridge";

class MockWebSocket {
  public static instances: MockWebSocket[] = [];
  public readyState = 1;
  public bufferedAmount = 0;
  public onopen: (() => void) | null = null;
  public onmessage: ((e: { data: string }) => void) | null = null;
  public onerror: ((e: unknown) => void) | null = null;
  public onclose: ((e: { code?: number; reason?: string }) => void) | null = null;
  constructor(public url: string) {
    MockWebSocket.instances.push(this);
    setTimeout(() => { if (this.onopen) this.onopen(); }, 0);
  }
  send = vi.fn();
  close = vi.fn(() => { this.readyState = 3; if (this.onclose) this.onclose({ code: 1000 }); });
  addEventListener = vi.fn((event: string, cb: () => void) => { if (event === "open") setTimeout(cb, 0); });
}

function createBridge(keyOrProvider: string | (() => Promise<string>), lang = "sv", cbs = {}) {
  return new TranslationBridge(keyOrProvider, lang, {
    onAudioData: vi.fn(), onStatusChange: vi.fn(), onError: vi.fn(), ...cbs,
  });
}

describe("TranslationBridge Specifications", () => {
  beforeEach(() => {
    MockWebSocket.instances = [];
    vi.stubGlobal("WebSocket", MockWebSocket);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("skickar setup-payload med targetLanguage vid anslutning", () => {
    const bridge = createBridge("test-key", "sv");
    bridge.connect();
    expect(MockWebSocket.instances.length).toBe(1);
    const ws = MockWebSocket.instances[0]!;
    vi.advanceTimersByTime(10);

    expect(ws.send).toHaveBeenCalled();
    const payload = JSON.parse(ws.send.mock.calls[0][0]);
    expect(payload.setup).toBeDefined();
    expect(payload.setup.contextWindowCompressionConfig).toBeUndefined();
    expect(payload.setup.inputAudioTranscription).toEqual({});
    expect(payload.setup.outputAudioTranscription).toEqual({});
    expect(payload.setup.generationConfig).toEqual({
      responseModalities: ["AUDIO"],
      translationConfig: { targetLanguageCode: "sv", echoTargetLanguage: false },
    });
    expect(Object.keys(payload.setup.generationConfig).sort()).toEqual(["responseModalities", "translationConfig"].sort());
  });

  it("droppar ljudramar vid backpressure när ws.bufferedAmount > 128 KB", () => {
    const bridge = createBridge("test-key", "sv");
    bridge.connect();
    vi.advanceTimersByTime(10);
    const ws = MockWebSocket.instances[0]!;
    ws.send.mockClear();
    ws.bufferedAmount = 128 * 1024 + 1;
    bridge.sendAudioChunk(new Int16Array(1600));
    expect(ws.send).not.toHaveBeenCalled();
    ws.bufferedAmount = 64 * 1024;
    bridge.sendAudioChunk(new Int16Array(1600));
    expect(ws.send).toHaveBeenCalledTimes(1);
  });

  it("paketerar ljud i 100 ms-ramar (1600 samplar vid 16 kHz) för 10 Hz sändningsfrekvens", () => {
    const bridge = createBridge("test-key", "sv");
    bridge.connect();
    vi.advanceTimersByTime(10);
    const ws = MockWebSocket.instances[0]!;
    ws.send.mockClear();
    const halfChunk = new Int16Array(800);
    bridge.enqueueAudioSamples(halfChunk);
    expect(ws.send).not.toHaveBeenCalled();
    bridge.enqueueAudioSamples(halfChunk);
    expect(ws.send).toHaveBeenCalledTimes(1);
  });

  it("uppdaterar hot-swap resumption handle från sessionResumptionUpdate", () => {
    const bridge = createBridge("test-key", "sv");
    bridge.connect();
    vi.advanceTimersByTime(10);
    const ws = MockWebSocket.instances[0]!;
    if (ws.onmessage) ws.onmessage({ data: JSON.stringify({ sessionResumptionUpdate: { newHandle: "resumption-token-xyz" } }) });
    expect(bridge.getResumptionHandle()).toBe("resumption-token-xyz");
  });

  it("hanterar goAway och utlöser hot-swap innan timeLeft går ut", () => {
    const statusChanges: string[] = [];
    const bridge = createBridge("test-key", "sv", { onStatusChange: (s: string) => statusChanges.push(s) });
    bridge.connect();
    vi.advanceTimersByTime(10);
    const ws = MockWebSocket.instances[0]!;
    if (ws.onmessage) ws.onmessage({ data: JSON.stringify({ goAway: { timeLeft: 5000 } }) });
    vi.advanceTimersByTime(2900);
    expect(MockWebSocket.instances.length).toBe(1);
    vi.advanceTimersByTime(200);
    expect(MockWebSocket.instances.length).toBe(2);
    expect(statusChanges).toContain("rotating");
  });

  it("tillämpar adaptiv slew och clamping vid resampling", () => {
    const bridge = createBridge("test-key", "sv");
    expect(bridge.clampSample(1.5)).toBe(1);
    expect(bridge.clampSample(-1.5)).toBe(-1);
    expect(bridge.clampSample(0.42)).toBe(0.42);
    const slew = bridge.getAdaptiveSlewRate();
    expect(slew).toBeGreaterThanOrEqual(0.95);
    expect(slew).toBeLessThanOrEqual(1.05);
  });

  it("tar emot 24 kHz audio-chunks från Gemini och anropar onAudioData", () => {
    const onAudioData = vi.fn();
    const bridge = createBridge("test-key", "sv", { onAudioData });
    bridge.connect();
    vi.advanceTimersByTime(10);
    const ws = MockWebSocket.instances[0]!;
    if (ws.onmessage) ws.onmessage({ data: JSON.stringify({ serverContent: { modelTurn: { parts: [{ inlineData: { data: "AAAA////" } }] } } }) });
    expect(onAudioData).toHaveBeenCalled();
    expect(bridge.getAdaptiveSlewRate()).toBeGreaterThanOrEqual(0.95);
  });

  it("avslutar och frigör resurser vid dispose och destroy", () => {
    const statusChanges: string[] = [];
    const bridge = createBridge("test-key", "sv", { onStatusChange: (s: string) => statusChanges.push(s) });
    bridge.connect();
    vi.advanceTimersByTime(10);
    const ws = MockWebSocket.instances[0]!;
    bridge.enqueueAudioSamples(new Int16Array(200));
    bridge.dispose();
    expect(ws.close).toHaveBeenCalled();
    expect(statusChanges).toContain("idle");
    bridge.connect();
    vi.advanceTimersByTime(10);
    bridge.destroy();
    expect(statusChanges.filter((s) => s === "idle").length).toBeGreaterThanOrEqual(2);
  });

  it("kopplar SFU-ström via attachSFUStream", () => {
    const mockConnect = vi.fn();
    const mockClose = vi.fn().mockResolvedValue(undefined);
    const MockAudioContext = vi.fn(function () {
      return {
        sampleRate: 48000, state: "running", destination: {},
        createMediaStreamSource: vi.fn().mockReturnValue({ connect: mockConnect }),
        createScriptProcessor: vi.fn().mockReturnValue({ connect: mockConnect, onaudioprocess: null }),
        close: mockClose,
      };
    });
    vi.stubGlobal("AudioContext", MockAudioContext);
    const bridge = createBridge("test-key", "sv");
    bridge.attachSFUStream({} as MediaStream);
    expect(mockConnect).toHaveBeenCalledTimes(2);
    bridge.dispose();
    expect(mockClose).toHaveBeenCalled();
  });

  it("använder BidiGenerateContentConstrained och access_token vid ephemeral token", () => {
    const bridge = createBridge("auth_tokens/test_ephemeral_token_123", "en");
    bridge.connect();
    vi.advanceTimersByTime(10);
    const ws = MockWebSocket.instances[0]!;
    expect(ws.url).toContain("BidiGenerateContentConstrained");
    expect(ws.url).toContain("access_token=auth_tokens%2Ftest_ephemeral_token_123");
  });

  it("ger tydligt felmeddelande och status 'error' vid autentiseringsfel", () => {
    const onError = vi.fn();
    const statusChanges: string[] = [];
    const bridge = createBridge("demo_key", "sv", { onStatusChange: (s: string) => statusChanges.push(s), onError });
    bridge.connect();
    vi.advanceTimersByTime(10);
    const ws = MockWebSocket.instances[0]!;
    if (ws.onclose) ws.onclose({ code: 1008, reason: "API key not valid. Please pass a valid API key." });
    expect(statusChanges).toContain("error");
    expect(onError).toHaveBeenCalledWith(expect.stringContaining("API key not valid"));
  });

  it("skickar transkriberingskonfiguration på reella anslutningar och använder ?key= vid AIza-nyckel", async () => {
    const bridge = createBridge("AIzaSyTestRealKey123", "es");
    await bridge.connect();
    expect(MockWebSocket.instances.length).toBe(1);
    const ws = MockWebSocket.instances[0]!;
    expect(ws.url).toContain("BidiGenerateContent?key=AIzaSyTestRealKey123");
    expect(ws.url).not.toContain("BidiGenerateContentConstrained");
    expect(ws.url).not.toContain("access_token=");
    vi.advanceTimersByTime(10);

    expect(ws.send).toHaveBeenCalled();
    const payload = JSON.parse(ws.send.mock.calls[0][0]);
    expect(payload.setup.model).toBe("models/gemini-3.5-live-translate-preview");
    expect(payload.setup.contextWindowCompressionConfig).toBeUndefined();
    expect(payload.setup.inputAudioTranscription).toEqual({});
    expect(payload.setup.outputAudioTranscription).toEqual({});
    expect(payload.setup.generationConfig).toEqual({
      responseModalities: ["AUDIO"],
      translationConfig: { targetLanguageCode: "es", echoTargetLanguage: false },
    });
    expect(Object.keys(payload.setup.generationConfig).sort()).toEqual(["responseModalities", "translationConfig"].sort());
  });

  it("använder dynamisk tokenProvider och hämtar färsk token vid anslutning och hot-swap", async () => {
    let callCount = 0;
    const tokenProvider = vi.fn(async () => { callCount++; return `authTokens/ephemeral_token_v${callCount}`; });
    const bridge = createBridge(tokenProvider, "de");
    await bridge.connect();
    expect(tokenProvider).toHaveBeenCalledTimes(1);
    expect(bridge.apiKey).toBe("authTokens/ephemeral_token_v1");
    vi.advanceTimersByTime(10);
    const ws1 = MockWebSocket.instances[0]!;
    expect(ws1.url).toContain("access_token=authTokens%2Fephemeral_token_v1");
    if (ws1.onmessage) ws1.onmessage({ data: JSON.stringify({ goAway: { timeLeft: 3000 } }) });
    await vi.advanceTimersByTimeAsync(1500);
    expect(tokenProvider).toHaveBeenCalledTimes(2);
    expect(bridge.apiKey).toBe("authTokens/ephemeral_token_v2");
    expect(MockWebSocket.instances.length).toBe(2);
  });

  it("detekterar authTokens/ skiftlägesoberoende som ephemeral token och ansluter med access_token", async () => {
    const bridge = createBridge("authTokens/camelCaseEphemeral123", "es");
    await bridge.connect();
    expect(MockWebSocket.instances.length).toBe(1);
    const ws = MockWebSocket.instances[0]!;
    expect(ws.url).toContain("BidiGenerateContentConstrained");
    expect(ws.url).toContain("access_token=authTokens%2FcamelCaseEphemeral123");
    expect(ws.url).not.toContain("?key=");
  });

  it("avbryter anslutning och anropar onError om tokenProvider inte returnerar någon token istället för ?key=-fallback", async () => {
    const tokenProvider = vi.fn(async () => "");
    const onError = vi.fn();
    const prevCount = MockWebSocket.instances.length;
    const bridge = createBridge(tokenProvider, "de", { onError });
    await bridge.connect();
    expect(tokenProvider).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(expect.stringContaining("tokenProvider"));
    expect(MockWebSocket.instances.length).toBe(prevCount);
  });
});
