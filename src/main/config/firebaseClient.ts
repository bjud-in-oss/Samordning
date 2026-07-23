// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/4_Produce] - Anonymous Firestore Client Verified Saved

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, collection, getDocs, onSnapshot, query, orderBy, limit } from "firebase/firestore";

const metaEnv = (import.meta as any).env || {};

// Anonymous Firebase config loaded from environment or fallback placeholders
const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSy_demo_key",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "demo-app.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "demo-app",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "demo-app.appspot.com",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:000000000000:web:000000000000"
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

try {
  if (metaEnv.VITE_FIREBASE_PROJECT_ID) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    console.log("[FirebaseClient] Anonym Firestore-anslutning initierad.");
  } else {
    console.log("[FirebaseClient] VITE_FIREBASE_PROJECT_ID saknas. Använder server-fallback.");
  }
} catch (err) {
  console.warn("[FirebaseClient] Kunde inte initiera Firebase Client:", err);
}

export { app, db };

/**
 * Fetch open alerts anonymously directly from Firestore collection 'alerts'
 */
export async function fetchAlertsFromFirestore() {
  if (!db) return null;
  try {
    const alertsCol = collection(db, "alerts");
    const q = query(alertsCol, orderBy("timestamp", "desc"), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.warn("[FirebaseClient] Firestore läsfel:", err);
    return null;
  }
}

/**
 * Subscribe to realtime alerts anonymously from Firestore
 */
export function subscribeToFirestoreAlerts(onUpdate: (alerts: any[]) => void) {
  if (!db) return () => {};
  try {
    const alertsCol = collection(db, "alerts");
    const q = query(alertsCol, orderBy("timestamp", "desc"), limit(50));
    return onSnapshot(q, (snapshot) => {
      const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      onUpdate(alerts);
    }, (err) => {
      console.warn("[FirebaseClient] Firestore snapshot-fel:", err);
    });
  } catch (err) {
    console.warn("[FirebaseClient] Kunde inte starta Firestore-lyssnare:", err);
    return () => {};
  }
}
