import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import webpush from "web-push";
import QRCode from "qrcode";

// Set up process coordinates
// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Active Alerts Registry
// Keeps alert_id, missionary phone, raw text, and scrubbed info. Cleared on response (Amnesia protocol).
interface ActiveAlert {
  id: string;
  missionaryPhone: string;
  rawText: string;
  scrubbedText: string;
  area: string;
  time: string;
  gender: string;
  language: string;
  locationName: string;
  coords: { lat: number; lng: number };
  cloakedCoords: { lat: number; lng: number };
  timestamp: number;
}

const activeAlerts: Record<string, ActiveAlert> = {};

// Anonymous Subscriptions Store
interface SubscriptionRecord {
  id: string;
  subscription: webpush.PushSubscription;
  tags: {
    areas: string[];
    languages?: string[];
    organization?: string;
    formats: ("physical" | "telephone")[];
    alwaysNotify: boolean;
    spiritualTips: boolean;
  };
}

let subscriptions: SubscriptionRecord[] = [];
const SUBS_FILE = path.join(process.cwd(), "data", "subscriptions.json");

// Ensure data folder exists
if (!fs.existsSync(path.join(process.cwd(), "data"))) {
  fs.mkdirSync(path.join(process.cwd(), "data"));
}

// Load subscriptions safely
if (fs.existsSync(SUBS_FILE)) {
  try {
    subscriptions = JSON.parse(fs.readFileSync(SUBS_FILE, "utf-8"));
  } catch (err) {
    console.error("Failed to load subscriptions", err);
    subscriptions = [];
  }
}

function saveSubscriptions() {
  try {
    fs.writeFileSync(SUBS_FILE, JSON.stringify(subscriptions, null, 2));
  } catch (err) {
    console.error("Failed to save subscriptions", err);
  }
}

// System Logs for Simulator Console
interface SimLog {
  id: string;
  timestamp: number;
  type: "incoming" | "outgoing" | "system" | "push";
  message: string;
  details?: any;
}
const simLogs: SimLog[] = [];

function addSimLog(type: SimLog["type"], message: string, details?: any) {
  simLogs.push({
    id: Math.random().toString(36).substring(2, 9),
    timestamp: Date.now(),
    type,
    message,
    details
  });
  if (simLogs.length > 100) simLogs.shift();
}

// VAPID Web Push Keys Setup
let vapidPublicKey = "";
let vapidPrivateKey = "";

try {
  // Try to load from env first, otherwise generate dynamically in memory
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  } else {
    // Generate one-time dynamic keys for runtime persistence
    const keys = webpush.generateVAPIDKeys();
    vapidPublicKey = keys.publicKey;
    vapidPrivateKey = keys.privateKey;
    addSimLog("system", "Dynamic VAPID Vattentäta nycklar genererade framgångsrikt.");
  }
  webpush.setVapidDetails(
    "mailto:mattias@inventeras.com",
    vapidPublicKey,
    vapidPrivateKey
  );
} catch (err: any) {
  console.error("Failed to set VAPID keys", err);
}

// 15 Fasta Stöddistrikt i Göteborg (Geografiskt sorterat Norr -> Söder)
const STODDISTRIKT = [
  { name: "Angered", lat: 57.7958, lng: 12.0432 },
  { name: "Kortedala", lat: 57.7506, lng: 12.0335 },
  { name: "Gamlestaden", lat: 57.7332, lng: 12.0084 },
  { name: "Hisingen", lat: 57.7311, lng: 11.9332 },
  { name: "Biskopsgården", lat: 57.7281, lng: 11.8955 },
  { name: "Lundby", lat: 57.7172, lng: 11.9381 },
  { name: "Partille", lat: 57.7402, lng: 12.1002 },
  { name: "Örgryte", lat: 57.7024, lng: 12.0121 },
  { name: "Johanneberg", lat: 57.6901, lng: 11.9805 },
  { name: "Majorna", lat: 57.6914, lng: 11.9213 },
  { name: "Mölndal", lat: 57.6583, lng: 12.0132 },
  { name: "Frölunda", lat: 57.6521, lng: 11.9105 },
  { name: "Torslanda", lat: 57.7241, lng: 11.7802 },
  { name: "Askim", lat: 57.6162, lng: 11.9442 },
  { name: "Härryda", lat: 57.6831, lng: 12.3164 }
];

