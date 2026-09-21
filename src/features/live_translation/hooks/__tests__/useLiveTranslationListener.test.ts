import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLiveTranslationListener } from "../useLiveTranslationListener";

const mockInitAudio = vi.fn().mockResolvedValue(undefined);
const mockPlayAudioChunk = vi.fn();
const mockStopAudio = vi.fn();

vi.mock("../useAudioPlayer", () => ({
  useAudioPlayer: () => ({
    initAudio: mockInitAudio,
    playAudioChunk: mockPlayAudioChunk,
    stopAudio: mockStopAudio,
  }),
}));

class MockWebSocket {
  static instances: MockWebSocket[] = [];
  url: string;
  readyState = 1;
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: unknown }) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: ((error: unknown) => void) | null = null;
  send = vi.fn();
  close = vi.fn().mockImplementation(() => {
    this.readyState = 3;
    this.onclose?.();
  });

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
    setTimeout(() => {
      this.onopen?.();
    }, 5);
  }
}

describe("useLiveTranslationListener", () => {
  let originalWebSocket: typeof WebSocket;

  beforeEach(() => {
    MockWebSocket.instances = [];
    originalWebSocket = globalThis.WebSocket;
    (globalThis as unknown as { WebSocket: unknown }).WebSocket = MockWebSocket;
    (window as unknown as { WebSocket: unknown }).WebSocket = MockWebSocket;
    vi.clearAllMocks();
  });

  afterEach(() => {
    (globalThis as unknown as { WebSocket: unknown }).WebSocket = originalWebSocket;
    (window as unknown as { WebSocket: unknown }).WebSocket = originalWebSocket;
  });

  it("initierar anslutning mot /ws/translation med rätt språk", () => {
    const { result } = renderHook(() =>
      useLiveTranslationListener({ initialLanguage: "en" })
    );

    expect(result.current.selectedLanguage).toBe("en");
    expect(result.current.isListening).toBe(false);
    expect(MockWebSocket.instances.length).toBeGreaterThan(0);
    expect(MockWebSocket.instances[0].url).toContain("/ws/translation");
  });

  it("växlar lyssningstillstånd och anropar initAudio/stopAudio", async () => {
    const { result } = renderHook(() => useLiveTranslationListener());

    await act(async () => {
      result.current.toggleListening();
    });

    expect(mockInitAudio).toHaveBeenCalled();
    expect(result.current.isListening).toBe(true);

    act(() => {
      result.current.toggleListening();
    });

    expect(mockStopAudio).toHaveBeenCalled();
    expect(result.current.isListening).toBe(false);
  });

  it("fångar WebSocket-anslutningsfel och loggar till konsolen", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() => useLiveTranslationListener());

    const wsInstance = MockWebSocket.instances[0];
    act(() => {
      wsInstance.onerror?.(new Event("error"));
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[useLiveTranslationListener]"),
      expect.anything()
    );
    expect(result.current.connStatus).toBe("disconnected");
    consoleSpy.mockRestore();
  });

  it("loggar varning vid oväntad nedkoppling", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { result } = renderHook(() => useLiveTranslationListener());

    const wsInstance = MockWebSocket.instances[0];
    act(() => {
      // Simulera icke-ren nedkoppling
      (wsInstance as unknown as { onclose: (evt: unknown) => void }).onclose?.({
        wasClean: false,
        code: 1006,
        reason: "Abnormal Closure",
      });
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("WebSocket stängdes oväntat")
    );
    expect(result.current.connStatus).toBe("disconnected");
    consoleSpy.mockRestore();
  });
});
