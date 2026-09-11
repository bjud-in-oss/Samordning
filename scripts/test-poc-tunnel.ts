// scripts/test-poc-tunnel.ts
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 8080;
const primaryWav = path.join(process.cwd(), 'src/features/live_translation/__tests__/fixtures/output-translated.wav');
const fallbackWav = path.join(process.cwd(), 'src/features/live_translation/__tests__/fixtures/test-audio-16k.wav');
const TEST_WAV = fs.existsSync(primaryWav) ? primaryWav : fallbackWav;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head><title>PoC Live Audio Test</title></head>
    <body style="font-family:sans-serif; padding:20px; text-align:center;">
      <h2>PoC Live Translation Stream</h2>
      <button id="startBtn" style="font-size:18px; padding:12px 24px;">🎧 Starta Ljudström</button>
      <p id="status">Status: Ej ansluten</p>
      <script>
        const btn = document.getElementById('startBtn');
        const status = document.getElementById('status');
        btn.onclick = async () => {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
          const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
          const ws = new WebSocket(wsProtocol + '//' + location.host + '/ws/translation');
          ws.binaryType = 'arraybuffer';

          ws.onopen = () => { status.innerText = 'Status: Ansluten – Lyssnar...'; };
          ws.onmessage = (evt) => {
            if (evt.data instanceof ArrayBuffer) {
              const int16 = new Int16Array(evt.data);
              const float32 = new Float32Array(int16.length);
              for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32768;
              const buffer = audioCtx.createBuffer(1, float32.length, 24000);
              buffer.getChannelData(0).set(float32);
              const src = audioCtx.createBufferSource();
              src.buffer = buffer;
              src.connect(audioCtx.destination);
              src.start();
            }
          };
          ws.onclose = () => { status.innerText = 'Status: Frånkopplad'; };
        };
      </script>
    </body>
    </html>
  `);
});

const wss = new WebSocketServer({ server, path: '/ws/translation' });

wss.on('connection', (ws) => {
  console.log('[PoC Server] Ny klient ansluten!');
  if (!fs.existsSync(TEST_WAV)) {
    console.error('[PoC Server] Testljudfil saknas!');
    return;
  }

  const audioData = fs.readFileSync(TEST_WAV);
  let offset = 44; // Hoppa över WAV-header
  const chunkSize = 960 * 2; // 20ms i 24kHz PCM16

  const interval = setInterval(() => {
    if (ws.readyState !== WebSocket.OPEN) {
      clearInterval(interval);
      return;
    }
    if (offset + chunkSize >= audioData.length) offset = 44; // Loopa filen
    const chunk = audioData.subarray(offset, offset + chunkSize);
    ws.send(chunk);
    offset += chunkSize;
  }, 20);

  ws.on('close', () => clearInterval(interval));
});

server.listen(PORT, () => {
  console.log(`[PoC Server] Körs på http://localhost:${PORT}`);
});