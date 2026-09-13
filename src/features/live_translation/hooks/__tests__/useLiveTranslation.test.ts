import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLiveTranslation } from "../useLiveTranslation";

class MockWebSocket {
  url: string;
  readyState = 1;
  binaryType = "blob";
  bufferedAmount = 0;
  onopen: (() => void) | null = null;
  onmessage: ((event: unknown) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: ((error: unknown) => void) | null = null;
  send = vi.fn();
  close = vi.fn();
  constructor(url: string) {
    this.url = url;
    setTimeout(() => { this.onopen?.(); }, 5);
  }
}

class MockAudioWorklet {
  addModule = vi.fn().mockResolvedValue(undefined);
}

class MockAudioWorkletNode {
  port = { postMessage: vi.fn(), onmessage: null };
  connect = vi.fn();
  disconnect = vi.fn();
  constructor(_ctx: unknown, _name: string) {}
}

class MockAudioContext {
  state = "running";
  sampleRate = 48000;
  audioWorklet = new MockAudioWorklet();
  destination = {};
  createMediaStreamSource = vi.fn().mockReturnValue({ connect: vi.fn(), disconnect: vi.fn() });
  createBuffer = vi.fn().mockReturnValue({ getChannelData: () => new Float32Array(100) });
  createBufferSource = vi.fn().mockReturnValue({ buffer: null, connect: vi.fn(), start: vi.fn() });
  resume = vi.fn().mockResolvedValue(undefined);
  close = vi.fn().mockImplementation(() => { this.state = "closed"; return Promise.resolve(); });
}

class MockMediaStream {
  tracks: unknown[] = [];
  constructor(tracks?: unknown[]) {
    if (tracks) this.tracks = tracks;
  }
  addTrack(t: unknown) { this.tracks.push(t); }
  getTracks() { return this.tracks; }
  getAudioTracks() { return this.tracks; }
}

class MockRTCPeerConnection {
  iceGatheringState = "complete";
  signalingState = "stable";
  iceConnectionState = "connected";
  localDescription = { type: "offer", sdp: "v=0\r\no=mock-offer" };
  remoteDescription: unknown = null;
  ontrack: unknown = null;
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  getTransceivers = vi.fn().mockReturnValue([]);
  addTransceiver = vi.fn().mockReturnValue({ mid: "0" });
  createOffer = vi.fn().mockResolvedValue({ type: "offer", sdp: "v=0\r\no=mock-offer" });
  setLocalDescription = vi.fn().mockResolvedValue(undefined);
  setRemoteDescription = vi.fn().mockResolvedValue(undefined);
  close = vi.fn().mockImplementation(() => { this.signalingState = "closed"; });
}

class MockRTCSessionDescription {
  type: string;
  sdp: string;
  constructor(init?: { type?: string; sdp?: string }) {
    this.type = init?.type || "offer";
    this.sdp = init?.sdp || "";
  }
}

describe("useLiveTranslation Hook", () => {
  beforeEach(() => {
    const g = globalThis as Record<string, unknown>;
    const w = window as unknown as Record<string, unknown>;
    g.RTCPeerConnection = MockRTCPeerConnection;
    w.RTCPeerConnection = MockRTCPeerConnection;
    g.RTCSessionDescription = MockRTCSessionDescription;
    w.RTCSessionDescription = MockRTCSessionDescription;
    g.MediaStream = MockMediaStream;
    w.MediaStream = MockMediaStream;
    g.WebSocket = MockWebSocket;
    w.WebSocket = MockWebSocket;
    w.AudioContext = MockAudioContext;
    w.AudioWorkletNode = MockAudioWorkletNode;

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        sessionId: 'cf-session-mock',
        sessionDescription: { type: 'answer', sdp: 'v=0' }
      })
    });
    w.fetch = mockFetch;
    g.fetch = mockFetch;

    const mockDevices = [
      { deviceId: "default", kind: "audioinput", label: "Standardmikrofon" },
      { deviceId: "mic-2", kind: "audioinput", label: "NDI Audio Input" },
    ];
    const mockTrack = { id: "track-1", kind: "audio", stop: vi.fn() };
    const mockStream = {
      id: "stream-1",
      getTracks: () => [mockTrack],
      getAudioTracks: () => [mockTrack],
    };

