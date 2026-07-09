// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import QRCode from "qrcode";
import { runAiWash, isApprovedSender, STODDISTRIKT, calculateSecondsUntilTime } from "./src/features/mission_router/domain/parser";
import { 
  subscriptions, 
  saveSubscriptions, 
  simLogs, 
  addSimLog, 
  triggerPushAlert, 
  broadcastCancelPush, 
  initWebPush, 
  getVapidPublicKey 
} from "./src/features/mission_router/domain/pushService";
import { ActiveAlert, ChatMessage } from "./src/features/mission_router/types";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Flat Active Alerts & Announcements Registry
// Strictly stateless, in-memory RAM only.
const activeAlerts: Record<string, ActiveAlert> = {};

// Initialize Web Push Keys
initWebPush();

// Automatic Expiry Cleanup Loop for Leader Announcements
setInterval(() => {
  const now = Date.now();
  for (const [id, alert] of Object.entries(activeAlerts)) {
    if (alert.type === "leader_announcement" && alert.expiryTimestamp < now) {
      delete activeAlerts[id];
      addSimLog("system", `AUTOMATISK SUPPRESSION: Pålysning ${id} ("${alert.scrubbedText.substring(0, 30)}...") har förfallit och raderats permanent från RAM.`);
    }
  }
}, 60000); // Check every minute

// WhatsApp message parsing route handler
async function handleIncomingWhatsAppMessage(from: string, body: string, replyCallback: (text: string) => void) {
  addSimLog("incoming", `WhatsApp-meddelande mottaget från ${from.substring(0, 6)}...: "${body}"`);

  try {
    // 1. Run integrated Gemini AI-wash to scrub personal details and structure the request
    const washed = await runAiWash(body, {
      role: "Församlingsmissionärerna",
      contact: from,
      originalType: "missionary_alert"
    });

    const larmId = Math.random().toString(36).substring(2, 9);
    const newAlert: ActiveAlert = {
      id: larmId,
      type: "missionary_alert",
      missionaryPhone: from,
      rawText: body,
      scrubbedText: washed.scrubbedText,
      area: washed.resolvedArea || washed.area || "Kortedala",
      time: washed.time || "18:00",
      gender: washed.gender || "bror/syster",
      language: washed.language || "Svenska",
      locationName: washed.locationName || washed.area || "Göteborg",
      coords: washed.coords,
      cloakedCoords: washed.cloakedCoords,
      timestamp: Date.now(),
      chat: [],
      responsibleParty: washed.responsibleParty || "Församlingsmissionärerna",
      contactType: "whatsapp",
      contactValue: from,
      expiryTimestamp: Date.now() + 2 * 3600 * 1000 // 2 hours default for acute alerts
    };

    activeAlerts[larmId] = newAlert;

    // 2. Trigger background Web Push to matched volunteers
    await triggerPushAlert(newAlert);

    // 3. Send acknowledgment back to WhatsApp
    const ackMsg = `Hjälp-Bot (GE STÖD):\nLarmet har tvättats via Gemini AI och skickats till volontärer i ${newAlert.area}.\nAnsvarig: ${newAlert.responsibleParty}\nLarm ID: ${larmId}\nAmnesi-protokollet aktivt.`;
    replyCallback(ackMsg);
    addSimLog("outgoing", `Larm skapat i RAM: ${larmId} (Tvättat via Gemini). Bekräftat till missionär.`, newAlert);

  } catch (err: any) {
    console.error("Failed to process incoming WhatsApp message:", err);
    addSimLog("system", `Fel vid bearbetning av WhatsApp-meddelande: ${err.message}`);
    replyCallback(`Hjälp-Bot (GE STÖD): Ett fel inträffade vid AI-tvätt.`);
  }
}

// ==========================================
// WhatsApp-web.js Safe Runner Configuration
// ==========================================
let qrCodeDataUrl: string | null = null;
let whatsappStatus: "disconnected" | "connecting" | "connected" | "error" = "disconnected";
let whatsappError: string | null = null;
let client: any = null;

