// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
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
import { ActiveAlert } from "./src/features/mission_router/types";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Flat Active Alerts & Announcements Registry
// Backed by data/alerts.json for persistence on server restarts (Render compatibility)
const activeAlerts: Record<string, ActiveAlert> = {};

const ALERTS_FILE = path.join(process.cwd(), "data", "alerts.json");

// Load active alerts safely
function loadActiveAlerts() {
  if (fs.existsSync(ALERTS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(ALERTS_FILE, "utf-8"));
      for (const key of Object.keys(activeAlerts)) {
        delete activeAlerts[key];
      }
      Object.assign(activeAlerts, data);
      console.log(`Loaded ${Object.keys(activeAlerts).length} active alerts from disk.`);
    } catch (err) {
      console.error("Failed to load active alerts from disk:", err);
    }
  }
}

function saveActiveAlerts() {
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    fs.writeFileSync(ALERTS_FILE, JSON.stringify(activeAlerts, null, 2));
  } catch (err) {
    console.error("Failed to save active alerts to disk:", err);
  }
}

function getNextFreeId(): string {
  let next = 1;
  while (activeAlerts[String(next)]) {
    next++;
  }
  return String(next);
}

const API_SECRET = process.env.SMS_WEBHOOK_SECRET || "samordning-secret-2026";

// Hardcoded Administrator list
const ADMIN_NUMBERS = ["0700000000", "0701112222", "0733334444", "+46701234567"];

// Initialize Web Push Keys
initWebPush();

// Load alerts at startup
loadActiveAlerts();

// Automatic Expiry Cleanup Loop for invitations (Permanent suppression after 2 hours past scheduled time)
setInterval(() => {
  const now = Date.now();
  let changed = false;
  for (const [id, alert] of Object.entries(activeAlerts)) {
    if (alert.expiryTimestamp < now) {
      delete activeAlerts[id];
      addSimLog("system", `AUTOMATISK SUPPRESSION: Inbjudan ${id} ("${alert.scrubbedText.substring(0, 30)}...") har förfallit och raderats permanent från RAM (>2 timmar efter sluttid).`);
      changed = true;
    }
  }
  if (changed) {
    saveActiveAlerts();
  }
}, 60000); // Check every minute

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
  if (!alert || alert.status === "pending") {
    return res.status(404).json({ error: "Aktiviteten hittades inte, har förfallit eller raderats permanent." });
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
    contactValue: alert.contactValue,
    category: alert.category,
    isFull: !!alert.isFull,
    totalActiveAlerts: Object.keys(activeAlerts).length
  };

  res.json(compliantAlert);
});

