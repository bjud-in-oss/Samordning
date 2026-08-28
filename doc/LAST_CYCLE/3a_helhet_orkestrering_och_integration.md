# Steg 3a: Helhet, orkestrering och integration (TCK-011)

## 1. Systemintegration
- **Firestore Initialization**: `src/server/storage.ts` initierar Firestore med `projectId` och `databaseId` från `firebase-applet-config.json` eller miljövariabler (`FIREBASE_PROJECT_ID`, `FIREBASE_DATABASE_ID`).
- **Realtime Data Sync**: Samlingarna `alerts`, `system_config` (dokumenten `admins` och `trusted`) samt `paired_devices` synkroniseras kontinuerligt via `onSnapshot` / Firestore queries.
- **Serverless Wrapper**: `server.ts` konfigurerar Express-appen och exporterar `app` och `createApp` för serverless och lokal miljö.
