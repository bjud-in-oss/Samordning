// [src/main/config/firebaseClient.ts] - Firebase Client Configuration and Firestore Connectors

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, collection, getDocs, onSnapshot, query, orderBy, limit, DocumentData } from "firebase/firestore";

const metaEnv = (import.meta as unknown as { env: Record<string, string | undefined> }).env || {};

const DEFAULT_PROJECT_ID = "gen-lang-client-0355423833";
const DEFAULT_DATABASE_ID = "ai-studio-lskadelaochbjudi-8f1f880e-4630-4f7d-ad96-d842f26ef2d1";

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSy_demo_key",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || `${DEFAULT_PROJECT_ID}.firebaseapp.com`,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || `${DEFAULT_PROJECT_ID}.appspot.com`,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "52213981999",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:52213981999:web:ai-studio-applet"
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

try {
  const projectId = metaEnv.VITE_FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID;
  const databaseId = metaEnv.VITE_FIREBASE_DATABASE_ID || DEFAULT_DATABASE_ID;

  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
  console.log("[FirebaseClient] Firestore ansluten till projekt:", projectId);
} catch (err) {
  console.warn("[FirebaseClient] Kunde inte initiera Firebase Client:", err);
}

export { app, db };

/**
 * Fetch open alerts directly from Firestore collection 'alerts'
 */
export async function fetchAlertsFromFirestore() {
  if (!db) return null;
  try {
    const alertsCol = collection(db, "alerts");
    const q = query(alertsCol, orderBy("timestamp", "desc"), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (err) {
    console.warn("[FirebaseClient] Firestore läsfel:", err);
    return null;
  }
}

/**
 * Subscribe to realtime alerts from Firestore
 */
export function subscribeToFirestoreAlerts(onUpdate: (alerts: DocumentData[]) => void) {
  if (!db) return () => {};
  try {
    const alertsCol = collection(db, "alerts");
    const q = query(alertsCol, orderBy("timestamp", "desc"), limit(50));
    return onSnapshot(q, (snapshot) => {
      const alerts = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      onUpdate(alerts);
    }, (err) => {
      console.warn("[FirebaseClient] Firestore snapshot-fel:", err);
    });
  } catch (err) {
    console.warn("[FirebaseClient] Kunde inte starta Firestore-lyssnare:", err);
    return () => {};
  }
}