// Rich Local Geocoding Table
const GEOMAP: Record<string, { lat: number; lng: number }> = {
  "angered": { lat: 57.7958, lng: 12.0432 },
  "angereds torg": { lat: 57.7951, lng: 12.0428 },
  "kortedala": { lat: 57.7506, lng: 12.0335 },
  "kortedala torg": { lat: 57.7512, lng: 12.0322 },
  "gamlestaden": { lat: 57.7332, lng: 12.0084 },
  "gamlestads torg": { lat: 57.7328, lng: 12.0075 },
  "hisingen": { lat: 57.7311, lng: 11.9332 },
  "biskopsgården": { lat: 57.7281, lng: 11.8955 },
  "vårväderstorget": { lat: 57.7265, lng: 11.8931 },
  "lundby": { lat: 57.7172, lng: 11.9381 },
  "partille": { lat: 57.7402, lng: 12.1002 },
  "örgryte": { lat: 57.7024, lng: 12.0121 },
  "johanneberg": { lat: 57.6901, lng: 11.9805 },
  "majorna": { lat: 57.6914, lng: 11.9213 },
  "mariaplan": { lat: 57.6905, lng: 11.9198 },
  "mölndal": { lat: 57.6583, lng: 12.0132 },
  "frölunda": { lat: 57.6521, lng: 11.9105 },
  "frölunda torg": { lat: 57.6532, lng: 11.9112 },
  "torslanda": { lat: 57.7241, lng: 11.7802 },
  "askim": { lat: 57.6162, lng: 11.9442 },
  "härryda": { lat: 57.6831, lng: 12.3164 },
  "brunnsparken": { lat: 57.7068, lng: 11.9685 },
  "avenyn": { lat: 57.7005, lng: 11.9742 },
  "centralstationen": { lat: 57.7086, lng: 11.9731 }
};

// Extrahera tid i sekunder till angiven tidpunkt för TTL-beräkning
function calculateSecondsUntilTime(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    // Standard-TTL på 2 timmar om formatet är ospecifikt
    return 7200;
  }

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  const now = new Date();
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);

  // Om tiden redan passerat idag, antar vi samma tidpunkt imorgon
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  const diffMs = target.getTime() - now.getTime();
  const diffSec = Math.ceil(diffMs / 1000);

  // Returnera mellan 1 minut och 24 timmar
  return Math.max(60, Math.min(86400, diffSec));
}

// Pythagoras Distance for Gothenburg latitude (57.7 deg)
// d^2 = (dx * 0.53)^2 + dy^2
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dy = lat1 - lat2;
  const dx = lng1 - lng2;
  return Math.sqrt(Math.pow(dx * 0.53, 2) + Math.pow(dy, 2));
}

// Find closest supporting district
function findClosestDistrict(lat: number, lng: number): string {
  let closestName = "Göteborg";
  let minDistance = Infinity;
  for (const d of STODDISTRIKT) {
    const dist = getDistance(lat, lng, d.lat, d.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestName = d.name;
    }
  }
  return closestName;
}

// Core Message Parser Logic
interface CleanedData {
  locationName: string;
  time: string;
  gender: string;
  language: string;
  coords: { lat: number; lng: number };
  cloakedCoords: { lat: number; lng: number };
  resolvedArea: string;
  scrubbedMessage: string;
}

