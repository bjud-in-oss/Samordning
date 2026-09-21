import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import React from "react";
import { LiveTranslationListenerWidget } from "../LiveTranslationListenerWidget";

// Mock useAudioPlayer
const mockInitAudio = vi.fn().mockResolvedValue(undefined);
const mockPlayAudioChunk = vi.fn();
const mockStopAudio = vi.fn();

vi.mock("../../hooks/useAudioPlayer", () => ({
  useAudioPlayer: () => ({
    initAudio: mockInitAudio,
    playAudioChunk: mockPlayAudioChunk,
    stopAudio: mockStopAudio,
  }),
}));

class MockWebSocket {
  static instances: MockWebSocket[] = [];
  url: string;
  readyState = 1; // OPEN
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
    }, 10);
  }
}

describe("LiveTranslationListenerWidget", () => {
  let originalWebSocket: typeof WebSocket;
  let getUserMediaMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    MockWebSocket.instances = [];
    originalWebSocket = globalThis.WebSocket;
    (globalThis as unknown as { WebSocket: unknown }).WebSocket = MockWebSocket;
    (window as unknown as { WebSocket: unknown }).WebSocket = MockWebSocket;

    getUserMediaMock = vi.fn();
    Object.defineProperty(navigator, "mediaDevices", {
      writable: true,
      value: {
        getUserMedia: getUserMediaMock,
      },
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    (globalThis as unknown as { WebSocket: unknown }).WebSocket = originalWebSocket;
    (window as unknown as { WebSocket: unknown }).WebSocket = originalWebSocket;
  });

  it("renderar lyssnarvyn med språkval och ansluter till WebSocket", async () => {
    render(<LiveTranslationListenerWidget />);

    expect(screen.getByText("Direktöversättning")).toBeDefined();
    expect(screen.getByRole("button", { name: /lyssna nu/i })).toBeDefined();

    await waitFor(() => {
      expect(MockWebSocket.instances.length).toBeGreaterThan(0);
    });

    const ws = MockWebSocket.instances[0];
    expect(ws.url).toContain("/ws/translation");
  });

  it("anropar ALDRIG getUserMedia eller begär mikrofonbehörighet", () => {
    render(<LiveTranslationListenerWidget />);
    expect(getUserMediaMock).not.toHaveBeenCalled();
  });

  it("startar ljudmotorn vid klick på 'Lyssna nu' och tillåter pausning", async () => {
    render(<LiveTranslationListenerWidget />);

    const listenButton = screen.getByRole("button", { name: /lyssna nu/i });
    fireEvent.click(listenButton);

    await waitFor(() => {
      expect(mockInitAudio).toHaveBeenCalled();
    });

    const pauseButton = await screen.findByRole("button", { name: /pausa/i });
    expect(pauseButton).toBeDefined();

    fireEvent.click(pauseButton);
    expect(mockStopAudio).toHaveBeenCalled();
  });

  it("vidarebefordrar inkommande ljudpaket till playAudioChunk när lyssning är aktiv", async () => {
    render(<LiveTranslationListenerWidget />);

    // Start listening
    const listenButton = screen.getByRole("button", { name: /lyssna nu/i });
    fireEvent.click(listenButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /pausa/i })).toBeDefined();
    });

    await waitFor(() => {
      expect(MockWebSocket.instances.length).toBeGreaterThan(0);
    });

    const ws = MockWebSocket.instances[0];

    // Simulate incoming translation audio packet
    const base64Audio = "dGVzdC1hdWRpby1kYXRh";
    act(() => {
      ws.onmessage?.({
        data: JSON.stringify({
          type: "audio",
          language: "sv",
          data: base64Audio,
        }),
      });
    });

    expect(mockPlayAudioChunk).toHaveBeenCalledWith(base64Audio);
  });

  it("tillåter användaren att välja målspråk", async () => {
    const onLanguageChange = vi.fn();
    render(<LiveTranslationListenerWidget onLanguageChange={onLanguageChange} />);

    const languageSelect = screen.getByRole("combobox", { name: /målspråk/i });
    expect(languageSelect).toBeDefined();

    fireEvent.change(languageSelect, { target: { value: "en" } });

    expect(onLanguageChange).toHaveBeenCalledWith("en");
  });
});
