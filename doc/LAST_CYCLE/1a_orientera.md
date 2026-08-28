# Steg 1a: Orientera (TCK-011)

## 1. Bakgrund och målbild
Samordning ska migreras från en tillståndsberoende Express-instans med lokala JSON-filer (`data/*.json`) på Render (som lider av 30–50 sekunders cold-starts) till en serverless-arkitektur på Firebase (Firebase Cloud Functions v2 + Cloud Firestore):
- **Tillståndslös datalagring**: Ersätta diskbaserad filskrivning i `src/server/storage.ts` med Cloud Firestore för `activeAlerts`, `adminNumbers`, `trustedNumbers` och `pairedDevices`.
- **Serverless Express Wrapper**: Exponera Express-appen via ett modulärt gränssnitt som både stöder standard Node/Vite (i dev/container) och serverless Cloud Function export (`onRequest`) med bevarad webhook-validering (`x-api-secret`).
- **Oförändrad kärnlogik**: Bevara all SMS-kommandohantering, AI-tvätt med Gemini och push-tjänster intakta.

## 2. Sokratiska GROW-coachningsfrågor
1. **Goal (Mål)**: Hur konfigurerar vi Firestore i `src/server/storage.ts` så att alla läsningar och skrivningar sker tillförlitligt, snabbt (< 1-3s) och asynkront mot Firestore-databasen `ai-studio-lskadelaochbjudi-8f1f880e-4630-4f7d-ad96-d842f26ef2d1` samtidigt som en snabb minnescache hålls i RAM för omedelbar respons?
2. **Reality (Nuläge & Antaganden)**: `src/server/storage.ts` använder idag `fs.readFileSync` och `fs.writeFileSync` mot lokala filer i `data/`. `src/main/config/firebaseClient.ts` innehåller grundläggande klientkonfiguration men saknar server/backend-inläsning för konfigurerade databas-ID:n.
3. **Obstacles & Options (Hinder och vägar framåt)**: Hur garanterar vi att SMS-webhooks, simuleringar och Express-rutter svarar omedelbart utan att blockeras av externa nätverksanrop, och hur säkerställer vi full bakåtkompatibilitet med befintliga tester och gränssnitt?

```json
{
  "status": "IN_PROGRESS",
  "current_domain": "Global",
  "next_step": "1b_kartlagga",
  "ticket_id": "TCK-011",
  "active_skill": "wayfinder"
}
```
