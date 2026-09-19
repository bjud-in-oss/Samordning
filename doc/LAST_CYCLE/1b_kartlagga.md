# Steg 1b: Kartlägga (TCK-LT-012)

## Svar på GROW-frågor

1. **Contract**:
   *Svar*: Tidigare sattes `isEphemeral = Boolean(this.tokenProvider || this.currentApiKey.startsWith("auth_tokens/"))`. Detta medförde att om en `tokenProvider` användes för att tillhandahålla en traditionell API-nyckel, eller om en dynamisk resolver returnerade en nyckel, dirigerades anslutningen felaktigt till v1alpha `BidiGenerateContentConstrained?access_token=...`, vilket avvisas av Google Gemini API när värdet inte är ett faktiskt OAuth/ephemeral token. Genom att strikt binda `isEphemeral` till `this.currentApiKey.startsWith("auth_tokens/")` dirigeras alla API-nycklar (inklusive de som börjar på "AIza...") till den officiella v1beta-endpointen `BidiGenerateContent?key=...`.

2. **Effects**:
   *Svar*: I `translationBridge.test.ts`:
   - Testet på rad 186 ("skickar transkriberingskonfiguration på reella anslutningar") kompletteras med en verifiering att `ws.url` innehåller `BidiGenerateContent?key=AIzaSyTestRealKey123` och INTE innehåller `BidiGenerateContentConstrained` eller `access_token=`.
   - Testet på rad 222 ("förhindrar fallback...") uppdateras till att verifiera att en `tokenProvider` som returnerar en vanlig API-nyckel (t.ex. `"AIzaSyCustomToken"`) dirigeras till `BidiGenerateContent?key=AIzaSyCustomToken`.
   - Testet på rad 205 ("använder dynamisk tokenProvider...") fortsätter att verifiera `auth_tokens/ephemeral_token_vX` och använder då `BidiGenerateContentConstrained?access_token=...`.

3. **Resilience & Fail Fast**:
   *Svar*: I enlighet med ADR-018 sker direkt felrapportering: om `tokenProvider` inte kan tillhandahålla en nyckel eller om anslutningen stängs med auth-fel rapporteras felet omedelbart i klartext via `callbacks.onError`, och status sätts till `error` utan att hänga eller dölja orsak.

```json
{
  "status": "In Progress",
  "current_domain": "live_translation",
  "next_step": "2a",
  "ticket_id": "TCK-LT-012",
  "active_skill": "gemini-api",
  "active_vectors": ["Contract"]
}
```
