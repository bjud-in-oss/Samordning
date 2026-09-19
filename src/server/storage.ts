/**
 * ============================================================================
 * SÄKERHET OCH PRIVACY BY DESIGN (ANONYMITETSGARANTI)
 * ============================================================================
 * Det här systemet lagrar INGA personuppgifter (inga namn, e-postadresser, IP-
 * adresser eller telefonnummer) för vanliga medlemmar/användare.
 *
 * Databasen/minnet sparar endast:
 * 1. Anonyma push-tokens (slumpmässiga adress-strängar från webbläsaren)
 * 2. Valda intresseområden för notiser
 * 3. Systeminställningar & telefonnummer till explicit godkända administratörer
 *
 * Inga användarrörelser eller personuppgifter får någonsin sparas i dessa samlingar.
 * ============================================================================
 */

// [src/server/storage.ts] - Server-side persistent storage management with Firebase Admin SDK
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import fs from "fs";
import path from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { ActiveAlert } from "../shared/types";
import { addSimLog } from "../main/services/pushService";

export interface SmsDraft {
  rawText: string;
  extractedMetadata: {
    category: "Vara en vän" | "Få näring av Guds ord" | "Hjälpa andra";
    area: string | null; time: string | null; audience: "Alla" | "Enbart missionärerna";
    organization: string; locationName: string; language: string | null;
  };
  missingAreaForTeaching: boolean;
  timestamp: number;
}

export const smsDrafts = new Map<string, SmsDraft>();
export const activeAlerts: Record<string, ActiveAlert> = {};
export let adminNumbers: string[] = [], trustedNumbers: string[] = [];
export const pairedDevices = new Set<string>();
export let firestoreDisabled = false; let loggedDisabledNotice = false;

export function handleFirestoreError(err: unknown, context: string) {
  if (!err) return;
  const errorObj = err as { code?: string; message?: string };
  const msg = String(errorObj.message || err);
  if (errorObj.code === "permission-denied" || /permission/i.test(msg)) {
    firestoreDisabled = true;
    if (!loggedDisabledNotice) {
      loggedDisabledNotice = true;
      console.log("[Firestore Storage] Ingen databasbehörighet. Växlar permanent till 100% lokalt RAM- och diskläge.");
    }
  } else if (context) console.warn(`[Firestore ${context}]`, err);
}

const ADMINS_FILE_PATH = path.join(process.cwd(), "data", "admins.json");
const TRUSTED_FILE_PATH = path.join(process.cwd(), "data", "trusted.json");
export const PAIRED_FILE_PATH = path.join(process.cwd(), "data", "paired_devices.json");
export const API_SECRET = process.env.SMS_WEBHOOK_SECRET || process.env.SMS_WEBHOOK_SEC;

if (!API_SECRET) {
  console.error("❌ KRITISKT FEL: SMS_WEBHOOK_SECRET saknas i .env.local!");
}

let firestoreDb: Firestore | null = null;

export function getFirestoreInstance(): Firestore | null {
  if (firestoreDisabled) return null;
  if (firestoreDb) return firestoreDb;
  try {
    if (!getApps().length) {
      const serviceAccountPath = path.join(process.cwd(), "serviceAccountKey.json");
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
        initializeApp({
          credential: cert(serviceAccount)
        });
        console.log("🔥 [Firestore Storage] Ansluten med full admin-behörighet via serviceAccountKey.json!");
        console.log("🔒 [Privacy] Databasen konfigurerad: Inga personuppgifter sparas (100% anonyma användare).");
      } else {
        const projectId = process.env.FIREBASE_PROJECT_ID || "gen-lang-client-0355423833";
        initializeApp({ projectId });
      }
    }
    firestoreDb = getFirestore();
    return firestoreDb;
  } catch (err) { handleFirestoreError(err, "Init"); return null; }
}

export async function loadActiveAlerts() {
  if (firestoreDisabled) return;
  const db = getFirestoreInstance();
  if (!db) return;
  try {
    const snap = await db.collection("alerts").get();
    for (const key of Object.keys(activeAlerts)) delete activeAlerts[key];
    snap.forEach(d => { activeAlerts[d.id] = { ...(d.data() as ActiveAlert), id: d.id }; });
  } catch (err) { handleFirestoreError(err, "Larm-inläsning"); }
}

