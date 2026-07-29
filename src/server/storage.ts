// [src/server/storage.ts] - Server-side in-memory and disk persistent storage management

import path from "path";
import fs from "fs";
import { ActiveAlert } from "../shared/types";
import { addSimLog } from "../main/services/pushService";

export interface SmsDraft {
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

export const smsDrafts = new Map<string, SmsDraft>();
export const activeAlerts: Record<string, ActiveAlert> = {};

const ALERTS_FILE = path.join(process.cwd(), "data", "alerts.json");
const ADMINS_FILE = path.join(process.cwd(), "data", "admins.json");
const TRUSTED_FILE = path.join(process.cwd(), "data", "trusted.json");
const PAIRED_DEVICES_FILE = path.join(process.cwd(), "data", "paired_devices.json");

export let adminNumbers: string[] = [];
export let trustedNumbers: string[] = [];
export const pairedDevices = new Set<string>();

export const API_SECRET = process.env.SMS_WEBHOOK_SEC || process.env.SMS_WEBHOOK_SECRET || "samordning-secret-2026";

export function loadActiveAlerts() {
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

export function saveActiveAlerts() {
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

export function getNextFreeId(): string {
  let next = 1;
  while (activeAlerts[String(next)]) {
    next++;
  }
  return String(next);
}

export function loadPairedDevices() {
  if (fs.existsSync(PAIRED_DEVICES_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(PAIRED_DEVICES_FILE, "utf-8"));
      if (Array.isArray(data)) {
        data.forEach((token: string) => pairedDevices.add(token));
        console.log(`Loaded ${pairedDevices.size} paired devices from disk.`);
      }
    } catch (err) {
      console.error("Failed to load paired devices from disk:", err);
    }
  }
}

export function savePairedDevices() {
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    fs.writeFileSync(PAIRED_DEVICES_FILE, JSON.stringify(Array.from(pairedDevices), null, 2));
  } catch (err) {
    console.error("Failed to save paired devices to disk:", err);
  }
}

export function pairDeviceToken(token: string): boolean {
  if (!token || !token.trim()) return false;
  pairedDevices.add(token.trim());
  savePairedDevices();
  return true;
}

export function loadAdmins() {
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

export function saveAdmins() {
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

export function loadTrusted() {
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

export function saveTrusted() {
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

export function normalizePhone(num: string): string {
  let cleaned = num.replace(/\s+/g, '');
  if (cleaned.startsWith("+46")) return "0" + cleaned.substring(3);
  if (cleaned.startsWith("0046")) return "0" + cleaned.substring(4);
  return cleaned;
}

export async function sendOutboundSms(toNumbers: string[], message: string) {
  for (const num of toNumbers) {
     console.log("[OUTBOUND SMS SIMULATION] Till:", num, "Meddelande:", message);
  }
}

export function initServerStorage() {
  loadActiveAlerts();
  loadAdmins();
  loadTrusted();
  loadPairedDevices();

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
  }, 60000);

  setInterval(() => {
    const now = Date.now();
    for (const [sender, draft] of smsDrafts.entries()) {
      if (now - draft.timestamp > 30 * 60 * 1000) {
        smsDrafts.delete(sender);
        addSimLog("system", `AUTOMATISK RENSNING: SMS-utkast från ${sender} har tagits bort på grund av inaktivitet.`);
      }
    }
  }, 60000);
}
