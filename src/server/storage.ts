// [src/server/storage.ts] - Server-side in-memory, disk and Cloud Firestore persistent storage management
import fs from "fs";
import path from "path";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, collection, doc, setDoc, getDocs, deleteDoc, onSnapshot } from "firebase/firestore";
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
export const API_SECRET = process.env.SMS_WEBHOOK_SEC || process.env.SMS_WEBHOOK_SECRET || "samordning-secret-2026";
let firebaseServerApp: FirebaseApp | null = null, firestoreDb: Firestore | null = null;

export function getFirestoreInstance(): Firestore | null {
  if (firestoreDisabled) return null;
  if (firestoreDb) return firestoreDb;
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || "gen-lang-client-0355423833";
    const databaseId = process.env.FIREBASE_DATABASE_ID || "ai-studio-lskadelaochbjudi-8f1f880e-4630-4f7d-ad96-d842f26ef2d1";
    if (!firebaseServerApp) {
      const existing = getApps();
      firebaseServerApp = existing.length > 0 ? getApp() : initializeApp({ projectId });
    }
    firestoreDb = databaseId ? getFirestore(firebaseServerApp, databaseId) : getFirestore(firebaseServerApp);
    return firestoreDb;
  } catch (err) { handleFirestoreError(err, "Init"); return null; }
}

export async function loadActiveAlerts() {
  if (firestoreDisabled) return;
  const db = getFirestoreInstance();
  if (!db) return;
  try {
    const snap = await getDocs(collection(db, "alerts"));
    for (const key of Object.keys(activeAlerts)) delete activeAlerts[key];
    snap.forEach(d => { activeAlerts[d.id] = { ...(d.data() as ActiveAlert), id: d.id }; });
  } catch (err) { handleFirestoreError(err, "Larm-inläsning"); }
}

export async function saveActiveAlerts() {
  if (firestoreDisabled) return;
  const db = getFirestoreInstance();
  if (!db) return;
  try {
    const col = collection(db, "alerts");
    for (const [id, alert] of Object.entries(activeAlerts)) await setDoc(doc(col, String(id)), alert);
  } catch (err) { handleFirestoreError(err, "Larm-sparande"); }
}

export async function removeActiveAlertFromFirestore(id: string) {
  if (firestoreDisabled) return;
  const db = getFirestoreInstance();
  if (!db) return;
  try { await deleteDoc(doc(collection(db, "alerts"), String(id))); }
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
    const snap = await getDocs(collection(db, "paired_devices"));
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
    const col = collection(db, "paired_devices");
    for (const token of pairedDevices) await setDoc(doc(col, token), { token, pairedAt: Date.now() });
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
    if (db) setDoc(doc(collection(db, "paired_devices"), clean), { token: clean, pairedAt: Date.now() }).catch(err => handleFirestoreError(err, "Spara parning"));
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
      const snap = await getDocs(collection(db, "system_config"));
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
  try { await setDoc(doc(collection(db, "system_config"), docId), { numbers, updatedAt: Date.now() }); }
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
      unsubPaired = onSnapshot(collection(db, "paired_devices"), snap => {
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
      unsubAlerts = onSnapshot(collection(db, "alerts"), snap => {
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
