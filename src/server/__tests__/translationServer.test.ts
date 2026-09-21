import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { handleSmsCommand } from "../smsCommands";
import { 
  startTranslationSession, 
  stopTranslationSession, 
  getTranslationSessionStatus,
  setAudioSource,
  getAudioSource,
  ingestSystemAudio48k,
  handleIncomingClientAudio,
  broadcastAudioChunk,
  encodeOpusFrame,
  decodeOpusFrame,
  triggerHotSwapRotation,
  setupTranslationWebSocket
} from "../translationServer";
import http from "http";

describe("Live Translation Server & Audio Ingestion (Fas 2)", () => {
  beforeEach(() => {
    stopTranslationSession();
    setAudioSource("WEBSOCKET");
  });

  afterEach(() => {
    stopTranslationSession();
  });

  describe("Session Management & SMS commands", () => {
    it("aktiverar tolkning via startTranslationSession med angivet målspråk", () => {
      const result = startTranslationSession("en");
      expect(result.success).toBe(true);
      expect(result.language).toBe("en");
      expect(result.replyMessage).toContain("?mode=listen&lang=en");

      const status = getTranslationSessionStatus();
      expect(status.active).toBe(true);
      expect(status.language).toBe("en");
    });

    it("stoppar tolkning via stopTranslationSession", () => {
      startTranslationSession("sv");
      const stopResult = stopTranslationSession();
      expect(stopResult.success).toBe(true);
      expect(stopResult.replyMessage).toContain("avslutad");

      const status = getTranslationSessionStatus();
      expect(status.active).toBe(false);
    });

    it("hanterar SMS-kommandot 'START EN' och returnerar PWA-djuplänk", async () => {
      const res = await handleSmsCommand("+46701112233", "START EN", false, false);
      expect(res.handled).toBe(true);
      expect(res.response?.success).toBe(true);
      expect(res.response?.replyMessage).toContain("?mode=listen&lang=en");

      const status = getTranslationSessionStatus();
      expect(status.active).toBe(true);
      expect(status.language).toBe("en");
    });

    it("hanterar SMS-kommandot 'STOPP' och stoppar pågående tolksession", async () => {
      startTranslationSession("en");
      const res = await handleSmsCommand("+46701112233", "STOPP", false, false);
      expect(res.handled).toBe(true);
      expect(res.response?.success).toBe(true);
      expect(res.response?.replyMessage).toContain("avslutad");

      const status = getTranslationSessionStatus();
      expect(status.active).toBe(false);
    });
  });

  describe("Dual Audio Ingestion (SYSTEM_AUDIO vs WEBSOCKET)", () => {
    it("stöder växling av AUDIO_SOURCE mellan SYSTEM_AUDIO, VMIX och WEBSOCKET", () => {
      setAudioSource("SYSTEM_AUDIO");
      expect(getAudioSource()).toBe("SYSTEM_AUDIO");

      setAudioSource("VMIX");
      expect(getAudioSource()).toBe("SYSTEM_AUDIO"); // VMIX normaliseras till SYSTEM_AUDIO

      setAudioSource("VIRTUAL_CARD");
      expect(getAudioSource()).toBe("SYSTEM_AUDIO"); // VIRTUAL_CARD normaliseras till SYSTEM_AUDIO

      setAudioSource("WEBSOCKET");
      expect(getAudioSource()).toBe("WEBSOCKET");
    });

    it("ingesterar 48kHz Float32 ljud och konverterar till 16kHz Int16 i SYSTEM_AUDIO-läge", () => {
      setAudioSource("SYSTEM_AUDIO");
      startTranslationSession("en");

      // Skapa 48kHz Float32-sinusvåg (480 samplar = 10 ms)
      const input48k = new Float32Array(480);
      for (let i = 0; i < input48k.length; i++) {
        input48k[i] = Math.sin((i / 48) * 2 * Math.PI);
      }

      const resampled16k = ingestSystemAudio48k(input48k);
      expect(resampled16k).toBeInstanceOf(Int16Array);
      expect(resampled16k.length).toBe(160); // 480 / 3 = 160 samplar vid 16kHz
    });

    it("hanterar inkommande mikrofonström över WebSocket i lektionsläge", () => {
      setAudioSource("WEBSOCKET");
      startTranslationSession("es");

      const micChunk = Buffer.from(new Int16Array([100, 200, 300, 400]).buffer);
      const handled = handleIncomingClientAudio(micChunk, "pcm");
      expect(handled).toBe(true);
    });
  });

  describe("Opus Encoding & Binary Streaming", () => {
    it("kodar och avkodar binära Opus-ljudramar med 20ms paketramar", () => {
      const rawPcm = new Int16Array(480); // 20ms vid 24kHz
      for (let i = 0; i < rawPcm.length; i++) {
        rawPcm[i] = (i % 100) * 100;
      }

      const encoded = encodeOpusFrame(rawPcm);
      expect(encoded).toBeInstanceOf(Buffer);
      expect(encoded.length).toBeGreaterThan(0);

      const decoded = decodeOpusFrame(encoded);
      expect(decoded).toBeInstanceOf(Int16Array);
      expect(decoded.length).toBe(rawPcm.length);
    });

    it("distribuerar binärt ljud till anslutna klienter", () => {
      startTranslationSession("en");
      const testBuffer = Buffer.from([0x4f, 0x50, 0x55, 0x53, 0x01, 0x02]);
      const sent = broadcastAudioChunk(testBuffer, "opus");
      expect(typeof sent).toBe("number");
    });
  });

  describe("Resilience & 14-minuters Hot-Swap rotation", () => {
    it("triggar hot-swap rotation utan avbrott i sessionsstatus", () => {
      startTranslationSession("en");
      const statusBefore = getTranslationSessionStatus();
      expect(statusBefore.active).toBe(true);

      const rotationResult = triggerHotSwapRotation("test-resumption-token-123");
      expect(rotationResult.success).toBe(true);
      expect(rotationResult.resumptionToken).toBe("test-resumption-token-123");

      const statusAfter = getTranslationSessionStatus();
      expect(statusAfter.active).toBe(true);
      expect(statusAfter.rotationCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe("WebSocket Orchestration (Port 8080 & HTTP upgrade)", () => {
    it("initierar WebSocketServer på http-server instans", () => {
      const server = http.createServer();
      const wss = setupTranslationWebSocket(server);
      expect(wss).toBeDefined();
    });

    it("fäster inte duplicerade upgrade-lyssnare vid upprepade anrop", () => {
      const server = http.createServer();
      const initialListeners = server.listeners("upgrade").length;
      setupTranslationWebSocket(server);
      const afterFirst = server.listeners("upgrade").length;
      expect(afterFirst).toBe(initialListeners + 1);

      // Upprepat anrop ska inte lägga till ytterligare upgrade-lyssnare
      setupTranslationWebSocket(server);
      const afterSecond = server.listeners("upgrade").length;
      expect(afterSecond).toBe(afterFirst);
    });

    it("dirigerar upgrade för /ws/translation och ignorerar icke-relaterade sökvägar", () => {
      const server = http.createServer();
      const wss = setupTranslationWebSocket(server);
      const handleUpgradeSpy = vi.spyOn(wss, "handleUpgrade").mockImplementation((_req, _sock, _head, cb) => {
        cb({ on: vi.fn(), send: vi.fn(), close: vi.fn() } as unknown as WebSocket);
      });

      const mockSocket = {
        destroy: vi.fn(),
        destroyed: false,
        on: vi.fn(),
        setTimeout: vi.fn(),
        setKeepAlive: vi.fn(),
      } as unknown as import("net").Socket;

      // 1. Träff på /ws/translation
      server.emit("upgrade", { url: "/ws/translation", headers: { host: "localhost:3000" } }, mockSocket, Buffer.alloc(0));
      expect(handleUpgradeSpy).toHaveBeenCalledTimes(1);
      expect(mockSocket.setTimeout).toHaveBeenCalledWith(0);
      expect(mockSocket.setKeepAlive).toHaveBeenCalledWith(true, 10000);

      // 2. Träff på /ws/translation/ med query param
      server.emit("upgrade", { url: "/ws/translation/?client=test", headers: { host: "localhost:3000" } }, mockSocket, Buffer.alloc(0));
      expect(handleUpgradeSpy).toHaveBeenCalledTimes(2);

      // 3. Träff via proxy/tunnel med full URL
      server.emit("upgrade", { url: "http://tunnel.example.com/ws/translation", headers: { host: "tunnel.example.com" } }, mockSocket, Buffer.alloc(0));
      expect(handleUpgradeSpy).toHaveBeenCalledTimes(3);

      // 4. Annan sökväg ska ignoreras och inte anropa handleUpgrade
      server.emit("upgrade", { url: "/vite-hmr", headers: { host: "localhost:3000" } }, mockSocket, Buffer.alloc(0));
      expect(handleUpgradeSpy).toHaveBeenCalledTimes(3);

      handleUpgradeSpy.mockRestore();
    });
  });
});