// SMS Gateway & Admin Kill Switch Route
app.post("/api/incoming-sms", async (req, res) => {
  // Validate Webhook Security API Secret
  const requestSecret = req.headers["x-api-secret"] || req.body.secret;
  if (requestSecret !== API_SECRET) {
    addSimLog("system", `AVVISAT WEBHOOK-ANROP: Obehörig API-nyckel/secret.`);
    return res.status(401).json({ error: "Unauthorized: Invalid or missing API Webhook Secret." });
  }

  const { sender, text } = req.body;
  if (!sender || !text) {
    return res.status(400).json({ error: "Avsändare och text krävs." });
  }

  const trimmedText = text.trim();
  addSimLog("incoming", `Inkommande SMS från ${sender}: "${trimmedText}"`);

  const isAdmin = ADMIN_NUMBERS.includes(sender);

  // 1. Check for Admin Moderation Commands
  const godkannMatch = trimmedText.match(/^#GODKÄNN\s+(\d+)$/i);
  const avvisaMatch = trimmedText.match(/^#AVVISA\s+(\d+)$/i);

  if (godkannMatch || avvisaMatch) {
    if (!isAdmin) {
      addSimLog("system", `AVVISAD MODERERING: Obehörig avsändare ${sender} försökte moderera.`);
      return res.status(403).json({ error: "Obehörig avsändare för moderering." });
    }

    if (godkannMatch) {
      const id = godkannMatch[1];
      const alert = activeAlerts[id];
      if (!alert) {
        addSimLog("system", `KOMMANDO MISSLYCKADES: #GODKÄNN ${id} hittades inte.`);
        return res.status(404).json({ error: `Inbjudan med ID ${id} hittades inte.` });
      }
      if (alert.status === "active") {
        return res.json({ success: true, replyMessage: `Inbjudan ${id} är redan aktiv.` });
      }

      alert.status = "active";
      saveActiveAlerts();

      // Trigger push notifications now that it is active
      await triggerPushAlert(alert);

      addSimLog("system", `SMS MODERERING: Inbjudan ${id} har godkänts av ${sender} och är nu aktiv.`);
      return res.json({
        success: true,
        replyMessage: `Inbjudan ${id} har godkänts och lagts upp på tavlan! Volontärer har meddelats.`
      });
    }

    if (avvisaMatch) {
      const id = avvisaMatch[1];
      const alert = activeAlerts[id];
      if (!alert) {
        addSimLog("system", `KOMMANDO MISSLYCKADES: #AVVISA ${id} hittades inte.`);
        return res.status(404).json({ error: `Inbjudan med ID ${id} hittades inte.` });
      }

      delete activeAlerts[id];
      saveActiveAlerts();

      addSimLog("system", `SMS MODERERING: Inbjudan ${id} har avvisats av ${sender} och raderats.`);
      return res.json({
        success: true,
        replyMessage: `Inbjudan ${id} har avvisats och raderats.`
      });
    }
  }

  // Parse Command DEL <ID> or FULL <ID>
  const delMatch = trimmedText.match(/^DEL\s+(\d+)$/i);
  const fullMatch = trimmedText.match(/^FULL\s+(\d+)$/i);

  if (delMatch) {
    const id = delMatch[1];
    const alert = activeAlerts[id];
    if (!alert) {
      addSimLog("system", `KOMMANDO MISSLYCKADES: DEL ${id} hittades inte.`);
      return res.status(404).json({ error: `Inbjudan med ID ${id} hittades inte.` });
    }

    const isAuthorized = isAdmin || sender === alert.contactValue;
    if (!isAuthorized) {
      addSimLog("system", `AVVISAD DEL: ${sender} har inte behörighet att radera inbjudan ${id}.`);
      return res.status(403).json({ error: "Obehörig avsändare." });
    }

    delete activeAlerts[id];
    saveActiveAlerts();
    await broadcastCancelPush(id, alert.area);
    addSimLog("system", `SMS KILL SWITCH: Inbjudan ${id} har raderats permanent via SMS.`);
    return res.json({ success: true, message: `Inbjudan ${id} har raderats permanent.` });
  }

  if (fullMatch) {
    const id = fullMatch[1];
    const alert = activeAlerts[id];
    if (!alert) {
      addSimLog("system", `KOMMANDO MISSLYCKADES: FULL ${id} hittades inte.`);
      return res.status(404).json({ error: `Inbjudan med ID ${id} hittades inte.` });
    }

    const isAuthorized = isAdmin || sender === alert.contactValue;
    if (!isAuthorized) {
      addSimLog("system", `AVVISAD FULL: ${sender} har inte behörighet att markera ${id} som fullbokat.`);
      return res.status(403).json({ error: "Obehörig avsändare." });
    }

    alert.isFull = true;
    saveActiveAlerts();
    addSimLog("system", `SMS KILL SWITCH: Inbjudan ${id} har markerats som fullbokad via SMS.`);
    return res.json({ success: true, message: `Inbjudan ${id} har markerats som fullbokad.` });
  }

  // 2. Validate non-admin text prefix requirements
  if (!isAdmin && !trimmedText.startsWith("#")) {
    addSimLog("system", `AVVISAT INLÄGG: Meddelandet från allmänheten (${sender}) måste börja med '#' för att hamna i väntrummet.`);
    return res.status(400).json({
      error: "Obehörig avsändare. Allmänna inlägg måste börja med '#' för att hamna i väntrummet."
    });
  }

  // Strip leading '#' for parsing if present
  const textToProcess = trimmedText.startsWith("#") ? trimmedText.substring(1).trim() : trimmedText;

  // standard SMS parsing to create new Invitation
  try {
    const washed = await runAiWash(textToProcess, {
      role: isAdmin ? "Arrangör" : "Allmänhet",
      contact: sender,
      originalType: "leader_invitation"
    });

    const id = getNextFreeId();
    // Expiry calculated as scheduled time of day + 2 hours
    const offsetSeconds = calculateSecondsUntilTime(washed.time);
    const expiryTimestamp = Date.now() + (offsetSeconds + 2 * 3600) * 1000;

    const status = isAdmin ? "active" : "pending";

    const newAnnouncement: ActiveAlert = {
      id,
      type: "leader_invitation",
      rawText: trimmedText,
      scrubbedText: washed.scrubbedText,
      area: washed.area || "Kortedala",
      time: washed.time || "Ospecificerad tid",
      gender: "Alla",
      language: "Svenska",
      locationName: washed.locationName || washed.area || "Göteborg",
      coords: washed.coords,
      cloakedCoords: washed.cloakedCoords,
      timestamp: Date.now(),
      responsibleParty: washed.responsibleParty || (isAdmin ? "Arrangör" : "Medlem"),
      contactType: "sms",
      contactValue: washed.contactValue || sender,
      expiryTimestamp,
      category: washed.category || "Måltid & Gemenskap",
      isFull: false,
      status
    };

    activeAlerts[id] = newAnnouncement;
    saveActiveAlerts();

    if (status === "pending") {
      // Log internal simulation moderation message
      const modMsg = `MODERERINGS-NOTIFIERING till samordningsgruppen [${ADMIN_NUMBERS.filter(num => num !== "+46701234567").join(", ")}]: "Nytt inlägg för granskning (ID: ${id}). Svara #GODKÄNN ${id} eller #AVVISA ${id}."`;
      addSimLog("system", modMsg);
      console.log(`[MODERATION] ${modMsg}`);

      return res.json({
        success: true,
        id,
        replyMessage: `Tack! Ditt inlägg (ID: ${id}) har placerats i väntrummet för granskning. En samordnare kommer att granska och godkänna det via SMS inom kort.`
      });
    }

    // Trigger background Web Push to matching volunteers for active announcements
    await triggerPushAlert(newAnnouncement);

    addSimLog("system", `NY INBJUDAN SKAPAD: "${newAnnouncement.scrubbedText.substring(0, 50)}..." i [${newAnnouncement.area}] av ${newAnnouncement.responsibleParty}. Kategori: ${newAnnouncement.category}.`);
    res.json({
      success: true,
      id,
      replyMessage: `Din inbjudan (ID: ${id}) har lagts upp direkt på tavlan! Radera med DEL ${id} eller markera som full med FULL ${id}.`
    });

  } catch (err: any) {
    console.error("Failed to process incoming SMS:", err);
    addSimLog("system", `Fel vid bearbetning av SMS: ${err.message}`);
    res.status(500).json({ error: "Internt serverfel vid bearbetning av SMS." });
  }
});

// Google-konto / E-post ingångspunkt (Simulator)
app.post("/api/incoming-email", async (req, res) => {
  const { from, body, subject } = req.body;

  if (!from || !body) {
    return res.status(400).json({ error: "Missing from or body parameter" });
  }

  addSimLog("incoming", `E-post mottagen till alska.dela.bjudin@gmail.com från ${from}. Ämne: "${subject || ''}"`);

  if (!isApprovedSender(from)) {
    addSimLog("system", `AVVISAD E-POST: Avsändaren ${from} är inte på listan över godkända ledaradresser.`);
    return res.status(403).json({ error: "Avsändaren är inte på listan över godkända ledaradresser." });
  }

  try {
    const washed = await runAiWash(body, {
      role: "Församlingsledare",
      contact: from,
      originalType: "leader_invitation"
    });

    const id = getNextFreeId();
    const offsetSeconds = calculateSecondsUntilTime(washed.time);
    const expiryTimestamp = Date.now() + (offsetSeconds + 2 * 3600) * 1000;

    const newAnnouncement: ActiveAlert = {
      id,
      type: "leader_invitation",
      rawText: body,
      scrubbedText: washed.scrubbedText,
      area: washed.area || "Kortedala",
      time: washed.time || "Ospecificerad tid",
      gender: "Alla",
      language: "Svenska",
      locationName: washed.locationName || washed.area || "Göteborg",
      coords: washed.coords,
      cloakedCoords: washed.cloakedCoords,
      timestamp: Date.now(),
      responsibleParty: washed.responsibleParty || "Församlingsledare",
      contactType: "sms",
      contactValue: washed.contactValue || from,
      expiryTimestamp,
      category: washed.category || "Måltid & Gemenskap",
      isFull: false,
      status: "active"
    };

    activeAlerts[id] = newAnnouncement;
    saveActiveAlerts();

    await triggerPushAlert(newAnnouncement);

    addSimLog("system", `NY INBJUDAN SKAPAD VIA E-POST: "${newAnnouncement.scrubbedText.substring(0, 50)}..." i [${newAnnouncement.area}].`);
    res.json({ success: true, id });

  } catch (err: any) {
    console.error("Failed to process incoming email:", err);
    addSimLog("system", `Fel vid bearbetning av e-post: ${err.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Web Simulator trigger endpoints
app.post("/api/sim/whatsapp", async (req, res) => {
  const { from, body } = req.body;
  const dummyFrom = from || "0709998877";
  const dummyBody = body || "[Kortedala] [18:00] [Måltid & Gemenskap] [Middag hos familjen Andersson. Välkomna!] [Hjälpföreningen] [0701234567]";

  addSimLog("incoming", `[Simulator] Skickar låtsas-SMS: "${dummyBody}"`);

  // Route to the new SMS gateway flow with security secret header
  const response = await fetch(`http://localhost:${PORT}/api/incoming-sms`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "X-API-Secret": API_SECRET
    },
    body: JSON.stringify({ sender: dummyFrom, text: dummyBody })
  });

  const data = await response.json();
  res.json(data);
});

app.get("/api/sim/messages", (req, res) => {
  res.json(simLogs);
});

app.get("/api/sim/active-alerts", (req, res) => {
  const safeAlerts = Object.values(activeAlerts)
    .filter(alert => alert.status !== "pending")
    .map(alert => ({
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
      contactType: alert.contactType,
      category: alert.category,
      isFull: !!alert.isFull,
      status: alert.status || "active"
    }));
  res.json(safeAlerts);
});

app.get("/api/whatsapp/status", (req, res) => {
  // Return clean disconnected state for simulator dashboard backwards compatibility
  res.json({
    status: "disconnected",
    qrCode: null,
    error: null
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
