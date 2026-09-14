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
export let adminNumbers: string[] = [];
export let trustedNumbers: string[] = [];
export const pairedDevices = new Set<string>();

const ADMINS_FILE_PATH = path.join(process.cwd(), "data", "admins.json");
const TRUSTED_FILE_PATH = path.join(process.cwd(), "data", "trusted.json");

export const API_SECRET = process.env.SMS_WEBHOOK_SEC || process.env.SMS_WEBHOOK_SECRET || "samordning-secret-2026";

let firebaseServerApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;

export function getFirestoreInstance(): Firestore | null {
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
  } catch (err) {
    console.warn("[Firestore Storage] Offline fallback:", err);
    return null;
  }
}

export async function loadActiveAlerts() {
  const db = getFirestoreInstance();
  if (!db) return;
  try {
    const snap = await getDocs(collection(db, "alerts"));
    for (const key of Object.keys(activeAlerts)) delete activeAlerts[key];
    snap.forEach(d => { activeAlerts[d.id] = { ...(d.data() as ActiveAlert), id: d.id }; });
  } catch (err) { console.warn("[Firestore] Larm-inläsning fel:", err); }
}

export async function saveActiveAlerts() {
  const db = getFirestoreInstance();
  if (!db) return;
  try {
    const col = collection(db, "alerts");
    for (const [id, alert] of Object.entries(activeAlerts)) {
      await setDoc(doc(col, String(id)), alert);
    }
  } catch (err) { console.warn("[Firestore] Larm-sparande fel:", err); }
}

export async function removeActiveAlertFromFirestore(id: string) {
  const db = getFirestoreInstance();
  if (!db) return;
  try { await deleteDoc(doc(collection(db, "alerts"), String(id))); } catch (err) { console.warn(err); }
}

export function getNextFreeId(): string {
  let next = 1;
  while (activeAlerts[String(next)]) next++;
  return String(next);
}

export async function loadPairedDevices() {
  const db = getFirestoreInstance();
  if (!db) return;
  try {
    const snap = await getDocs(collection(db, "paired_devices"));
    pairedDevices.clear();
    snap.forEach(d => pairedDevices.add(d.id));
  } catch (err) { console.warn("[Firestore] Parning fel:", err); }
}

export async function savePairedDevices() {
  const db = getFirestoreInstance();
  if (!db) return;
  try {
    const col = collection(db, "paired_devices");
    for (const token of pairedDevices) await setDoc(doc(col, token), { token, pairedAt: Date.now() });
  } catch (err) { console.warn("[Firestore] Parning fel:", err); }
}

export function pairDeviceToken(token: string): boolean {
  if (!token || !token.trim()) return false;
  const clean = token.trim();
  pairedDevices.add(clean);
  pairedDevices.add(clean.toLowerCase());
  const db = getFirestoreInstance();
  if (db) {
    setDoc(doc(collection(db, "paired_devices"), clean), { token: clean, pairedAt: Date.now() }).catch(console.warn);
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
  if (db) {
    try {
      const snap = await getDocs(collection(db, "system_config"));
      snap.forEach(d => {
        if (d.id === docId && Array.isArray(d.data()?.numbers)) {
          d.data().numbers.forEach((n: string) => { const norm = normalizePhone(String(n || "").trim()); if (norm) set.add(norm); });
        }
      });
    } catch (err) { console.warn(`[Firestore] ${docId} inläsning fel:`, err); }
  }
  const result = Array.from(set);
  try {
    if (result.length > 0 && !fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(result, null, 2), "utf8");
    }
  } catch (err) {
    console.warn(`[Storage] Kunde inte skriva initial fallback till ${filePath}:`, err);
  }
  return result;
}

async function saveStoredNumbers(filePath: string, docId: string, numbers: string[]): Promise<void> {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(numbers, null, 2), "utf8");
  } catch (err) { console.warn(`[Storage] Fel vid sparande till ${filePath}:`, err); }
  const db = getFirestoreInstance();
  if (!db) return;
  try {
    await setDoc(doc(collection(db, "system_config"), docId), { numbers, updatedAt: Date.now() });
  } catch (err) { console.warn(`[Firestore] ${docId} sparande fel:`, err); }
}

export async function loadAdmins() {
  adminNumbers = await loadStoredNumbers(ADMINS_FILE_PATH, "admins", process.env.ADMIN_NUMBERS);
}

export async function saveAdmins() {
  await saveStoredNumbers(ADMINS_FILE_PATH, "admins", adminNumbers);
}

export async function loadTrusted() {
  trustedNumbers = await loadStoredNumbers(TRUSTED_FILE_PATH, "trusted", process.env.TRUSTED_NUMBERS);
}

export async function saveTrusted() {
  await saveStoredNumbers(TRUSTED_FILE_PATH, "trusted", trustedNumbers);
}

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
  loadActiveAlerts().catch(console.warn);
  loadAdmins().catch(console.warn);
  loadTrusted().catch(console.warn);
  loadPairedDevices().catch(console.warn);

  const db = getFirestoreInstance();
  if (db) {
    try {
      onSnapshot(collection(db, "paired_devices"), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" || change.type === "modified") {
            pairedDevices.add(change.doc.id);
            pairedDevices.add(change.doc.id.toLowerCase());
          }
        });
      }, console.warn);
    } catch (err) { console.warn(err); }

    try {
      onSnapshot(collection(db, "alerts"), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" || change.type === "modified") {
            activeAlerts[change.doc.id] = { ...(change.doc.data() as ActiveAlert), id: change.doc.id };
          }
          if (change.type === "removed") delete activeAlerts[change.doc.id];
        });
      }, console.warn);
    } catch (err) { console.warn(err); }
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
  }, 60000);

  setInterval(() => {
    const now = Date.now();
    for (const [sender, draft] of smsDrafts.entries()) {
      if (now - draft.timestamp > 30 * 60 * 1000) {
        smsDrafts.delete(sender);
        addSimLog("system", `AUTOMATISK RENSNING: SMS-utkast från ${sender} har tagits bort.`);
      }
    }
  }, 60000);
}