export async function saveActiveAlerts() {
  if (firestoreDisabled) return;
  const db = getFirestoreInstance();
  if (!db) return;
  try {
    for (const [id, alert] of Object.entries(activeAlerts)) {
      await db.collection("alerts").doc(String(id)).set(alert);
    }
  } catch (err) { handleFirestoreError(err, "Larm-sparande"); }
}

export async function removeActiveAlertFromFirestore(id: string) {
  if (firestoreDisabled) return;
  const db = getFirestoreInstance();
  if (!db) return;
  try { await db.collection("alerts").doc(String(id)).delete(); }
  catch (err) { handleFirestoreError(err, "Larm-borttagning"); }
}

export function getNextFreeId(): string {
  let next = 1;
  while (activeAlerts[String(next)]) next++;
  return String(next);
}

export async function loadPairedDevices() {
  try {
    if (fs.existsSync(PAIRED_FILE_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(PAIRED_FILE_PATH, "utf8"));
      if (Array.isArray(parsed)) parsed.forEach(t => { if (typeof t === "string" && t.trim()) { pairedDevices.add(t.trim()); pairedDevices.add(t.trim().toLowerCase()); } });
    }
  } catch (err) { console.warn("[Storage] Disk inläsning av paired_devices fel:", err); }
  if (firestoreDisabled) return;
  const db = getFirestoreInstance();
  if (!db) return;
  try {
    const snap = await db.collection("paired_devices").get();
    snap.forEach(d => { pairedDevices.add(d.id); pairedDevices.add(d.id.toLowerCase()); });
  } catch (err) { handleFirestoreError(err, "Parning inläsning"); }
}

export async function savePairedDevices() {
  try {
    fs.mkdirSync(path.dirname(PAIRED_FILE_PATH), { recursive: true });
    fs.writeFileSync(PAIRED_FILE_PATH, JSON.stringify(Array.from(pairedDevices), null, 2), "utf8");
  } catch (err) { console.warn("[Storage] Fel vid sparande av paired_devices till disk:", err); }
  if (firestoreDisabled) return;
  const db = getFirestoreInstance();
  if (!db) return;
  try {
    for (const token of pairedDevices) {
      await db.collection("paired_devices").doc(token).set({ token, pairedAt: Date.now() });
    }
  } catch (err) { handleFirestoreError(err, "Parning sparande"); }
}

export function pairDeviceToken(token: string): boolean {
  if (!token || !token.trim()) return false;
  const clean = token.trim();
  pairedDevices.add(clean);
  pairedDevices.add(clean.toLowerCase());
  try {
    fs.mkdirSync(path.dirname(PAIRED_FILE_PATH), { recursive: true });
    fs.writeFileSync(PAIRED_FILE_PATH, JSON.stringify(Array.from(pairedDevices), null, 2), "utf8");
  } catch (err) { console.warn("[Storage] Fel vid sparande av paired_devices till disk:", err); }
  if (!firestoreDisabled) {
    const db = getFirestoreInstance();
    if (db) db.collection("paired_devices").doc(clean).set({ token: clean, pairedAt: Date.now() }).catch(err => handleFirestoreError(err, "Spara parning"));
  }
  return true;
}

async function loadStoredNumbers(filePath: string, docId: string, envVar?: string): Promise<string[]> {
  const set = new Set<string>();
  if (envVar) envVar.split(',').forEach(n => { const norm = normalizePhone(n.trim()); if (norm) set.add(norm); });
  try {
    if (fs.existsSync(filePath)) {
      const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (Array.isArray(parsed)) parsed.forEach(n => { const norm = normalizePhone(String(n || "").trim()); if (norm) set.add(norm); });
    }
  } catch (err) { console.warn(`[Storage] Disk inläsning av ${docId} fel:`, err); }
  const db = getFirestoreInstance();
  if (db && !firestoreDisabled) {
    try {
      const snap = await db.collection("system_config").get();
      snap.forEach(d => {
        if (d.id === docId && Array.isArray(d.data()?.numbers)) d.data().numbers.forEach((n: string) => { const norm = normalizePhone(String(n || "").trim()); if (norm) set.add(norm); });
      });
    } catch (err) { handleFirestoreError(err, `${docId} inläsning`); }
  }
  const result = Array.from(set);
  try {
    if (result.length > 0 && !fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(result, null, 2), "utf8");
    }
  } catch (err) { console.warn(`[Storage] Kunde inte skriva initial fallback till ${filePath}:`, err); }
  return result;
}

