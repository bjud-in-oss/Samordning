// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]
import fs from "fs";
import path from "path";
import webpush from "web-push";
import { SubscriptionRecord, ActiveAlert, SimLog } from "../types";
import { calculateSecondsUntilTime } from "./parser";

const SUBS_FILE = path.join(process.cwd(), "data", "subscriptions.json");

// Ensure data folder exists
if (!fs.existsSync(path.join(process.cwd(), "data"))) {
  fs.mkdirSync(path.join(process.cwd(), "data"));
}

export let subscriptions: SubscriptionRecord[] = [];

// Load subscriptions safely
export function loadSubscriptions() {
  if (fs.existsSync(SUBS_FILE)) {
    try {
      subscriptions = JSON.parse(fs.readFileSync(SUBS_FILE, "utf-8"));
    } catch (err) {
      console.error("Failed to load subscriptions", err);
      subscriptions = [];
    }
  }
}

export function saveSubscriptions() {
  try {
    fs.writeFileSync(SUBS_FILE, JSON.stringify(subscriptions, null, 2));
  } catch (err) {
    console.error("Failed to save subscriptions", err);
  }
}

// System Logs for Simulator Console
export const simLogs: SimLog[] = [];

export function addSimLog(type: SimLog["type"], message: string, details?: any) {
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

export function initWebPush() {
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
}

export function getVapidPublicKey() {
  return vapidPublicKey;
}

// Trigger Web Push notifications to matching volunteers and await delivery to return the final count
export async function triggerPushAlert(alert: ActiveAlert): Promise<number> {
  let pushCount = 0;
  addSimLog("system", `Router matchar larm i [${alert.area}] mot anonyma prenumeranter.`);

  const ttlSeconds = calculateSecondsUntilTime(alert.time);
  addSimLog("system", `Beräknat larm TTL: ${ttlSeconds} sekunder fram till kl ${alert.time}.`);

  const alertGenderLower = alert.gender.toLowerCase();
  const isBrorRequest = alertGenderLower.includes("bror") || alertGenderLower.includes("broder") || alertGenderLower.includes("äldste");
  const isSysterRequest = alertGenderLower.includes("syster") || alertGenderLower.includes("systrar") || alertGenderLower.includes("hjälpförening");

  const normalize = (l: string) => {
    const s = l.toLowerCase();
    if (s.includes("sven") || s.includes("swe")) return "svenska";
    if (s.includes("eng") || s.includes("en")) return "english";
    if (s.includes("span") || s.includes("esp") || s.includes("spa")) return "español";
    if (s.includes("swah") || s.includes("kisw") || s.includes("swa")) return "kiswahili";
    if (s.includes("viet") || s.includes("tiếng") || s.includes("tieng")) return "tiếng việt";
    return s;
  };

  const alertLang = alert.language.toLowerCase();
  const normAlert = normalize(alertLang);

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
      const subLangs = s.tags.languages || [];
      const isMatched = subLangs.some(lang => {
        const normSub = normalize(lang);
        return normSub === normAlert || lang.toLowerCase().includes(alertLang) || alertLang.includes(lang.toLowerCase());
      });

      if (!isMatched) {
        addSimLog("system", `Hoppar över prenumerant ${s.id.substring(0, 6)}... då prenumeranten inte stödjer det önskade språket [${alert.language}].`);
        continue;
      }

      // Build personalized payload including requireInteraction if user wanted it sticky
      const payload = JSON.stringify({
        title: `Missionärsbehov i ${alert.area}!`,
        body: `Plats: ~${alert.locationName} (${alert.gender}, ${alert.language}) kl ${alert.time}`,
        id: alert.id,
        requireInteraction: s.tags.requireInteraction ?? true // True by default
      });

      try {
        await webpush.sendNotification(s.subscription, payload, { TTL: ttlSeconds });
        pushCount++;
      } catch (err: any) {
        // If subscription has expired (410 Gone), remove it
        if (err.statusCode === 410) {
          subscriptions = subscriptions.filter(sub => sub.id !== s.id);
          saveSubscriptions();
        }
        console.error("Web Push Error", err.statusCode || err);
      }
    }
  }

  addSimLog("push", `Utskick klart: ${pushCount} matchande volontärer har aviserats.`);
  return pushCount;
}

// Broadcasts a silent Web Push CANCEL request to remove active notifications from locked screens
export async function broadcastCancelPush(alertId: string, area: string) {
  const cancelPayload = JSON.stringify({
    type: "CANCEL",
    id: alertId
  });

  let cancelPushCount = 0;
  for (const s of subscriptions) {
    const areaMatch = s.tags.areas.includes(area);
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
  addSimLog("push", `Skickat tyst avbeställnings-push till ${cancelPushCount} volontärer för larm ${alertId}.`);
}

// Initialize subscriptions
loadSubscriptions();
