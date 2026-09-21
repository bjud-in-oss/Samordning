import { useState, useEffect, useRef, useCallback } from "react";
import type { SupportedLanguage } from "../domain/types";
import { useAudioPlayer } from "./useAudioPlayer";

export interface UseLiveTranslationListenerOptions {
  initialLanguage?: SupportedLanguage;
  onLanguageChange?: (language: SupportedLanguage) => void;
}

export interface UseLiveTranslationListenerReturn {
  selectedLanguage: SupportedLanguage;
  isListening: boolean;
  connStatus: "connecting" | "connected" | "disconnected";
  packetCount: number;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleListening: () => void;
}

function getWebSocketUrl(): string {
  if (typeof window !== "undefined" && window.location) {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host || "localhost:3000"}/ws/translation`;
  }
  return "ws://localhost:3000/ws/translation";
}

export function useLiveTranslationListener(
  options: UseLiveTranslationListenerOptions = {}
): UseLiveTranslationListenerReturn {
  const { initialLanguage = "sv", onLanguageChange } = options;
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(initialLanguage);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [connStatus, setConnStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [packetCount, setPacketCount] = useState<number>(0);

  const { initAudio, playAudioChunk, stopAudio } = useAudioPlayer();
  const wsRef = useRef<WebSocket | null>(null);
  const isListeningRef = useRef<boolean>(false);
  const languageRef = useRef<SupportedLanguage>(selectedLanguage);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    languageRef.current = selectedLanguage;
  }, [selectedLanguage]);

  useEffect(() => {
    let isCancelled = false;
    const url = getWebSocketUrl();
    const ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onopen = () => {
      if (isCancelled) return;
      console.log("[useLiveTranslationListener] WebSocket ansluten till /ws/translation");
      setConnStatus("connected");
      ws.send(JSON.stringify({ type: "identify", clientType: "listener", language: languageRef.current }));
    };

    ws.onmessage = (event) => {
      if (isCancelled || !isListeningRef.current) return;

      if (typeof event.data === "string") {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "audio" && typeof msg.data === "string") {
            if (!msg.language || msg.language === languageRef.current) {
              playAudioChunk(msg.data);
              setPacketCount((prev) => prev + 1);
            }
          }
        } catch {
          // Ignorera felaktigt formaterade paket
        }
      } else if (event.data instanceof ArrayBuffer) {
        const bytes = new Uint8Array(event.data);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
        playAudioChunk(window.btoa(binary));
        setPacketCount((prev) => prev + 1);
      }
    };

    ws.onclose = (event: CloseEvent) => {
      if (!isCancelled) {
        if (!event.wasClean && event.code !== 1000) {
          console.warn(`[useLiveTranslationListener] WebSocket stängdes oväntat (kod: ${event.code}, orsak: ${event.reason || "okänd"})`);
        } else {
          console.log("[useLiveTranslationListener] WebSocket stängdes normalt");
        }
        setConnStatus("disconnected");
      }
    };

    ws.onerror = (error: Event) => {
      console.error("[useLiveTranslationListener] Fel i WebSocket-anslutningen mot /ws/translation:", error);
      if (!isCancelled) setConnStatus("disconnected");
    };

    return () => {
      isCancelled = true;
      ws.close();
      wsRef.current = null;
    };
  }, [playAudioChunk]);

  const toggleListening = useCallback(() => {
    if (!isListeningRef.current) {
      void initAudio().then(() => {
        setIsListening(true);
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "set_language", language: languageRef.current }));
        }
      });
    } else {
      stopAudio();
      setIsListening(false);
    }
  }, [initAudio, stopAudio]);

  const setLanguage = useCallback(
    (lang: SupportedLanguage) => {
      setSelectedLanguage(lang);
      onLanguageChange?.(lang);
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "set_language", language: lang }));
      }
    },
    [onLanguageChange]
  );

  return {
    selectedLanguage,
    isListening,
    connStatus,
    packetCount,
    setLanguage,
    toggleListening,
  };
}