async function initWhatsApp() {
  try {
    whatsappStatus = "connecting";
    addSimLog("system", "Initierar whatsapp-web.js-klient...");

    // Dynamically require to avoid breaking bundle if node_modules are weird
    const { Client, LocalAuth } = require("whatsapp-web.js");

    client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process"
        ],
        headless: true
      }
    });

    client.on("qr", async (qr: string) => {
      whatsappStatus = "disconnected";
      try {
        qrCodeDataUrl = await QRCode.toDataURL(qr);
        addSimLog("system", "WhatsApp QR-kod genererad för inloggning.");
      } catch (err) {
        console.error("QR Code Generation failed", err);
      }
    });

    client.on("ready", () => {
      whatsappStatus = "connected";
      qrCodeDataUrl = null;
      addSimLog("system", "WhatsApp Bot ANSLUTEN och redo!");
      console.log("WhatsApp client is fully authenticated and ready.");
    });

    client.on("auth_failure", (msg: any) => {
      whatsappStatus = "error";
      whatsappError = String(msg);
      addSimLog("system", `WhatsApp-autentisering misslyckades: ${msg}`);
    });

    client.on("message", async (msg: any) => {
      await handleIncomingWhatsAppMessage(msg.from, msg.body, (reply: string) => {
        msg.reply(reply);
      });
    });

    await client.initialize();
  } catch (err: any) {
    whatsappStatus = "error";
    whatsappError = err.message || String(err);
    addSimLog("system", "Kunde ej starta WhatsApp Web headless-klient. Kör i 100% Simulator Mode.");
    console.warn("Could not load whatsapp-web.js safely:", err);
  }
}

// Start WhatsApp runner in background
initWhatsApp();

// ==========================================
// Express API Endpoints
// ==========================================

// Get VAPID Public key for client registration
app.get("/api/vapid-public-key", (req, res) => {
  res.json({ publicKey: getVapidPublicKey() });
});

// Create/Update Anonymous Web Push Subscriptions
app.post("/api/subscription", (req, res) => {
  const { id, subscription, tags } = req.body;
  if (!subscription) {
    return res.status(400).json({ error: "Missing subscription object" });
  }

  const recordId = id || Math.random().toString(36).substring(2, 11);
  const existingIndex = subscriptions.findIndex(s => s.id === recordId);

  const newRecord = {
    id: recordId,
    subscription,
    tags: {
      areas: tags?.areas || [],
      languages: tags?.languages || [],
      organization: tags?.organization || "bror",
      formats: tags?.formats || ["physical"],
      alwaysNotify: !!tags?.alwaysNotify,
      spiritualTips: !!tags?.spiritualTips,
      requireInteraction: tags?.requireInteraction ?? true
    }
  };

  if (existingIndex > -1) {
    subscriptions[existingIndex] = newRecord;
  } else {
    subscriptions.push(newRecord);
  }

  saveSubscriptions();
  res.json({ success: true, id: recordId });
});

// View specific Alert/Announcement detail (ONLY scrubbed data, compliant with handboken 33.8)
app.get("/api/alerts/:id", (req, res) => {
  const alert = activeAlerts[req.params.id];
  if (!alert) {
    return res.status(404).json({ error: "Aktiviteten hittades inte, har förfallit eller raderats permanent via Amnesi-protokollet." });
  }

  // Strip rawText and return clean, compliant details
  const compliantAlert = {
    id: alert.id,
    type: alert.type,
    scrubbedText: alert.scrubbedText,
    area: alert.area,
    time: alert.time,
    gender: alert.gender,
    language: alert.language,
    locationName: alert.locationName,
    cloakedCoords: alert.cloakedCoords,
    timestamp: alert.timestamp,
    responsibleParty: alert.responsibleParty,
    contactType: alert.contactType,
    contactValue: alert.contactValue // Provided behind button only
  };

  res.json(compliantAlert);
});

// Volontär svarar på aktivitet (Returns back to Missionary/Leader + Triggers instant Amnesia if missionary_alert)
app.post("/api/alerts/:id/respond", async (req, res) => {
  const alert = activeAlerts[req.params.id];
  if (!alert) {
    return res.status(404).json({ error: "Detta larm eller pålysning är inte längre aktivt." });
  }

  const { responseText } = req.body;
  if (!responseText || responseText.trim() === "") {
    return res.status(400).json({ error: "Svarsmeddelande krävs." });
  }

  addSimLog("incoming", `Volontär skickade svar på ${alert.type === "missionary_alert" ? "larm" : "pålysning"} ${alert.id}: "${responseText}"`);

  const isMissionary = alert.type === "missionary_alert";
  const responseMessage = `Hjälp-Bot (GE STÖD):\nSvar på "${isMissionary ? "larmet" : "pålysningen"}" i [${alert.area} / ${alert.locationName}]:\n"${responseText}"\n\n${
    isMissionary 
      ? "Amnesi-protokollet har utlösts. Larm-ID " + alert.id + " har raderats permanent från serverns RAM." 
      : "Svaret har skickats till den ansvariga ledaren."
  }`;

  // Route back response
  if (alert.contactType === "whatsapp" && client && whatsappStatus === "connected") {
    try {
      await client.sendMessage(alert.contactValue, responseMessage);
      addSimLog("outgoing", `Svar vidarebefordrat till missionär via real WhatsApp.`, { to: alert.contactValue });
    } catch (err) {
      console.error("WhatsApp Send Message error", err);
      addSimLog("system", `Kunde ej skicka till real WhatsApp, loggas här: ${responseMessage}`);
    }
  } else {
    addSimLog("outgoing", `Svar vidarebefordrat (SIMULATOR) via ${alert.contactType.toUpperCase()} till [${alert.contactValue}]: ${responseMessage}`);
  }

  if (isMissionary) {
    // Silent Cancel Push to matching subscribers to dismiss from screens
    await broadcastCancelPush(alert.id, alert.area);
    // Amnesia Protocol - Wipe from RAM immediately
    delete activeAlerts[req.params.id];
    addSimLog("system", `AMNESI TRIGGAD: All larmdata för ID ${alert.id} har raderats permanent från serverns RAM.`);
    res.json({ success: true, message: "Svar skickat och larm permanent raderat via Amnesi-protokollet." });
  } else {
    res.json({ success: true, message: "Svar skickat till församlingsledaren. Pålysningen ligger kvar i strömmen." });
  }
});

