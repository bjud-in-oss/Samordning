// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/sms_assistant/4_Produce]
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { runAiWash, runGeminiWash, getCoordsForArea, isApprovedSender, STODDISTRIKT, calculateSecondsUntilTime } from "./src/features/mission_router/domain/parser";
import { runSupportAgent } from "./src/features/sms_assistant/domain/supportAgent";
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

interface SmsDraft {
  rawText: string;
  extractedMetadata: {
    category: "Vara en vän" | "Få näring av Guds ord" | "Hjälpa andra";
    area: string | null;
    time: string | null;
    audience: "Alla" | "Enbart missionärerna";
    organization: string;
    locationName: string;
    language: string | null;
  };
  missingAreaForTeaching: boolean;
  timestamp: number;
}

const smsDrafts = new Map<string, SmsDraft>();

const PORT = 3000;

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

const API_SECRET = process.env.SMS_WEBHOOK_SEC || process.env.SMS_WEBHOOK_SECRET || "samordning-secret-2026";

// Dynamic Administrator List backing data/admins.json
const ADMINS_FILE = path.join(process.cwd(), "data", "admins.json");
let adminNumbers: string[] = [];

// Dynamic Trusted Senders List backing data/trusted.json
const TRUSTED_FILE = path.join(process.cwd(), "data", "trusted.json");
let trustedNumbers: string[] = [];

function loadAdmins() {
  const envAdmins = process.env.ADMIN_NUMBERS ? process.env.ADMIN_NUMBERS.split(',').map(n => n.trim()) : [];
  if (envAdmins.length > 0) {
    adminNumbers = envAdmins;
    console.log(`Loaded ${adminNumbers.length} administrator numbers from ENV.`);
  } else if (fs.existsSync(ADMINS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(ADMINS_FILE, "utf-8"));
      if (Array.isArray(data)) {
        adminNumbers = data;
        console.log(`Loaded ${adminNumbers.length} administrator numbers from disk.`);
      }
    } catch (err) {
      console.error("Failed to load admin list from disk:", err);
    }
  } else {
    saveAdmins();
  }
}

function saveAdmins() {
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    fs.writeFileSync(ADMINS_FILE, JSON.stringify(adminNumbers, null, 2));
  } catch (err) {
    console.error("Failed to save admin list to disk:", err);
  }
}

function loadTrusted() {
  const envTrusted = process.env.TRUSTED_NUMBERS ? process.env.TRUSTED_NUMBERS.split(',').map(n => n.trim()) : [];
  if (envTrusted.length > 0) {
    trustedNumbers = envTrusted;
    console.log(`Loaded ${trustedNumbers.length} trusted numbers from ENV.`);
  } else if (fs.existsSync(TRUSTED_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(TRUSTED_FILE, "utf-8"));
      if (Array.isArray(data)) {
        trustedNumbers = data;
        console.log(`Loaded ${trustedNumbers.length} trusted numbers from disk.`);
      }
    } catch (err) {
      console.error("Failed to load trusted list from disk:", err);
    }
  } else {
    saveTrusted();
  }
}

function saveTrusted() {
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    fs.writeFileSync(TRUSTED_FILE, JSON.stringify(trustedNumbers, null, 2));
  } catch (err) {
    console.error("Failed to save trusted list to disk:", err);
  }
}

function normalizePhone(num: string): string {
  let cleaned = num.replace(/\s+/g, '');
  if (cleaned.startsWith("+46")) return "0" + cleaned.substring(3);
  if (cleaned.startsWith("0046")) return "0" + cleaned.substring(4);
  return cleaned;
}

async function sendOutboundSms(toNumbers: string[], message: string) {
  for (const num of toNumbers) {
     console.log("[OUTBOUND SMS SIMULATION] Till:", num, "Meddelande:", message);
  }
}

// Load alerts & admins & trusted at startup
loadActiveAlerts();
loadAdmins();
loadTrusted();
initWebPush(); // Initialize Web Push

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

// Automatic Expiry Cleanup Loop for SMS drafts (every minute, clears drafts > 30 mins old)
setInterval(() => {
  const now = Date.now();
  for (const [sender, draft] of smsDrafts.entries()) {
    if (now - draft.timestamp > 30 * 60 * 1000) {
      smsDrafts.delete(sender);
      addSimLog("system", `AUTOMATISK RENSNING: SMS-utkast från ${sender} har tagits bort på grund av inaktivitet.`);
    }
  }
}, 60000);

// ==========================================
// Express API Endpoints
// ==========================================

