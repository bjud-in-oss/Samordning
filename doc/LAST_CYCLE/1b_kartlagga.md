# Steg 1b: Kartlägga (TCK-011)

## 1. Svar på GROW-coachningsfrågor mot kodbasen
1. **Goal (Mål)**: 
   - I `src/server/storage.ts`: Använda Firebase Modular/Firestore SDK mot samlingarna `alerts`, `system_config` (för `adminNumbers` och `trustedNumbers`) och `paired_devices`.
   - Implementera realtidslyssnare (`onSnapshot`) eller asynkrona läs-/skrivfunktioner (`doc`, `setDoc`, `getDocs`, `deleteDoc`) som synkroniserar med Firestore samtidigt som RAM-objekten uppdateras direkt för 0ms latency.
2. **Reality (Nuläge)**:
   - `src/server/storage.ts` har synkrona `loadActiveAlerts`, `saveActiveAlerts`, `loadAdmins`, `saveAdmins`, `loadTrusted`, `saveTrusted`, `loadPairedDevices`, `savePairedDevices` som anropar `fs`.
   - `firebase-applet-config.json` finns i roten med `projectId: "gen-lang-client-0355423833"` och `firestoreDatabaseId: "ai-studio-lskadelaochbjudi-8f1f880e-4630-4f7d-ad96-d842f26ef2d1"`.
   - `firebase` v12 är installerat i `package.json`.
3. **Obstacles & Options (Hinder och åtgärder)**:
   - Vi ser till att `src/server/storage.ts` initierar Firestore med `projectId` och `databaseId` från `firebase-applet-config.json` eller miljövariabler, med mjuk fallback om offline så att inga krascher sker.
   - Vi skapar en ren express-app wrapper och Cloud Function v2 export i `src/server/index.ts` / `server.ts` så att applikationen kan köras både som fristående Express-server och serverless `onRequest`-funktion.