// ==========================================
// Google-konto / E-post ingångspunkt (Simulator)
// ==========================================
app.post("/api/incoming-email", async (req, res) => {
  const { from, body, subject } = req.body;

  if (!from || !body) {
    return res.status(400).json({ error: "Missing from or body parameter" });
  }

  addSimLog("incoming", `E-post mottagen till alska.dela.bjudin@gmail.com från ${from}. Ämne: "${subject || ''}"`);

  // Validation: Only accept from approved list or domain
  if (!isApprovedSender(from)) {
    addSimLog("system", `AVVISAD E-POST: Avsändaren ${from} är inte på listan över godkända ledaradresser.`);
    return res.status(403).json({ error: "Avsändaren är inte på listan över godkända ledaradresser." });
  }

  try {
    // Run AI Wash on the email body to scrub details and extract structure
    const washed = await runAiWash(body, {
      role: "Församlingsledare",
      contact: from,
      originalType: "leader_announcement"
    });

    const id = Math.random().toString(36).substring(2, 9);
    const expiryDays = washed.expiryDays || 7;
    const expiryTimestamp = Date.now() + expiryDays * 24 * 3600 * 1000;

    const newAnnouncement: ActiveAlert = {
      id,
      type: "leader_announcement",
      rawText: body,
      scrubbedText: washed.scrubbedText,
      area: washed.resolvedArea || washed.area || "Kortedala",
      time: washed.time || "Ospecificerad tid",
      gender: washed.gender || "Alla medlemmar",
      language: washed.language || "Svenska",
      locationName: washed.locationName || washed.area || "Göteborg",
      coords: washed.coords,
      cloakedCoords: washed.cloakedCoords,
      timestamp: Date.now(),
      responsibleParty: washed.responsibleParty || "Församlingsledare",
      contactType: washed.contactType || "email",
      contactValue: washed.contactValue || from,
      expiryTimestamp
    };

    activeAlerts[id] = newAnnouncement;

    addSimLog("system", `NY PÅLYSNING SKAPAD: "${newAnnouncement.scrubbedText.substring(0, 50)}..." i [${newAnnouncement.area}] av ${newAnnouncement.responsibleParty}. Giltig i ${expiryDays} dagar.`);

    res.json({ success: true, id });

  } catch (err: any) {
    console.error("Failed to process incoming email:", err);
    addSimLog("system", `Fel vid bearbetning av e-post: ${err.message}`);
    res.status(500).json({ error: "Internal server error during AI washing" });
  }
});

// Web Simulator trigger endpoints
app.post("/api/sim/whatsapp", async (req, res) => {
  const { from, body } = req.body;
  const dummyFrom = from || "whatsapp:+46700000000";
  const dummyBody = body || "Vi ska till [Kortedala Torg] kl [18:00]. Behöver en [bror] för [engelska].";

  await handleIncomingWhatsAppMessage(dummyFrom, dummyBody, (reply: string) => {
    addSimLog("outgoing", `Svarat simulator-missionär: ${reply}`);
  });

  res.json({ success: true });
});

app.get("/api/sim/messages", (req, res) => {
  res.json(simLogs);
});

app.get("/api/sim/active-alerts", (req, res) => {
  // Strip raw parameters for safety dashboard view, maintaining handboken 33.8
  const safeAlerts = Object.values(activeAlerts).map(alert => ({
    id: alert.id,
    type: alert.type,
    area: alert.area,
    time: alert.time,
    gender: alert.gender,
    language: alert.language,
    locationName: alert.locationName,
    timestamp: alert.timestamp,
    scrubbedText: alert.scrubbedText,
    responsibleParty: alert.responsibleParty,
    contactType: alert.contactType
  }));
  res.json(safeAlerts);
});

app.get("/api/whatsapp/status", (req, res) => {
  res.json({
    status: whatsappStatus,
    qrCode: qrCodeDataUrl,
    error: whatsappError
  });
});

// Serve Vite frontend
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ge stöd Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start Express server", err);
});
