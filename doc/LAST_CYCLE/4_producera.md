# Steg 4: Producera (TCK-011)

## 1. Genomförande
- Skapat enhetstester i `src/server/__tests__/storage.test.ts` som testar telefonnummernormalisering, ID-allokering, enhetsparning och RAM/Firestore-abstraktion.
- Refaktorerat `src/server/storage.ts` från lokala JSON-filer (`data/*.json`) till Cloud Firestore (`alerts`, `system_config`, `paired_devices`) med realtidslyssnare (`onSnapshot`) och snabb minnescache för 0ms latens.
- Uppdaterat `src/main/config/firebaseClient.ts` med full typsäkerhet och anslutning till projekt `gen-lang-client-0355423833` och Firestore-databas `ai-studio-lskadelaochbjudi-8f1f880e-4630-4f7d-ad96-d842f26ef2d1`.
- Uppdaterat `server.ts` så att Express-applikationen exporteras (`createApp`, `app`) för att fungera både som fristående Express-server och som en serverless Firebase Cloud Function (`onRequest`).
