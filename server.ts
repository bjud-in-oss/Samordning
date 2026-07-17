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
    category: "Måltid & Gemenskap" | "Lektion & Samtal" | "Tjänande";
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

const API_SECRET = process.env.SMS_WEBHOOK_SEC || process.env.SMS_WEBHOOK_SECRET || "samordning-secret-2026";

// Dynamic Administrator List backing data/admins.json
const ADMINS_FILE = path.join(process.cwd(), "data", "admins.json");
let adminNumbers: string[] = [];

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

// Load alerts & admins at startup
loadActiveAlerts();
loadAdmins();

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

// Administrator list is maintained strictly server-side/file-side.

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
app.post("/api/announcements", async (req, res) => {
  const { text, area, time, audience, organization, language, category, locationName } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Text krävs." });
  }

  const trimmedText = text.trim();

  try {
    const id = getNextFreeId();
    const targetArea = area || "Kortedala";
    const { coords, cloakedCoords } = getCoordsForArea(targetArea);

    const offsetSeconds = calculateSecondsUntilTime(time || "18:00");
    const expiryTimestamp = Date.now() + (offsetSeconds + 2 * 3600) * 1000;

    const isLektionAndSamtal = (category || "Måltid & Gemenskap") === "Lektion & Samtal" && (organization || "Enskild/Familj") === "Missionärerna";
    const escalationLevel = isLektionAndSamtal ? 1 : undefined;

    const newAnnouncement: ActiveAlert = {
      id,
      type: "leader_invitation",
      rawText: trimmedText,
      scrubbedText: trimmedText, // Maintain original personal text exactly, never rewrite
      area: targetArea,
      time: time || "Ospecificerad tid",
      gender: audience || "Alla", // gender holds the target audience in ActiveAlert
      language: language || "Svenska",
      locationName: locationName || targetArea || "Kapellet",
      coords,
      cloakedCoords,
      timestamp: Date.now(),
      responsibleParty: organization || "Enskild/Familj",
      contactType: "web",
      contactValue: "Webbklient",
      expiryTimestamp,
      category: category || "Måltid & Gemenskap",
      isFull: false,
      status: "pending",
      escalationLevel
    };

    activeAlerts[id] = newAnnouncement;
    saveActiveAlerts();

    const adminListStr = adminNumbers.filter(num => num !== "+46701234567").join(", ");
    const modMsg = `MODERERINGS-NOTIFIERING till samordningsgruppen [${adminListStr}]: "Nytt inlägg för granskning (ID: ${id}). Svara #GODKÄNN ${id} eller #AVVISA ${id}."`;
    addSimLog("system", modMsg);
    console.log(`[MODERATION] ${modMsg}`);

    res.json({
      success: true,
      id,
      message: "Tack! Din inbjudan granskas av samordningsgruppen och publiceras snart."
    });

  } catch (err: any) {
    console.error("Failed to process web announcement:", err);
    addSimLog("system", `Fel vid bearbetning av webbinlägg: ${err.message}`);
    res.status(500).json({ error: "Internt serverfel vid bearbetning av webbinlägg." });
  }
});

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
  // INFRASTRUKTUR:
  // 1. Automate (Android): Använd 'SMS Received' -> 'HTTP POST' till denna endpoint -> 'Send SMS' med svaret.
  // 2. Render Sleep: Gratis-instanser somnar efter 15 min. Sätt upp ett externt cron-jobb (t.ex. cron-job.org) som anropar bas-URL:en (GET /) var 14:e minut mellan kl 07-23 för att undvika SMS-timeouts.

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

  let trimmedText = text.trim();
  addSimLog("incoming", `Inkommande SMS från ${sender}: "${trimmedText}"`);

  const isAdmin = adminNumbers.some(num => normalizePhone(num) === normalizePhone(sender));

  // Command & Regex Matching for Route B (Strikta kommandon)
  const isHelp = trimmedText === "#" || trimmedText.toUpperCase() === "#HJÄLP" || trimmedText.toUpperCase() === "#HELP";
  const godkannMatch = trimmedText.match(/^#GODKÄNN\s+(\d+)$/i);
  const avvisaMatch = trimmedText.match(/^#AVVISA\s+(\d+)$/i);
  const delMatch = trimmedText.match(/^#DEL\s+(\d+)$/i);
  const fullMatch = trimmedText.match(/^#FULL\s+(\d+)$/i);
  const expanderaMatch = trimmedText.match(/^#EXPANDERA\s+(\d+)$/i);
  const isPublicera = trimmedText.toUpperCase() === "#PUBLICERA";
  const avsandareMatch = trimmedText.match(/^#AVSÄNDARE\s+(.+)$/i);

  // Determine if it is a strict command
  const isStrictCommand = isHelp || !!godkannMatch || !!avvisaMatch || !!delMatch || !!fullMatch || !!expanderaMatch || isPublicera || !!avsandareMatch;

  if (isStrictCommand) {
    // ROUTE B: Execute Strict Commands

    // 1. Help Menu
    if (isHelp) {
      addSimLog("system", `SMS-HJÄLP BEGÄRD av ${sender}.`);
      return res.json({
        success: true,
        replyMessage: "Hjälpmeny:\n1. Skapa inlägg: Skriv din inbjudan.\n2. Godkänn: Svara #GODKÄNN ID.\n3. Radera inlägg: Svara #DEL ID.\n4. Markera fullbokad: Svara #FULL ID.\n5. Expandera larm: Svara #EXPANDERA ID.\n6. Ändra avsändare/fält: #AVSÄNDARE Namn (eller #OMRÅDE Kortedala)."
      });
    }

    // 2. Moderation commands (#GODKÄNN / #AVVISA)
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

    // 3. Delete command (DEL <ID>)
    if (delMatch) {
      const id = delMatch[1];
      const alert = activeAlerts[id];
      if (!alert) {
        addSimLog("system", `KOMMANDO MISSLYCKADES: DEL ${id} hittades inte.`);
        return res.status(404).json({ error: `Inbjudan med ID ${id} hittades inte.` });
      }

      const isAuthorized = isAdmin || normalizePhone(sender) === normalizePhone(alert.contactValue);
      if (!isAuthorized) {
        addSimLog("system", `AVVISAD DEL: ${sender} har inte behörighet att radera inbjudan ${id}.`);
        return res.status(403).json({ error: "Obehörig avsändare." });
      }

      delete activeAlerts[id];
      saveActiveAlerts();
      await broadcastCancelPush(id, alert.area);
      addSimLog("system", `SMS KILL SWITCH: Inbjudan ${id} har raderats permanent via SMS.`);
      return res.json({ success: true, replyMessage: `Inbjudan ${id} har raderats permanent.` });
    }

    // 4. Full command (FULL <ID>)
    if (fullMatch) {
      const id = fullMatch[1];
      const alert = activeAlerts[id];
      if (!alert) {
        addSimLog("system", `KOMMANDO MISSLYCKADES: FULL ${id} hittades inte.`);
        return res.status(404).json({ error: `Inbjudan med ID ${id} hittades inte.` });
      }

      const isAuthorized = isAdmin || normalizePhone(sender) === normalizePhone(alert.contactValue);
      if (!isAuthorized) {
        addSimLog("system", `AVVISAD FULL: ${sender} har inte behörighet att markera ${id} som fullbokat.`);
        return res.status(403).json({ error: "Obehörig avsändare." });
      }

      alert.isFull = true;
      saveActiveAlerts();
      addSimLog("system", `SMS KILL SWITCH: Inbjudan ${id} har markerats som fullbokad via SMS.`);
      return res.json({ success: true, replyMessage: `Inbjudan ${id} har markerats som fullbokad.` });
    }

    // 5. Expand command (#EXPANDERA <ID>)
    if (expanderaMatch) {
      const id = expanderaMatch[1];
      const alert = activeAlerts[id];
      if (!alert) {
        addSimLog("system", `KOMMANDO MISSLYCKADES: #EXPANDERA ${id} hittades inte.`);
        return res.status(404).json({ error: `Inbjudan med ID ${id} hittades inte.` });
      }

      const isAuthorized = isAdmin || normalizePhone(sender) === normalizePhone(alert.contactValue);
      if (!isAuthorized) {
        addSimLog("system", `AVVISAD EXPANDERA: ${sender} har inte behörighet att expandera inbjudan ${id}.`);
        return res.status(403).json({ error: "Obehörig avsändare." });
      }

      alert.escalationLevel = 2;
      saveActiveAlerts();

      // Trigger push notifications now with level 2
      await triggerPushAlert(alert);

      addSimLog("system", `SMS EXPANDERA: Inbjudan ${id} har expanderats till alla bevakare av ${sender}.`);
      return res.json({
        success: true,
        replyMessage: `Inbjudan ${id} har expanderats! Aviseringar har skickats till övriga stödsyskon som bevakar området.`
      });
    }

    // 6. Publicera command (#PUBLICERA)
    if (isPublicera) {
      const draft = smsDrafts.get(sender);
      if (!draft) {
        return res.json({
          success: false,
          replyMessage: "Du har inget aktivt utkast att publicera. Skriv först din inbjudan."
        });
      }

      if (draft.missingAreaForTeaching) {
        return res.json({
          success: false,
          replyMessage: "Inlägget kan inte publiceras. För att rätt lokala stödsyskon ska nås måste du ange vilket område personen bor i. Skicka ett nytt meddelande som innehåller området."
        });
      }

      const id = getNextFreeId();
      const area = draft.extractedMetadata.area || "Kortedala";
      const { coords, cloakedCoords } = getCoordsForArea(area);
      const offsetSeconds = calculateSecondsUntilTime(draft.extractedMetadata.time || "18:00");
      const expiryTimestamp = Date.now() + (offsetSeconds + 2 * 3600) * 1000;
      const status = isAdmin ? "active" : "pending";

      const draftCategory = draft.extractedMetadata.category || "Måltid & Gemenskap";
      const draftOrg = draft.extractedMetadata.organization || (isAdmin ? "Arrangör" : "Medlem");
      const isLektionAndSamtal = draftCategory === "Lektion & Samtal" && draftOrg === "Missionärerna";
      const escalationLevel = isLektionAndSamtal ? 1 : undefined;

      const newAnnouncement: ActiveAlert = {
        id,
        type: "leader_invitation",
        rawText: draft.rawText,
        scrubbedText: draft.rawText, // Maintain original personal text exactly
        area,
        time: draft.extractedMetadata.time || "Ospecificerad tid",
        gender: draft.extractedMetadata.audience || "Alla",
        language: draft.extractedMetadata.language || "Svenska",
        locationName: draft.extractedMetadata.locationName || area,
        coords,
        cloakedCoords,
        timestamp: Date.now(),
        responsibleParty: draftOrg,
        contactType: "sms",
        contactValue: sender,
        expiryTimestamp,
        category: draftCategory,
        isFull: false,
        status,
        escalationLevel
      };

      activeAlerts[id] = newAnnouncement;
      saveActiveAlerts();
      smsDrafts.delete(sender);

      if (status === "pending") {
        const adminListStr = adminNumbers.join(", ");
        const modMsg = `MODERERINGS-NOTIFIERING: "Nytt inlägg för granskning (ID: ${id}). Svara #GODKÄNN ${id} eller #AVVISA ${id}."`;
        addSimLog("system", modMsg);
        await sendOutboundSms(adminNumbers, modMsg);

        return res.json({
          success: true,
          id,
          replyMessage: `Tack! Ditt inlägg (ID: ${id}) har placerats i väntrummet för granskning. En samordnare kommer att granska och godkänna det via SMS inom kort.`
        });
      }

      await triggerPushAlert(newAnnouncement);
      addSimLog("system", `NY INBJUDAN SKAPAD VIA SMS: "${newAnnouncement.scrubbedText.substring(0, 50)}..." i [${newAnnouncement.area}] av ${newAnnouncement.responsibleParty}.`);
      return res.json({
        success: true,
        id,
        replyMessage: `Din inbjudan (ID: ${id}) har lagts upp direkt på tavlan! Radera med DEL ${id} eller markera som full med FULL ${id}.`
      });
    }

    // 7. Avsändare command (#AVSÄNDARE <Namn>)
    if (avsandareMatch) {
      const draft = smsDrafts.get(sender);
      if (!draft) {
        return res.json({
          success: false,
          replyMessage: "Du har inget aktivt utkast att uppdatera. Skriv din inbjudan först."
        });
      }

      const proposedOrg = avsandareMatch[1].trim();
      const allowedOrgs = [
        "Enskild/Familj", "Missionärerna", "Församlingsmissionärerna", "Biskopsrådet", "Äldstekvorumet", 
        "Hjälpföreningen", "Unga Män (UM)", "Unga Kvinnor (UK)", "Primär", "Söndagsskolan", 
        "Aktivitetskommittén", "Unga vuxna (UV)", "Ensamstående vuxna (EV)", "Institutet", 
        "Seminariet", "Staven"
      ];

      const matchedOrg = allowedOrgs.find(org => 
        org.toLowerCase() === proposedOrg.toLowerCase() || 
        org.toLowerCase().includes(proposedOrg.toLowerCase())
      );

      if (matchedOrg) {
        draft.extractedMetadata.organization = matchedOrg;
        draft.timestamp = Date.now();
        return res.json({
          success: true,
          replyMessage: `Utkastet uppdaterat! Ny avsändare: ${matchedOrg}. Svara #PUBLICERA för att godkänna och lägga upp.`
        });
      } else {
        return res.json({
          success: false,
          replyMessage: `Hittade inte avsändaren. Tillåtna avsändare: Enskild/Familj, Missionärerna, Församlingsmissionärerna, Biskopsrådet, Äldstekvorumet, Hjälpföreningen, Unga Män (UM), Unga Kvinnor (UK), Primär, Söndagsskolan, Aktivitetskommittén, Unga vuxna (UV), Ensamstående vuxna (EV), Institutet, Seminariet, Staven.`
        });
      }
    }
  }

  // If it is NOT a strict command, but starts with "#", it is ROUTE C (AI Support)
  if (trimmedText.startsWith("#")) {
    const textToProcess = trimmedText.substring(1).trim();
    
    const fieldMatch = trimmedText.match(/^#([A-Za-zÅÄÖåäö]+)\s+(.+)$/i);
    if (fieldMatch) {
       const field = fieldMatch[1].toLowerCase();
       const value = fieldMatch[2].trim();
       const draft = smsDrafts.get(sender);
       if (draft) {
         if (field === "område") draft.extractedMetadata.area = value;
         else if (field === "tid") draft.extractedMetadata.time = value;
         else if (field === "kategori") draft.extractedMetadata.category = value as any;
         else if (field === "plats") draft.extractedMetadata.locationName = value;
         draft.timestamp = Date.now();
         return res.json({ success: true, replyMessage: `Uppdaterat ${field} till ${value}. Svara #PUBLICERA för att godkänna.` });
       }
    }

    // Check if this looks like an announcement draft rather than a support question.
    const lower = textToProcess.toLowerCase();
    const hasQuestionIndicator = lower.includes("?") || 
      lower.includes("hur") || 
      lower.includes("vad") || 
      lower.includes("varför") || 
      lower.includes("när") || 
      lower.includes("vem") || 
      lower.includes("vilka") || 
      lower.includes("kan") || 
      lower.includes("gör") || 
      lower.includes("support") || 
      lower.includes("hjälp") || 
      lower.includes("help") || 
      lower.includes("info") || 
      lower.includes("instruktion");

    const looksLikeAnnouncement = lower.includes("hemafton") ||
      lower.includes("fika") ||
      lower.includes("middag") ||
      lower.includes("mat") ||
      lower.includes("bjud") ||
      lower.includes("träff") ||
      lower.includes("möte") ||
      lower.includes("lektion") ||
      lower.includes("flytt") ||
      lower.includes("städ") ||
      lower.includes("kl ") ||
      lower.includes("kl.");

    if (!hasQuestionIndicator || (looksLikeAnnouncement && !lower.includes("?"))) {
      // Re-route to Route A by updating trimmedText and letting the flow fall through
      trimmedText = textToProcess;
    } else {
      addSimLog("system", `SMS SUPPORT-FRÅGA från ${sender}: "${textToProcess}"`);
      try {
        const reply = await runSupportAgent(textToProcess);
        addSimLog("system", `Svar från support-AI: "${reply}"`);
        return res.json({
          success: true,
          replyMessage: reply
        });
      } catch (err: any) {
        console.error("SMS support agent call failed:", err);
        return res.status(500).json({ error: "Internt serverfel vid support-fråga." });
      }
    }
  }

  // Otherwise, it is ROUTE A (Utkast) - SMS does not start with "#"
  try {
    addSimLog("system", `SMS UTKAST-BEARBETNING från ${sender}: "${trimmedText}"`);
    const washed = await runGeminiWash(trimmedText);

    if (washed.warnings.missingAreaForTeaching) {
      return res.json({
        success: false,
        replyMessage: "Inlägget avvisades. För att rätt lokala stödsyskon ska nås måste du ange vilket område personen bor i."
      });
    }

    const newDraft: SmsDraft = {
      rawText: trimmedText,
      extractedMetadata: washed.extractedMetadata,
      missingAreaForTeaching: washed.warnings.missingAreaForTeaching,
      timestamp: Date.now()
    };

    smsDrafts.set(sender, newDraft);

    const meta = washed.extractedMetadata;
    const previewMessage = `Utkast sparat i 30 min (nummer visas ej)!

--- FÖRHANDSGRANSKNING ---
Avsändare: ${meta.organization}
Område: ${meta.area || "Ej angivet (ange område för att publicera!)"}
Kategori: ${meta.category}
Tid: ${meta.time || "Ospecificerad"}
Målgrupp: ${meta.audience}
Plats: ${meta.locationName || "Kapellet"}
Språk: ${meta.language || "Svenska"}
Inbjudan: ${trimmedText}
-------------------------

För att ändra avsändare skriv: #AVSÄNDARE [Namn]
För att godkänna och lägga upp, svara med: #PUBLICERA`;

    return res.json({
      success: true,
      replyMessage: previewMessage
    });

  } catch (err: any) {
    console.error("Failed to process incoming SMS draft:", err);
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

    const isLektionAndSamtal = (washed.category || "Måltid & Gemenskap") === "Lektion & Samtal" && (washed.responsibleParty || "Församlingsledare") === "Missionärerna";
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
      category: washed.category || "Måltid & Gemenskap",
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
