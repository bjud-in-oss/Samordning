// scripts/test-poc-tunnel.ts
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 8080;
const TEST_WAV = path.join(
  process.cwd(),
  'src/features/live_translation/__tests__/fixtures/output-translated.wav'
);

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PoC Tvåvägsljud Test</title>
    </head>
    <body style="font-family:sans-serif; padding:20px; text-align:center;">
      <h2>PoC Tvåvägsljud (Full-Duplex)</h2>
      <p id="status">Status: Ej ansluten</p>
      <button id="startBtn" style="font-size:18px; padding:12px 20px; margin:10px;">🎧 Starta Mottagning</button>
      <button id="micBtn" style="font-size:18px; padding:12px 20px; margin:10px;" disabled>🎙️ Skicka Mikrofonljud</button>
      <p id="stats">Mottaget: 0 bytes | Skickat: 0 bytes</p>

      <script>
        const btn = document.getElementById('startBtn');
        const micBtn = document.getElementById('micBtn');
        const status = document.getElementById('status');
        const stats = document.getElementById('stats');

        let ws;
        let audioCtx;
        let rxBytes = 0;
        let txBytes = 0;

        btn.onclick = async () => {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
          const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
          ws = new WebSocket(wsProtocol + '//' + location.host + '/ws/translation');
          ws.binaryType = 'arraybuffer';

          ws.onopen = () => {
            status.innerText = 'Status: Ansluten (Tvåvägs redo)';
            micBtn.disabled = false;
          };

          ws.onmessage = (evt) => {
            if (evt.data instanceof ArrayBuffer) {
              rxBytes += evt.data.byteLength;
              stats.innerText = \`Mottaget: \${rxBytes} B | Skickat: \${txBytes} B\`;

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

          ws.onclose = () => {
            status.innerText = 'Status: Frånkopplad';
            micBtn.disabled = true;
          };
        };

        micBtn.onclick = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const micStream = audioCtx.createMediaStreamSource(stream);
            const processor = audioCtx.createScriptProcessor(2048, 1, 1);

            processor.onaudioprocess = (e) => {
              if (ws && ws.readyState === WebSocket.OPEN) {
                const input = e.inputBuffer.getChannelData(0);
                const int16 = new Int16Array(input.length);
                for (let i = 0; i < input.length; i++) {
                  int16[i] = Math.max(-1, Math.min(1, input[i])) * 32767;
                }
                ws.send(int16.buffer);
                txBytes += int16.buffer.byteLength;
                stats.innerText = \`Mottaget: \${rxBytes} B | Skickat: \${txBytes} B\`;
              }
            };

            micStream.connect(processor);
            processor.connect(audioCtx.destination);
            micBtn.innerText = '🎙️ Skickar Mikrofon...';
            micBtn.style.background = '#81c784';
          } catch (err) {
            alert('Mikrofonåtkomst nekades: ' + err.message);
          }
        };
      </script>
    </body>
    </html>
  `);
});

const wss = new WebSocketServer({ server, path: '/ws/translation' });

wss.on('connection', (ws) => {
  console.log('[PoC Server] Ny klient ansluten!');
  let bytesReceived = 0;

  ws.on('message', (data) => {
    if (Buffer.isBuffer(data) || data instanceof ArrayBuffer) {
      bytesReceived += data.byteLength || (data as Buffer).length;
      process.stdout.write(
        `\r[PoC Server] 📥 Inkommande mikrofonljud från mobil: ${bytesReceived} bytes mottagna`
      );
    }
  });

  if (!fs.existsSync(TEST_WAV)) {
    console.error('\n[PoC Server] Testljudfil saknas!');
    return;
  }

  const audioData = fs.readFileSync(TEST_WAV);
  let offset = 44;
  const chunkSize = 960 * 2;

  const interval = setInterval(() => {
    if (ws.readyState !== WebSocket.OPEN) {
      clearInterval(interval);
      return;
    }
    if (offset + chunkSize >= audioData.length) offset = 44;
    const chunk = audioData.subarray(offset, offset + chunkSize);
    ws.send(chunk);
    offset += chunkSize;
  }, 20);

  ws.on('close', () => {
    console.log('\n[PoC Server] Klient kopplade från.');
    clearInterval(interval);
  });
});

server.listen(PORT, () => {
  console.log(`[PoC Server] Körs på http://127.0.0.1:${PORT}`);
});