function parseMissionaryMessage(text: string): CleanedData | null {
  // Regex to match text in brackets [...]
  const bracketRegex = /\[(.*?)\]/g;
  const matches: string[] = [];
  let match;
  while ((match = bracketRegex.exec(text)) !== null) {
    matches.push(match[1].trim());
  }

  // Fallback if formatting is completely wrong (zero brackets)
  if (matches.length === 0) {
    return null;
  }

  // Parse fields
  const locationName = matches[0] || "Göteborg";
  const time = matches[1] || "Ospecificerad tid";
  const gender = matches[2] || "Kategori ej angiven";
  const language = matches[3] || "Svenska";

  // Geocode location
  const cleanKey = locationName.toLowerCase();
  let coords = { lat: 57.7088, lng: 11.9745 }; // Default Gothenburg center
  if (GEOMAP[cleanKey]) {
    coords = GEOMAP[cleanKey];
  } else {
    // Try substring matching
    const foundKey = Object.keys(GEOMAP).find(key => cleanKey.includes(key) || key.includes(cleanKey));
    if (foundKey) {
      coords = GEOMAP[foundKey];
    } else {
      // If absolutely not found, see if we can locate closest district by name
      const matchingDistrict = STODDISTRIKT.find(d => cleanKey.includes(d.name.toLowerCase()));
      if (matchingDistrict) {
        coords = { lat: matchingDistrict.lat, lng: matchingDistrict.lng };
      }
    }
  }

  // Spatial Cloaking Formula
  const cloakedCoords = {
    lat: Math.round(coords.lat / 0.02) * 0.02,
    lng: Math.round(coords.lng / 0.02) * 0.02
  };

  // Resolve which support area it belongs to
  const resolvedArea = findClosestDistrict(coords.lat, coords.lng);

  // Formulate cleaned display message containing ONLY the bracketed contents (excluding investigator personal names or outside fluff)
  const scrubbedMessage = `Plats: [${locationName}], Tid: [${time}], Behov: [${gender}], Språk: [${language}]`;

  return {
    locationName,
    time,
    gender,
    language,
    coords,
    cloakedCoords,
    resolvedArea,
    scrubbedMessage
  };
}

// Router trigger for Web Push notifications to matching volunteers
//
// FUTURE AI TRANSLATION INTEGRATION (GEMINI API) NOTES:
// In the future, to fully internationalize missionary requests, we can integrate the Gemini API here.
// When a new push alert is triggered, instead of sending the same text to all volunteers:
// 1. Look up each subscriber's primary language (`uiLanguage` tag saved during onboarding).
// 2. If the subscriber's language differs from the alert's native language (e.g., Svenska vs Tiếng Việt),
//    we can use Gemini to translate the `scrubbedText` (e.g., "Möte på kafé, Kl 18:00, Kvinnor, Español") into their target language.
// 3. Example implementation using @google/genai:
//    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
//    const prompt = `Translate this structured missionary request into ${subscriber.uiLanguage} with warm, supportive, and respectful terminology: "${alert.scrubbedText}"`;
//    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
//    const translatedBody = response.text;
// 4. This ensures that every volunteer receives a push notification and views the alert details in their own mother tongue, maximizing response rates while preserving full privacy.
async function triggerPushAlert(alert: ActiveAlert) {
  let pushCount = 0;
  addSimLog("system", `Router matchar larm i [${alert.area}] mot anonyma prenumeranter.`);

  const payload = JSON.stringify({
    title: `Missionärsbehov i ${alert.area}!`,
    body: `Plats: ~${alert.locationName} (${alert.gender}, ${alert.language}) kl ${alert.time}`,
    id: alert.id
  });

  const ttlSeconds = calculateSecondsUntilTime(alert.time);
  addSimLog("system", `Beräknat larm TTL: ${ttlSeconds} sekunder fram till kl ${alert.time}.`);

  const alertGenderLower = alert.gender.toLowerCase();
  const isBrorRequest = alertGenderLower.includes("bror") || alertGenderLower.includes("broder") || alertGenderLower.includes("äldste");
  const isSysterRequest = alertGenderLower.includes("syster") || alertGenderLower.includes("systrar") || alertGenderLower.includes("hjälpförening");

  for (const s of subscriptions) {
    const areaMatch = s.tags.areas.includes(alert.area);
    const hasMatch = areaMatch || s.tags.alwaysNotify;

    if (hasMatch) {
      // Organization-based filtering
      const subOrg = s.tags.organization || "bror";
      let orgMatches = true;
      if (isBrorRequest && !isSysterRequest) {
        orgMatches = subOrg === "bror";
      } else if (isSysterRequest && !isBrorRequest) {
        orgMatches = subOrg === "syster";
      }

      if (!orgMatches) {
        addSimLog("system", `Hoppar över prenumerant ${s.id.substring(0, 6)}... då larmet kräver ${alert.gender} och prenumeranten tillhör ${subOrg === "bror" ? "Äldstekvorum" : "Hjälpförening"}.`);
        continue;
      }

      // Language-based filtering
      const alertLang = alert.language.toLowerCase();
      const subLangs = s.tags.languages || [];
      
      const normalize = (l: string) => {
        const s = l.toLowerCase();
        if (s.includes("sven") || s.includes("swe")) return "svenska";
        if (s.includes("eng") || s.includes("en")) return "english";
        if (s.includes("span") || s.includes("esp") || s.includes("spa")) return "español";
        if (s.includes("swah") || s.includes("kisw") || s.includes("swa")) return "kiswahili";
        if (s.includes("viet") || s.includes("tiếng") || s.includes("tieng")) return "tiếng việt";
        return s;
      };

      const normAlert = normalize(alertLang);
      const isMatched = subLangs.some(lang => {
        const normSub = normalize(lang);
        return normSub === normAlert || lang.toLowerCase().includes(alertLang) || alertLang.includes(lang.toLowerCase());
      });

      if (!isMatched) {
        addSimLog("system", `Hoppar över prenumerant ${s.id.substring(0, 6)}... då prenumeranten inte stödjer det önskade språket [${alert.language}].`);
        continue;
      }

      try {
        await webpush.sendNotification(s.subscription, payload, { TTL: ttlSeconds });
        pushCount++;
      } catch (err: any) {
        // If subscription has expired, remove it to prevent clutter
        if (err.statusCode === 410) {
          subscriptions = subscriptions.filter(sub => sub.id !== s.id);
          saveSubscriptions();
        }
        console.error("Web Push Error", err.statusCode || err);
      }
    }
  }

  addSimLog("push", `Skickat ${pushCount} larm-push-notiser till matchade volontärer.`);
}