    Object.defineProperty(navigator, "mediaDevices", {
      writable: true,
      value: {
        enumerateDevices: vi.fn().mockResolvedValue(mockDevices),
        getUserMedia: vi.fn().mockResolvedValue(mockStream),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initieras med status 'idle', standardspråk 'sv' och transportMode 'sfu'", () => {
    const { result } = renderHook(() => useLiveTranslation());
    expect(result.current.status).toBe("idle");
    expect(result.current.targetLanguage).toBe("sv");
    expect(result.current.activeLanguages).toEqual(["sv"]);
    expect(result.current.transportMode).toBe("sfu");
    expect(result.current.audioLevel).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it("ändrar målspråk och aktiva språk med toggleActiveLanguage och setTargetLanguage", () => {
    const { result } = renderHook(() => useLiveTranslation());
    act(() => { result.current.toggleActiveLanguage("en"); });
    expect(result.current.activeLanguages).toEqual(["sv", "en"]);
    act(() => { result.current.setTargetLanguage("en"); });
    expect(result.current.targetLanguage).toBe("en");
  });

  it("tillåter byte av transportMode mellan sfu och local_ws", () => {
    const { result } = renderHook(() => useLiveTranslation());
    expect(result.current.transportMode).toBe("sfu");
    act(() => { result.current.setTransportMode("local_ws"); });
    expect(result.current.transportMode).toBe("local_ws");
    act(() => { result.current.setTransportMode("sfu"); });
    expect(result.current.transportMode).toBe("sfu");
  });

  it("initieras med transportMode 'local_ws' om VITE_AUDIO_SOURCE är 'WEBSOCKET'", () => {
    const originalEnv = process.env.VITE_AUDIO_SOURCE;
    process.env.VITE_AUDIO_SOURCE = "WEBSOCKET";
    try {
      const { result } = renderHook(() => useLiveTranslation());
      expect(result.current.transportMode).toBe("local_ws");
    } finally {
      process.env.VITE_AUDIO_SOURCE = originalEnv;
    }
  });

  it("låser upp och initierar AudioContext synkront via unlockAudioContext", () => {
    const { result } = renderHook(() => useLiveTranslation());
    act(() => { result.current.unlockAudioContext(); });
    expect(result.current.status).toBe("idle");
  });

  it("startar tolkning med SFU-transport och laddar MicCapture worklet med flexibla constraints", async () => {
    const { result } = renderHook(() => useLiveTranslation());
    await act(async () => {
      await result.current.startTranslation();
    });
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        sampleRate: { ideal: 16000 },
      },
    });
    act(() => { result.current.panicMute(); });
    expect(result.current.status).toBe("idle");
    expect(result.current.audioLevel).toBe(0);
  });

  it("anropar getUserMedia med flexibla enhetsconstraints vid vald mikrofon", async () => {
    const { result } = renderHook(() => useLiveTranslation());
    act(() => { result.current.setSelectedDeviceId("mic-2"); });
    await act(async () => {
      await result.current.startTranslation();
    });
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        sampleRate: { ideal: 16000 },
        deviceId: { ideal: "mic-2" },
      },
    });
  });

  it("fångar och hanterar OverconstrainedError graciöst vid ljudfångst", async () => {
    const overconstrainedErr = new Error("Requested device constraints not available");
    overconstrainedErr.name = "OverconstrainedError";
    vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValueOnce(overconstrainedErr);

    const { result } = renderHook(() => useLiveTranslation());
    await act(async () => {
      await result.current.startTranslation();
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBe("Requested device constraints not available");
  });

  it("startar tolkning med local_ws och kopplar ner vid transportbyte och stopTranslation", async () => {
    const { result } = renderHook(() => useLiveTranslation());
    act(() => { result.current.setTransportMode("local_ws"); });
    await act(async () => {
      await result.current.startTranslation();
    });
    expect(result.current.transportMode).toBe("local_ws");

    act(() => {
      result.current.setTransportMode("sfu");
    });
    expect(result.current.transportMode).toBe("sfu");

    act(() => {
      result.current.stopTranslation();
    });
    expect(result.current.status).toBe("idle");
  });
});

