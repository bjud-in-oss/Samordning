import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });
import WebSocket from "ws";
import { GoogleGenAI } from "@google/genai";

async function runLiveTest() {
  console.log("=== Skarpt integrationstest: Gemini Live API ===");
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Fel: Saknar GEMINI_API_KEY i .env.local eller .env");
    process.exit(1);
  }

  console.log("🔑 Skapar ephemeral token via @google/genai...");
  const ai = new GoogleGenAI({ apiKey });
  const tokenObj = await ai.authTokens.create({
    config: {
      uses: 50,
      expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      liveConnectConstraints: {
        model: "models/gemini-3.5-live-translate-preview",
      },
    },
  });

  const rawToken = tokenObj.name;
  if (!rawToken) {
    console.error("❌ Fel: Inget token mottogs från Gemini API.");
    process.exit(1);
  }

  const cleanToken = rawToken.replace(/^auth_?tokens\//i, "");
  console.log(`✅ Token skapad: ${rawToken}`);
  console.log(`🔑 Rent token-id: ${cleanToken.substring(0, 10)}... (skalat prefix)`);

  const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(cleanToken)}`;
  console.log("🔌 Ansluter till Gemini Live WebSocket (BidiGenerateContentConstrained)...");
  const ws = new WebSocket(url);

  let setupCompleted = false;

  ws.on("open", () => {
    console.log("📡 WebSocket öppen! Skickar BidiGenerateContentSetup...");
    const setupMsg = {
      setup: {
        model: "models/gemini-3.5-live-translate-preview",
        generationConfig: {
          responseModalities: ["AUDIO"],
          translationConfig: {
            targetLanguageCode: "sv",
            echoTargetLanguage: false,
          },
        },
      },
    };
    ws.send(JSON.stringify(setupMsg));
  });

  ws.on("message", (data) => {
    try {
      const response = JSON.parse(data.toString());
      if (response.setupComplete) {
        setupCompleted = true;
        console.log("✅ Mottog setupComplete från Gemini Live API!");
        ws.close();
      }
    } catch (e) {
      console.warn("Mottog icke-JSON meddelande:", e);
    }
  });

  ws.on("close", (code, reason) => {
    const reasonStr = reason ? reason.toString() : "";
    console.log(`🔌 WebSocket stängd: kod=${code} ${reasonStr ? `(${reasonStr})` : ""}`);
    if (setupCompleted) {
      console.log("🎉 Skarpt integrationstest lyckades! Setup genomförd felfritt.");
      process.exit(0);
    } else {
      console.error(`❌ TEST FAILED: Anslutningen avbröts innan setup slutfördes (kod: ${code}, orsak: ${reasonStr})`);
      process.exit(1);
    }
  });

  ws.on("error", (err) => {
    console.error("❌ WebSocket-fel:", err);
    process.exit(1);
  });

  setTimeout(() => {
    if (!setupCompleted) {
      console.error("❌ TEST FAILED: Timeout efter 15 sekunder utan svar från Gemini API.");
      ws.close();
      process.exit(1);
    }
  }, 15000);
}

runLiveTest().catch((err) => {
  console.error("❌ Oväntat fel i integrationstestet:", err);
  process.exit(1);
});
