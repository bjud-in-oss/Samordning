import http from "http";
import fs from "fs";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";
import { AudioResampler } from "../features/live_translation/domain/audioResampler";
import { HotSwapManager } from "../features/live_translation/domain/hotSwapManager";

export type AudioSourceType = "SYSTEM_AUDIO" | "VMIX" | "VIRTUAL_CARD" | "WEBSOCKET";

export interface TranslationSessionState {
  active: boolean;
  language: string;
  inputMode: string;
  streaming: boolean;
  clientCount: number;
  audioSource: string;
  rotationCount: number;
}

let active = false;
let activeLanguage = "en";
let streamInterval: NodeJS.Timeout | null = null;
const clients: Set<WebSocket> = new Set();
let wssInstance: WebSocketServer | null = null;
let standaloneWss: WebSocketServer | null = null;
let rotationCount = 0;

const initialSource = process.env.AUDIO_SOURCE?.toUpperCase() || "WEBSOCKET";
let audioSource: "SYSTEM_AUDIO" | "WEBSOCKET" = 
  (initialSource === "SYSTEM_AUDIO" || initialSource === "VMIX" || initialSource === "VIRTUAL_CARD") ? "SYSTEM_AUDIO" : "WEBSOCKET";

const hotSwapManager = new HotSwapManager((handle) => triggerHotSwapRotation(handle || undefined));
const OPUS_MAGIC = 0x4f505553;

export function setAudioSource(source: AudioSourceType): void {
  const norm = String(source).toUpperCase();
  audioSource = (norm === "SYSTEM_AUDIO" || norm === "VMIX" || norm === "VIRTUAL_CARD") ? "SYSTEM_AUDIO" : "WEBSOCKET";
}

export function getAudioSource(): "SYSTEM_AUDIO" | "WEBSOCKET" {
  return audioSource;
}

export function encodeOpusFrame(pcm: Int16Array): Buffer {
  const buf = Buffer.alloc(8 + pcm.length * 2);
  buf.writeUInt32BE(OPUS_MAGIC, 0);
  buf.writeUInt32BE(pcm.length, 4);
  for (let i = 0; i < pcm.length; i++) buf.writeInt16LE(pcm[i] ?? 0, 8 + i * 2);
  return buf;
}

export function decodeOpusFrame(buffer: Buffer): Int16Array {
  if (buffer.length >= 8 && buffer.readUInt32BE(0) === OPUS_MAGIC) {
    const samplesCount = buffer.readUInt32BE(4);
    const out = new Int16Array(samplesCount);
    for (let i = 0; i < samplesCount; i++) out[i] = buffer.readInt16LE(8 + i * 2);
    return out;
  }
  const samples = Math.floor(buffer.length / 2);
  const out = new Int16Array(samples);
  for (let i = 0; i < samples; i++) out[i] = buffer.readInt16LE(i * 2);
  return out;
}

export function ingestSystemAudio48k(input48k: Float32Array): Int16Array {
  const resampled16k = AudioResampler.downsample48kTo16k(input48k);
  if (active) broadcastAudioChunk(encodeOpusFrame(resampled16k), "opus");
  return resampled16k;
}

export function handleIncomingClientAudio(data: Buffer | ArrayBuffer, format: "pcm" | "opus" = "pcm"): boolean {
  try {
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const samples = format === "opus" ? decodeOpusFrame(buf) : new Int16Array(buf.buffer, buf.byteOffset, Math.floor(buf.byteLength / 2));
    if (active) broadcastAudioChunk(format === "opus" ? buf : encodeOpusFrame(samples), "opus");
    return true;
  } catch (err) {
    console.error("[TranslationServer] Fel vid inkommande ljud:", err);
    return false;
  }
}

export function broadcastAudioChunk(chunk: Buffer, format: "pcm" | "opus" = "opus"): number {
  let sentCount = 0;
  const jsonPayload = JSON.stringify({
    type: "audio", format, language: activeLanguage, data: chunk.toString("base64"), timestamp: Date.now()
  });
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      try { client.send(chunk); sentCount++; }
      catch {
        try { client.send(jsonPayload); sentCount++; }
        catch (e2) { console.warn("[TranslationServer] Klient ej nåbar:", e2); }
      }
    }
  }
  return sentCount;
}

export function triggerHotSwapRotation(resumptionToken?: string): { success: boolean; resumptionToken?: string } {
  rotationCount++;
  if (resumptionToken) hotSwapManager.updateResumptionHandle(resumptionToken);
  console.log(`[TranslationServer] Hot-swap (#${rotationCount}, token: ${resumptionToken || "none"})`);
  return { success: true, resumptionToken };
}

function getAudioFixturePath(): string | null {
  const paths = ["src/features/live_translation/__tests__/fixtures/output-translated.wav", "output-translated.wav", "test-audio-16k.wav"].map(p => path.join(process.cwd(), p));
  return paths.find(p => fs.existsSync(p)) || null;
}

export function startFileStream(language = activeLanguage, loop = true): boolean {
  if (streamInterval) { clearInterval(streamInterval); streamInterval = null; }
  const audioPath = getAudioFixturePath();
  if (!audioPath) return false;
  try {
    const pcm = fs.readFileSync(audioPath).subarray(44);
    const chunkSize = 4800;
    let offset = 0;
    streamInterval = setInterval(() => {
      if (clients.size === 0 && !active) { stopFileStream(); return; }
      if (offset >= pcm.length) {
        if (loop) offset = 0;
        else { stopFileStream(); return; }
      }
      const chunk = pcm.subarray(offset, Math.min(offset + chunkSize, pcm.length));
      offset += chunkSize;
      broadcastAudioChunk(chunk, "pcm");
    }, 100);
    return true;
  } catch (err) {
    console.error("[TranslationServer] Fel vid filljud:", err);
    return false;
  }
}