function setupRoutes(app: express.Express) {

// Administrator list is maintained strictly server-side/file-side.

// VAPID Public Key for Web Push subscription
app.get("/api/vapid-public-key", (req, res) => {
  res.json({ publicKey: getVapidPublicKey() });
});

// Analyze raw text invitation with Gemini
app.post("/api/wash", async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Text krävs." });
  }

  try {
    const washed = await runGeminiWash(text.trim());
    res.json(washed);
  } catch (err: any) {
    console.error("Wash error:", err);
    res.status(500).json({ error: "Kunde inte analysera inbjudan med AI: " + err.message });
  }
});

// Create announcement from Web client (pending by default, requiring admin moderation)
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
      primaryArea: tags?.primaryArea || "",
      limitAreas: !!tags?.limitAreas,
      limitedAreas: tags?.limitedAreas || [],
      limitOrganizations: !!tags?.limitOrganizations,
      limitedOrganizations: tags?.limitedOrganizations || [],
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
  const requestSecret = req.headers["x-api-secret"] || req.body.secret;
  if (requestSecret !== API_SECRET) {
    addSimLog("system", `AVVISAT WEBHOOK-ANROP: Obehörig API-nyckel/secret.`);
    return res.status(401).json({ error: "Unauthorized: Invalid or missing API Webhook Secret." });
  }

  const { sender, text } = req.body;
  if (!sender || !text) {
    return res.status(400).json({ error: "Avsändare och text krävs." });
  }

  let trimmedText = text.trim();
  addSimLog("incoming", `Inkommande SMS från ${sender}: "${trimmedText}"`);

  const isAdmin = adminNumbers.some(num => normalizePhone(num) === normalizePhone(sender));
  const isTrusted = trustedNumbers.some(num => normalizePhone(num) === normalizePhone(sender));
  const isTrustedOrAdmin = isAdmin || isTrusted;

  const isStatusReport = /^[\.#]$/.test(trimmedText);
  const jaDraftMatch = trimmedText.match(/^[\.#]ja$/i);
  const jaMatch = trimmedText.match(/^[\.#]ja\s+(\d+)$/i);
  const nejMatch = trimmedText.match(/^[\.#]nej\s+(\d+)$/i);
  const jaAllaMatch = trimmedText.match(/^[\.#]ja\s+alla\s+(\d+)$/i);
  const avsandareMatch = trimmedText.match(/^[\.#]avsändare\s+(.+)$/i);
  const expanderaMatch = trimmedText.match(/^[\.#]expandera\s+(\d+)$/i);
  const fullMatch = trimmedText.match(/^[\.#]full\s+(\d+)$/i);
  const isWebb = trimmedText.toUpperCase().startsWith("#WEBB");

  if (isStatusReport) {
    if (!isAdmin) return res.status(403).json({ error: "Obehörig." });
    let report = "";
    let count = 0;
    for (const id in activeAlerts) {
      const a = activeAlerts[id];
      report += `${id}. ${a.category} (${a.status === 'pending' ? 'Väntar' : 'Aktiv'})\n`;
      count++;
    }
    if (count === 0) report = "Inga inbjudningar.\n";
    report += "\nKommandon: .ja [nr], .nej [nr], .ja alla [nr], .avsändare [namn]";
    return res.json({ success: true, replyMessage: report });
  }

  if (jaDraftMatch) {
    if (!isAdmin) return res.status(403).json({ error: "Obehörig." });
    const draft = smsDrafts.get(sender);
    if (!draft) return res.json({ success: false, replyMessage: "Inget utkast att publicera." });
    if (draft.missingAreaForTeaching) return res.json({ success: false, replyMessage: "Område saknas." });
    
    const id = getNextFreeId();
    const area = draft.extractedMetadata.area || "Kortedala";
    const { coords, cloakedCoords } = getCoordsForArea(area);
    const offsetSeconds = calculateSecondsUntilTime(draft.extractedMetadata.time || "18:00");
    const expiryTimestamp = Date.now() + (offsetSeconds + 2 * 3600) * 1000;
    
    const draftCategory = draft.extractedMetadata.category || "Vara en vän";
    const draftOrg = draft.extractedMetadata.organization || "Arrangör";
    const isLektionAndSamtal = draftCategory === "Få näring av Guds ord" && draftOrg === "Missionärerna";
    const escalationLevel = isLektionAndSamtal ? 1 : undefined;

    const newAnnouncement: ActiveAlert = {
      id, type: "leader_invitation", rawText: draft.rawText, scrubbedText: draft.rawText,
      area, time: draft.extractedMetadata.time || "Ospecificerad tid",
      gender: draft.extractedMetadata.audience || "Alla", language: draft.extractedMetadata.language || "Svenska",
      locationName: draft.extractedMetadata.locationName || area, coords, cloakedCoords,
      timestamp: Date.now(), responsibleParty: draftOrg, contactType: "sms", contactValue: sender,
      expiryTimestamp, category: draftCategory, isFull: false, status: "active", escalationLevel
    };
    activeAlerts[id] = newAnnouncement;
    saveActiveAlerts();
    smsDrafts.delete(sender);
    await triggerPushAlert(newAnnouncement);
    addSimLog("system", `SMS MODERERING: Inbjudan ${id} publicerad av ${sender}.`);
    return res.json({ success: true, replyMessage: `Inbjudan ${id} har publicerats!` });
  }

  if (jaMatch || jaAllaMatch || nejMatch) {
    if (!isAdmin) return res.status(403).json({ error: "Obehörig." });
    const match = jaMatch || jaAllaMatch || nejMatch;
    if (!match) return res.status(400).json({ error: "Oväntat fel." }); // Should not happen
    
    const id = match[1];
    const alert = activeAlerts[id];
    if (!alert) return res.status(404).json({ error: `Hittade inte inbjudan ${id}.` });

    if (nejMatch) {
      delete activeAlerts[id];
      saveActiveAlerts();
      await broadcastCancelPush(id, alert.area);
      addSimLog("system", `SMS MODERERING: Inbjudan ${id} avvisad av ${sender}.`);
      return res.json({ success: true, replyMessage: `Inbjudan ${id} har raderats.` });
    }

    if (jaMatch || jaAllaMatch) {
      if (alert.status === "active") return res.json({ success: true, replyMessage: `Inbjudan ${id} är redan aktiv.` });
      alert.status = "active";
      saveActiveAlerts();
      await triggerPushAlert(alert);
      addSimLog("system", `SMS MODERERING: Inbjudan ${id} godkänd av ${sender}.`);
      
      let extraMessage = "";
      if (jaAllaMatch) {
        if (!trustedNumbers.includes(alert.contactValue)) {
          trustedNumbers.push(alert.contactValue);
          saveTrusted();
          extraMessage = " Avsändaren har vitlistats för framtida direktpubliceringar. (Kom ihåg att lägga till numret i TRUSTED_NUMBERS på Render för permanent lagring vid nästa kod-deploy)";
          addSimLog("system", `VITLISTAD: ${alert.contactValue} lades till i trusted list.`);
        }
      }
      return res.json({ success: true, replyMessage: `Inbjudan ${id} har publicerats!${extraMessage}` });
    }
  }

  if (expanderaMatch) {
    if (!isAdmin) return res.status(403).json({ error: "Obehörig." });
    const id = expanderaMatch[1];
    const alert = activeAlerts[id];
    if (!alert) return res.status(404).json({ error: `Hittade inte inbjudan ${id}.` });
    alert.escalationLevel = 2;
    saveActiveAlerts();
    await triggerPushAlert(alert);
    return res.json({ success: true, replyMessage: `Inbjudan ${id} har expanderats till övriga!` });
  }

  if (fullMatch) {
    const id = fullMatch[1];
    const alert = activeAlerts[id];
    if (!alert) return res.status(404).json({ error: `Hittade inte inbjudan ${id}.` });
    if (!isAdmin && normalizePhone(sender) !== normalizePhone(alert.contactValue)) return res.status(403).json({ error: "Obehörig." });
    alert.isFull = true;
    saveActiveAlerts();
    return res.json({ success: true, replyMessage: `Inbjudan ${id} har markerats som fullbokad.` });
  }

  if (avsandareMatch) {
    const draft = smsDrafts.get(sender);
    if (!draft) return res.json({ success: false, replyMessage: "Inget aktivt utkast." });
    draft.extractedMetadata.organization = avsandareMatch[1].trim();
    draft.timestamp = Date.now();
    return res.json({ success: true, replyMessage: `Ny avsändare: ${draft.extractedMetadata.organization}. Svara .ja för att publicera.` });
  }

  if (isWebb) {
    // Expected Format (Måste matcha exakt vad webbklienten skickar in): 
    // #WEBB
    // Kategori: [category]
    // Tid: [time]
    // Område: [area]
    // Avsändare: [organization]
    // Text: [rawText]
    const regex = /^#WEBB\s*Kategori:\s*(.+?)\s*Tid:\s*(.+?)\s*Område:\s*(.+?)\s*Avsändare:\s*(.+?)\s*Text:\s*(.*)$/si;
    const match = trimmedText.match(regex);
    if (!match) {
      return res.json({ success: false, replyMessage: "Felaktigt #WEBB format." });
    }
    const [, category, time, area, organization, rawText] = match;
    const audience = "Alla";
    const language = "Svenska";
    const id = getNextFreeId();
    const { coords, cloakedCoords } = getCoordsForArea(area);
    const offsetSeconds = calculateSecondsUntilTime(time);
    const expiryTimestamp = Date.now() + (offsetSeconds + 2 * 3600) * 1000;
    const isLektionAndSamtal = category === "Få näring av Guds ord" && organization === "Missionärerna";
    const status = isTrustedOrAdmin ? "active" : "pending";

    const newAnnouncement: ActiveAlert = {
      id, type: "leader_invitation", rawText, scrubbedText: rawText,
      area, time, gender: audience, language, locationName: area, coords, cloakedCoords,
      timestamp: Date.now(), responsibleParty: organization, contactType: "sms", contactValue: sender,
      expiryTimestamp, category, isFull: false, status, escalationLevel: isLektionAndSamtal ? 1 : undefined
    };

    activeAlerts[id] = newAnnouncement;
    saveActiveAlerts();

    if (status === "pending") {
      const modMsg = `Ny inbjudan ${id} väntar! Svara .ja ${id} eller .nej ${id}`;
      await sendOutboundSms(adminNumbers, modMsg);
      return res.json({ success: true, replyMessage: `Din inbjudan är i väntrummet (nr ${id}). En administratör godkänner strax!` });
    } else {
      await triggerPushAlert(newAnnouncement);
      return res.json({ success: true, replyMessage: `Din inbjudan (nr ${id}) har publicerats!` });
    }
  }

  // It's a normal SMS (draft creation)
  try {
    const washed = await runGeminiWash(trimmedText);
    const newDraft: SmsDraft = {
      rawText: trimmedText, extractedMetadata: washed.extractedMetadata,
      missingAreaForTeaching: washed.warnings.missingAreaForTeaching, timestamp: Date.now()
    };
    
    if (isTrustedOrAdmin) {
      // Auto-publish
      const meta = washed.extractedMetadata;
      if (washed.warnings.missingAreaForTeaching) {
        return res.json({ success: false, replyMessage: "Område saknas för lektion. Avvisades." });
      }
      const id = getNextFreeId();
      const area = meta.area || "Kortedala";
      const { coords, cloakedCoords } = getCoordsForArea(area);
      const offsetSeconds = calculateSecondsUntilTime(meta.time || "18:00");
      const expiryTimestamp = Date.now() + (offsetSeconds + 2 * 3600) * 1000;
      const isLektionAndSamtal = meta.category === "Få näring av Guds ord" && meta.organization === "Missionärerna";

      const newAnnouncement: ActiveAlert = {
        id, type: "leader_invitation", rawText: trimmedText, scrubbedText: trimmedText,
        area, time: meta.time || "Ospecificerad tid", gender: meta.audience || "Alla", language: meta.language || "Svenska",
        locationName: meta.locationName || area, coords, cloakedCoords, timestamp: Date.now(),
        responsibleParty: meta.organization || "Arrangör", contactType: "sms", contactValue: sender,
        expiryTimestamp, category: meta.category || "Vara en vän", isFull: false, status: "active", 
        escalationLevel: isLektionAndSamtal ? 1 : undefined
      };
      activeAlerts[id] = newAnnouncement;
      saveActiveAlerts();
      await triggerPushAlert(newAnnouncement);
      return res.json({ success: true, replyMessage: `Din inbjudan (nr ${id}) publicerades direkt!` });
    }

    smsDrafts.set(sender, newDraft);
    const previewMessage = `Utkast sparat i 30 min (ditt nummer döljs). Svara med .ja för att publicera, eller ändra med .avsändare [namn].`;
    return res.json({ success: true, replyMessage: previewMessage });
  } catch (err: any) {
    return res.status(500).json({ error: "Fel vid bearbetning." });
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

    const isLektionAndSamtal = (washed.category || "Vara en vän") === "Få näring av Guds ord" && (washed.responsibleParty || "Församlingsledare") === "Missionärerna";
    const escalationLevel = isLektionAndSamtal ? 1 : undefined;

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
      category: washed.category || "Vara en vän",
      isFull: false,
      status: "active",
      escalationLevel
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
  const dummyBody = body || "[Kortedala] [18:00] [Vara en vän] [Middag hos familjen Andersson. Välkomna!] [Hjälpföreningen] [0701234567]";

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

} // End of setupRoutes

// Serve Vite frontend
async function startServer() {
  const app = express();
  app.use(express.json());
  
  setupRoutes(app);

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
