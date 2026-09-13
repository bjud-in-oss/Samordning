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
});