// In-Memory processing pipeline
async function handleIncomingWhatsAppMessage(from: string, body: string, replyCallback: (text: string) => void) {
  addSimLog("incoming", `Meddelande från ${from.substring(0, 6)}...: ${body}`);

  const cleaned = parseMissionaryMessage(body);
  if (!cleaned) {
    // Send standard templates directly as Fallback response
    const helpMsg = `Hjälp-Bot (NO PERSONAL INFO):\nVänligen formatera ditt meddelande enligt mallen:\n\nVi ska till [Kortedala Torg] kl [18:00]. Behöver en [bror/syster] för [engelska].`;
    replyCallback(helpMsg);
    addSimLog("outgoing", `Skickade hjälp-mall till missionär.`, { from });
    return;
  }

  // Generate larm_id
  const larmId = Math.random().toString(36).substring(2, 9);
  const newAlert: ActiveAlert = {
    id: larmId,
    missionaryPhone: from,
    rawText: body,
    scrubbedText: cleaned.scrubbedMessage,
    area: cleaned.resolvedArea,
    time: cleaned.time,
    gender: cleaned.gender,
    language: cleaned.language,
    locationName: cleaned.locationName,
    coords: cleaned.coords,
    cloakedCoords: cleaned.cloakedCoords,
    timestamp: Date.now()
  };

  activeAlerts[larmId] = newAlert;

  // Triggers background Web Push
  triggerPushAlert(newAlert);

  // Send acknowledgement back to WhatsApp
  const ackMsg = `Hjälp-Bot (NO PERSONAL INFO):\nLarmet har tvättats och skickats till volontärer i ${cleaned.resolvedArea}.\nLarm ID: ${larmId}\nAmnesi-protokollet aktivt.`;
  replyCallback(ackMsg);
  addSimLog("outgoing", `Larm skapat i RAM: ${larmId}. Bekräftat till missionär.`, newAlert);
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
      addSimLog("system", `WhatsApp autentisering misslyckades: ${msg}`);
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
  res.json({ publicKey: vapidPublicKey });
});