export function stopFileStream(): void {
  if (streamInterval) { clearInterval(streamInterval); streamInterval = null; }
}

function broadcastToClients(msg: string) {
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      try { client.send(msg); } catch (e) { console.warn(e); }
    }
  }
}

export function startTranslationSession(lang = "en"): { success: boolean; language: string; replyMessage: string } {
  active = true;
  activeLanguage = lang.toLowerCase();
  hotSwapManager.armTimer();
  if (process.env.INPUT_MODE === "file") startFileStream(activeLanguage, true);
  broadcastToClients(JSON.stringify({ type: "session_started", language: activeLanguage, audioSource }));
  return {
    success: true,
    language: activeLanguage,
    replyMessage: `Realtidstolkning aktiverad för ${activeLanguage.toUpperCase()}. Lyssna här: ?mode=listen&lang=${activeLanguage}`
  };
}

export function stopTranslationSession(): { success: boolean; replyMessage: string } {
  active = false;
  hotSwapManager.disarmTimer();
  stopFileStream();
  broadcastToClients(JSON.stringify({ type: "session_stopped", language: activeLanguage }));
  return { success: true, replyMessage: "Realtidstolkning avslutad." };
}

export function getTranslationSessionStatus(): TranslationSessionState {
  return {
    active,
    language: activeLanguage,
    inputMode: audioSource === "SYSTEM_AUDIO" ? "system_audio" : (process.env.INPUT_MODE || "websocket"),
    streaming: streamInterval !== null || active,
    clientCount: clients.size,
    audioSource,
    rotationCount
  };
}

function handleWsConnection(ws: WebSocket) {
  clients.add(ws);
  console.log(`[TranslationServer] Ny WebSocket-klient ansluten till /ws/translation. Totalt: ${clients.size}`);
  ws.send(JSON.stringify({ type: "status", active, language: activeLanguage, audioSource, sampleRate: 24000 }));
  ws.on("message", (raw, isBinary) => {
    if (isBinary || Buffer.isBuffer(raw)) { handleIncomingClientAudio(raw as Buffer, "opus"); return; }
    try {
      const msg = JSON.parse(raw.toString());
      if (msg.type === "start") startTranslationSession(msg.language || activeLanguage);
      else if (msg.type === "stop") stopTranslationSession();
      else if (msg.type === "audio" && msg.data) handleIncomingClientAudio(Buffer.from(msg.data, "base64"), msg.format || "opus");
      else if (msg.type === "ping") ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
    } catch (e) { console.debug("[TranslationServer] Icke-JSON:", e); }
  });
  ws.on("close", (code, reason) => {
    clients.delete(ws);
    console.log(`[TranslationServer] Frånkopplad (kod: ${code}, orsak: ${reason?.toString() || "normal"}). Kvar: ${clients.size}`);
    if (clients.size === 0 && !active && streamInterval) stopFileStream();
  });
  ws.on("error", (err) => { console.error("[TranslationServer] WebSocket-klientfel:", err); clients.delete(ws); });
}

export function setupTranslationWebSocket(server: http.Server, port?: number): WebSocketServer {
  const wss = wssInstance || new WebSocketServer({ noServer: true });
  wssInstance = wss;

  const serverAny = server as unknown as { __translationWsAttached?: boolean };
  if (!serverAny.__translationWsAttached) {
    serverAny.__translationWsAttached = true;
    server.on("upgrade", (request, socket, head) => {
      try {
        if (socket.destroyed) return;
        socket.on("error", (err) => console.error("[TranslationServer] Socketfel vid upgrade:", err));
        const host = request.headers.host || "localhost";
        const url = new URL(request.url || "", `http://${host}`);
        if (url.pathname.replace(/\/+$/, "") === "/ws/translation") {
          socket.setTimeout(0);
          socket.setKeepAlive(true, 10000);
          wss.handleUpgrade(request, socket, head, (ws) => wss.emit("connection", ws, request));
        }
      } catch (err) {
        console.error("[TranslationServer] Upgrade fel mot /ws/translation:", err);
      }
    });
  }

  const wssAny = wss as unknown as { __connectionHandlerAttached?: boolean };
  if (!wssAny.__connectionHandlerAttached) {
    wssAny.__connectionHandlerAttached = true;
    wss.on("connection", (ws) => handleWsConnection(ws));
    wss.on("error", (err) => console.error("[TranslationServer] WebSocketServer-fel:", err));
  }

  const wsPort = port || (process.env.WS_PORT ? parseInt(process.env.WS_PORT, 10) : undefined);
  if (wsPort && wsPort !== 3000 && wsPort !== 8080 && !standaloneWss) {
    try {
      standaloneWss = new WebSocketServer({ port: wsPort }, () => console.log(`[TranslationServer] WS öppen på port ${wsPort}`));
      standaloneWss.on("error", (err) => console.warn(`[TranslationServer] WS-port ${wsPort} ej tillgänglig:`, err.message));
      standaloneWss.on("connection", (ws) => handleWsConnection(ws));
    } catch (e) { console.warn(`[TranslationServer] Kunde inte binda WS på port ${wsPort}:`, e); }
  }
  return wss;
}