async function saveStoredNumbers(filePath: string, docId: string, numbers: string[]): Promise<void> {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(numbers, null, 2), "utf8");
  } catch (err) { console.warn(`[Storage] Fel vid sparande till ${filePath}:`, err); }
  const db = getFirestoreInstance();
  if (!db || firestoreDisabled) return;
  try { await db.collection("system_config").doc(docId).set({ numbers, updatedAt: Date.now() }); }
  catch (err) { handleFirestoreError(err, `${docId} sparande`); }
}

export async function loadAdmins() { adminNumbers = await loadStoredNumbers(ADMINS_FILE_PATH, "admins", process.env.ADMIN_NUMBERS); }
export async function saveAdmins() { await saveStoredNumbers(ADMINS_FILE_PATH, "admins", adminNumbers); }
export async function loadTrusted() { trustedNumbers = await loadStoredNumbers(TRUSTED_FILE_PATH, "trusted", process.env.TRUSTED_NUMBERS); }
export async function saveTrusted() { await saveStoredNumbers(TRUSTED_FILE_PATH, "trusted", trustedNumbers); }

export function normalizePhone(num: string): string {
  let c = num.replace(/\s+/g, '');
  if (c.startsWith("+46")) return "0" + c.substring(3);
  if (c.startsWith("0046")) return "0" + c.substring(4);
  return c;
}

export async function sendOutboundSms(toNumbers: string[], message: string) {
  for (const num of toNumbers) console.log("[OUTBOUND SMS] Till:", num, "Meddelande:", message);
}

export function initServerStorage() {
  loadActiveAlerts().catch(err => handleFirestoreError(err, "Init larm"));
  loadAdmins().catch(err => handleFirestoreError(err, "Init admins"));
  loadTrusted().catch(err => handleFirestoreError(err, "Init trusted"));
  loadPairedDevices().catch(err => handleFirestoreError(err, "Init paired"));

  if (firestoreDisabled) return;
  const db = getFirestoreInstance();
  if (db) {
    let unsubPaired: (() => void) | null = null, unsubAlerts: (() => void) | null = null;
    try {
      unsubPaired = db.collection("paired_devices").onSnapshot(snap => {
        snap.docChanges().forEach(change => {
          if (change.type === "added" || change.type === "modified") {
            pairedDevices.add(change.doc.id);
            pairedDevices.add(change.doc.id.toLowerCase());
          }
        });
      }, err => {
        handleFirestoreError(err, "paired_devices listener");
        if (unsubPaired) { try { unsubPaired(); } catch { /* ignore */ } unsubPaired = null; }
      });
    } catch (err) { handleFirestoreError(err, "paired_devices listener"); }

    try {
      unsubAlerts = db.collection("alerts").onSnapshot(snap => {
        snap.docChanges().forEach(change => {
          if (change.type === "added" || change.type === "modified") activeAlerts[change.doc.id] = { ...(change.doc.data() as ActiveAlert), id: change.doc.id };
          if (change.type === "removed") delete activeAlerts[change.doc.id];
        });
      }, err => {
        handleFirestoreError(err, "alerts listener");
        if (unsubAlerts) { try { unsubAlerts(); } catch { /* ignore */ } unsubAlerts = null; }
      });
    } catch (err) { handleFirestoreError(err, "alerts listener"); }
  }

  setInterval(() => {
    const now = Date.now();
    for (const [id, alert] of Object.entries(activeAlerts)) {
      if (alert.expiryTimestamp && alert.expiryTimestamp < now) {
        delete activeAlerts[id];
        removeActiveAlertFromFirestore(id).catch(console.warn);
        addSimLog("system", `AUTOMATISK SUPPRESSION: Inbjudan ${id} har förfallit och raderats.`);
      }
    }
    for (const [sender, draft] of smsDrafts.entries()) {
      if (now - draft.timestamp > 30 * 60 * 1000) {
        smsDrafts.delete(sender);
        addSimLog("system", `AUTOMATISK RENSNING: SMS-utkast från ${sender} har tagits bort.`);
      }
    }
  }, 60000);
}
