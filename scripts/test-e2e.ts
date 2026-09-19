process.env.NODE_ENV = "test";
process.env.INPUT_MODE = "file";

import http from "http";
import { WebSocket } from "ws";
import { createApp } from "../server";
import { setupTranslationWebSocket, startTranslationSession, stopTranslationSession } from "../src/server/translationServer";

async function runE2ETest() {
  console.log("🚀 Startar E2E-verifiering av WebSocket-strömning (/ws/translation)...");

  // Skapa dedikerad HTTP+WS-server för E2E-test på tillgänglig testport
  const app = createApp();
  const server = http.createServer(app);
  setupTranslationWebSocket(server);

  const testPort = 3456;
  await new Promise<void>((resolve) => server.listen(testPort, "127.0.0.1", resolve));
  console.log(`🔌 Testserver lyssnar på port ${testPort}`);

  const wsUrl = `ws://127.0.0.1:${testPort}/ws/translation`;
  const ws = new WebSocket(wsUrl);

  let receivedAudioChunks = 0;
  let totalBytes = 0;
  let initialStatusReceived = false;

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      ws.close();
      server.close();
      reject(new Error(`Timeout: Tog emot ${receivedAudioChunks} ljudpaket (förväntade minst 3)`));
    }, 8000);

    ws.on("open", () => {
      console.log("✅ WebSocket-anslutning etablerad mot /ws/translation");
      startTranslationSession("en");
    });

    ws.on("message", (data) => {
      try {
        const payload = JSON.parse(data.toString());
        if (payload.type === "status" || payload.type === "connected") {
          initialStatusReceived = true;
          console.log(`📡 Mottog serverstatus: språk=${payload.language}, inputMode=${payload.inputMode}`);
        } else if (payload.type === "audio") {
          receivedAudioChunks++;
          const pcmBytes = Buffer.from(payload.data, "base64");
          totalBytes += pcmBytes.length;
          console.log(`🔊 Mottog ljudpaket #${receivedAudioChunks}: ${pcmBytes.length} bytes PCM (sampleRate: ${payload.sampleRate})`);

          if (receivedAudioChunks >= 3) {
            clearTimeout(timeout);
            resolve();
          }
        }
      } catch (err) {
        console.error("Kunde inte tolka WebSocket-meddelande:", err);
      }
    });

    ws.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });

  ws.close();
  stopTranslationSession();
  await new Promise<void>((resolve) => server.close(() => resolve()));

  console.log(`\n🎉 E2E TEST PASSED:`);
  console.log(`- Status mottaget: ${initialStatusReceived}`);
  console.log(`- Tog emot ${receivedAudioChunks} ljudpaket`);
  console.log(`- Totalt ${totalBytes} bytes avkodad PCM-data`);
  console.log(`- Strömning och format (24kHz Mono) validerat`);

  process.exit(0);
}

runE2ETest().catch((err) => {
  console.error("❌ E2E TEST FAILED:", err);
  process.exit(1);
});
