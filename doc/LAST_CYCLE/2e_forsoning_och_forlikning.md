# Steg 2e: Försoning och förlikning (TCK-011)

## 1. Syntes och beslut
Arkitektursyntesen etablerar:
1. **Firestore-persistens i `src/server/storage.ts`**:
   - Använder Firebase Modular SDK (`firebase/app`, `firebase/firestore`) mot samlingarna `alerts`, `system_config` och `paired_devices`.
   - Initierar realtidslyssnare vid uppstart som fyller och kontinuerligt uppdaterar in-memory objekten `activeAlerts`, `adminNumbers`, `trustedNumbers` och `pairedDevices`.
   - Alla skrivoperationer persisteras asynkront till Firestore utan disk-I/O mot `data/*.json`.
2. **Serverless Cloud Function Wrapper i `server.ts`**:
   - Skapar och konfigurerar Express-appen med `setupRoutes(app)`.
   - Exporterar `app` och startar servern i fristående läge eller som Cloud Functions v2 `onRequest`-handler.
3. **Dokumentation och ADR-uppdatering**:
   - `doc/DECISIONS.md` uppdateras för att återspegla Firestore som kanonisk molndatabas och serverless arkitektur.