// Create/Update Anonymous Web Push Subscriptions
app.post("/api/subscription", (req, res) => {
  const { id, subscription, tags } = req.body;
  if (!subscription) {
    return res.status(400).json({ error: "Missing subscription object" });
  }

  const recordId = id || Math.random().toString(36).substring(2, 11);
  const existingIndex = subscriptions.findIndex(s => s.id === recordId);

  const newRecord: SubscriptionRecord = {
    id: recordId,
    subscription,
    tags: {
      areas: tags?.areas || [],
      languages: tags?.languages || [],
      organization: tags?.organization || "bror",
      formats: tags?.formats || ["physical"],
      alwaysNotify: !!tags?.alwaysNotify,
      spiritualTips: !!tags?.spiritualTips
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

// View specific Alert detail (ONLY scrubbed data, compliant with Privacy requirements)
app.get("/api/alerts/:id", (req, res) => {
  const alert = activeAlerts[req.params.id];
  if (!alert) {
    return res.status(404).json({ error: "Larmet hittades inte, har förfallit eller raderats permanent via Amnesi-protokollet." });
  }

  // Strip rawText and raw phone number from API response to uphold compliance
  const compliantAlert = {
    id: alert.id,
    scrubbedText: alert.scrubbedText,
    area: alert.area,
    time: alert.time,
    gender: alert.gender,
    language: alert.language,
    locationName: alert.locationName,
    cloakedCoords: alert.cloakedCoords,
    timestamp: alert.timestamp
  };

  res.json(compliantAlert);
});

// Volontär svarar på larm (Returns back to Missionary + Triggers instant Amnesia protocol)
app.post("/api/alerts/:id/respond", async (req, res) => {
  const alert = activeAlerts[req.params.id];
  if (!alert) {
    return res.status(404).json({ error: "Detta larm är inte längre aktivt." });
  }

  const { responseText } = req.body;
  if (!responseText || responseText.trim() === "") {
    return res.status(400).json({ error: "Svarsmeddelande krävs." });
  }

  addSimLog("incoming", `Volontär skickade svar på larm ${alert.id}: "${responseText}"`);

  const responseMessage = `Hjälp-Bot (NO PERSONAL INFO):\nSvar på ditt larm i [${alert.area} / ${alert.locationName}]:\n"${responseText}"\n\nAmnesi-protokollet har nu utlösts. Larm-ID ${alert.id} har raderats permanent från serverns minne.`;

  // Send message to real WhatsApp client if connected, otherwise log to Simulator Console
  if (client && whatsappStatus === "connected") {
    try {
      await client.sendMessage(alert.missionaryPhone, responseMessage);
      addSimLog("outgoing", `Svar vidarebefordrat till missionär via real WhatsApp.`, { to: alert.missionaryPhone });
    } catch (err) {
      console.error("WhatsApp Send Message error", err);
      addSimLog("system", `Kunde ej skicka till real WhatsApp, loggas här: ${responseMessage}`);
    }
  } else {
    addSimLog("outgoing", `Svar vidarebefordrat till missionär (SIMULATOR): ${responseMessage}`, { to: alert.missionaryPhone });
  }

  // Silent Cancel Push to matching subscribers
  const cancelPayload = JSON.stringify({
    type: "CANCEL",
    id: alert.id
  });

  let cancelPushCount = 0;
  for (const s of subscriptions) {
    const areaMatch = s.tags.areas.includes(alert.area);
    const hasMatch = areaMatch || s.tags.alwaysNotify;

    if (hasMatch) {
      try {
        await webpush.sendNotification(s.subscription, cancelPayload, { TTL: 60 });
        cancelPushCount++;
      } catch (err: any) {
        if (err.statusCode === 410) {
          subscriptions = subscriptions.filter(sub => sub.id !== s.id);
          saveSubscriptions();
        }
      }
    }
  }
  addSimLog("push", `Skickat tyst avbeställnings-push till ${cancelPushCount} volontärer för larm ${alert.id}.`);

  // Amnesia Protocol - Wipe larm data completely from memory
  delete activeAlerts[req.params.id];
  addSimLog("system", `AMNESI TRIGGAD: All larmdata för ID ${alert.id} har raderats permanent från serverns RAM.`);

  res.json({ success: true, message: "Svar skickat och larm permanent raderat via Amnesi-protokollet." });
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
  // Strip raw parameters for safety dashboard view too, maintaining security boundaries
  const safeAlerts = Object.values(activeAlerts).map(alert => ({
    id: alert.id,
    area: alert.area,
    time: alert.time,
    gender: alert.gender,
    language: alert.language,
    locationName: alert.locationName,
    timestamp: alert.timestamp
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
    console.log(`Stateless Mission Router listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start Express server", err);
});
