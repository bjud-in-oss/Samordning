# Steg 2c2: Gren B – Hybrid Firestore-persistens med realtidslyssnare och RAM-cache (TCK-011)

## 1. Beskrivning av Gren B
I `src/server/storage.ts`:
- Håll in-memory strukturerna `activeAlerts`, `adminNumbers`, `trustedNumbers` och `pairedDevices` uppdaterade.
- Koppla upp `initServerStorage()` till Firestore med realtidssynkning (`onSnapshot`) för `alerts`, `system_config` och `paired_devices`.
- När ändringar görs (`saveActiveAlerts()`, `saveAdmins()`, `saveTrusted()`, `pairDeviceToken()`) skriver vi direkt asynkront till Firestore (`setDoc`, `deleteDoc`).
- Exportera Express-appen som `api` Cloud Function v2 (`onRequest(app)`) samt starta standard-lyssnare i dev-läge.
