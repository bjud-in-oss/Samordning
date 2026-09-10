import http from "http";
import fs from "fs";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";

export interface TranslationSessionState {
  active: boolean;
  language: string;
  inputMode: string;
  streaming: boolean;
  clientCount: number;
}

let active = false;
let activeLanguage = "en";
let streamInterval: NodeJS.Timeout | null = null;
const clients: Set<WebSocket> = new Set();
let wssInstance: WebSocketServer | null = null;

function getAudioFixturePath(): string | null {
  const possiblePaths = [
    path.join(process.cwd(), "src/features/live_translation/__tests__/fixtures/output-translated.wav"),
    path.join(process.cwd(), "output-translated.wav"),
    path.join(process.cwd(), "test-audio-16k.wav")
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export function startFileStream(language = activeLanguage, loop = true): boolean {
  if (streamInterval) {
    clearInterval(streamInterval);
    streamInterval = null;
  }

  const audioPath = getAudioFixturePath();
  if (!audioPath) {
    console.warn("[TranslationServer] Ingen ljudfil hittades för strömning.");
    return false;
  }

  try {
    const wavBuffer = fs.readFileSync(audioPath);
    // Skala bort standard 44-byte WAV header för rå PCM-strömning
    const pcmBuffer = wavBuffer.subarray(44);
    const chunkSize = 4800; // 100 ms vid 24000 Hz, 16-bit mono
    let offset = 0;

    console.log(`[TranslationServer] Startar ljudströmning (${pcmBuffer.length} bytes PCM, sprÃ¥k: ${language})`);

    streamInterval = setInterval(() => {
      if (clients.size === 0 && !active) {
        stopFileStream();
        return;
      }

      if (offset >= pcmBuffer.length) {
        if (loop) {
          offset = 0;
        } else {
          stopFileStream();
          return;
        }
      }

      const chunk = pcmBuffer.subarray(offset, Math.min(offset + chunkSize, pcmBuffer.length));
      offset += chunkSize;

      const payload = JSON.stringify({
        type: "audio",
        language,
        data: chunk.toString("base64"),
        sampleRate: 24000,
        timestamp: Date.now()
      });

      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          try {
            client.send(payload);
          } catch (err) {
            console.error("[TranslationServer] Fel vid sändning till klient:", err);
          }
        }
      }
    }, 100);

    return true;
  } catch (err) {
    console.error("[TranslationServer] Fel vid inläsning av ljudfil:", err);
    return false;
  }
}

export function stopFileStream(): void {
  if (streamInterval) {
    clearInterval(streamInterval);
    streamInterval = null;
    console.log("[TranslationServer] Ljudströmning stoppad.");
  }
}

export function startTranslationSession(lang = "en"): { success: boolean; language: string; replyMessage: string } {
  active = true;
  activeLanguage = lang.toLowerCase();

  const inputMode = process.env.INPUT_MODE || "file";
  if (inputMode === "file") {
    startFileStream(activeLanguage, true);
  }

  const broadcastMsg = JSON.stringify({
    type: "session_started",
    language: activeLanguage,
    inputMode
  });

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(broadcastMsg);
      } catch (e) {
        // Ignorera
      }
    }
  }

  return {
    success: true,
    language: activeLanguage,
    replyMessage: `Realtidstolkning aktiverad för ${activeLanguage.toUpperCase()}. Lyssna här: ?mode=listen&lang=${activeLanguage}`
  };
}

export function stopTranslationSession(): { success: boolean; replyMessage: string } {
  active = false;
  stopFileStream();

  const broadcastMsg = JSON.stringify({
    type: "session_stopped",
    language: activeLanguage
  });

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(broadcastMsg);
      } catch (e) {
        // Ignorera
      }
    }
  }

  return {
    success: true,
    replyMessage: "Realtidstolkning avslutad."
  };
}

export function getTranslationSessionStatus(): TranslationSessionState {
  return {
    active,
    language: activeLanguage,
    inputMode: process.env.INPUT_MODE || "file",
    streaming: streamInterval !== null,
    clientCount: clients.size
  };
}

export function setupTranslationWebSocket(server: http.Server): WebSocketServer {
  const wss = wssInstance || new WebSocketServer({ noServer: true });
  wssInstance = wss;

  server.on("upgrade", (request, socket, head) => {
    try {
      const url = new URL(request.url || "", `http://${request.headers.host || "localhost"}`);
      if (url.pathname === "/ws/translation") {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit("connection", ws, request);
        });
      }
    } catch (err) {
      console.error("[TranslationServer] Fel vid WebSocket upgrade:", err);
      socket.destroy();
    }
  });

  wss.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {
    clients.add(ws);
    console.log(`[TranslationServer] Ny tolkklient ansluten. Aktiva klienter: ${clients.size}`);

    // Skicka omedelbar status till klienten
    ws.send(JSON.stringify({
      type: "status",
      active,
      language: activeLanguage,
      inputMode: process.env.INPUT_MODE || "file",
      sampleRate: 24000
    }));

    // Om INPUT_MODE är "file" eller aktiv session, påbörja strömning om den inte redan körs
    const inputMode = process.env.INPUT_MODE || "file";
    if (inputMode === "file" && !streamInterval) {
      startFileStream(activeLanguage, true);
    }

    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === "start") {
          startTranslationSession(msg.language || activeLanguage);
        } else if (msg.type === "stop") {
          stopTranslationSession();
        } else if (msg.type === "ping") {
          ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
        }
      } catch (e) {
        // Icke-JSON ignorerad eller binär
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
      console.log(`[TranslationServer] Tolkklient frånkopplad. Kvarvarande klienter: ${clients.size}`);
      if (clients.size === 0 && !active && streamInterval) {
        stopFileStream();
      }
    });

    ws.on("error", (err) => {
      console.error("[TranslationServer] WebSocket klientfel:", err);
      clients.delete(ws);
    });
  });

  return wss;
}
