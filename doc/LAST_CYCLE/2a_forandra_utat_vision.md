# Steg 2a: Förändra utåt – Vision (TCK-011)

## 1. Yttre vision och serverless-arkitektur
- **Tillståndslös server**: Samordning ska fungera 100 % serverless utan lokala filer i `data/*.json`.
- **Snabbhet & Noll latency**: Läsningar tillgodoses från snabb minnescache och synkas transparent mot Firestore med realtidsuppdateringar.
- **Serverless Cloud Function Export**: Hela Express-applikationen med samtliga API-rutter (`/api/alerts`, `/api/incoming-sms`, `/api/admin/*`, `/api/wash`) ska exporteras som en standard Firebase Cloud Function `onRequest`-kompatibel handler samtidigt som dev-servern med Vite behålls.
