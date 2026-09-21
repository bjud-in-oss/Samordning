# Steg 1b: Kartlägga (TCK-LT-016)

## Svar på GROW-frågor

1. **Contract**:
   - I `src/server/routes.ts` skapas token via `@google/genai` med `uses: 50` och `liveConnectConstraints: { model: "models/gemini-3.5-live-translate-preview" }`.
   - Svaret returnerar både fullständigt resursnamn och rent token-id:
     ```
     {
       "token": "auth_tokens/xyz...",
       "tokenId": "xyz...",
       "name": "auth_tokens/xyz...",
       "cleanToken": "xyz...",
       "expireTime": "...",
       "model": "models/gemini-3.5-live-translate-preview"
     }
     ```
   - I `src/features/live_translation/domain/translationBridge.ts` bibehålls `isEphemeral`-kontrollen (`!this.currentApiKey.startsWith("AIza") && /^auth_?tokens\//i.test(this.currentApiKey)`). Vid konstruktion av `wsUrl` skalas prefixet av:
     ```ts
     const cleanToken = this.currentApiKey.replace(/^auth_?tokens\//i, "");
     const wsUrl = isEphemeral
       ? `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(cleanToken)}`
       : `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(this.currentApiKey)}`;
     ```

2. **State & Effects**:
   - Genom att ändra från `uses: 1` till `uses: 50` kan samma sessionstoken användas vid snabba återanslutningar och hot-swaps under de 30 minuterna som tokenet är aktivt, vilket eliminerar onödig token-förbrukning.
   - I `doc/skills/gemini-live-translate/SKILL.md` tas det onödiga `config`-underobjektet bort inuti `liveConnectConstraints` så att specifikationen matchar `@google/genai` TypeScript SDK:s officiella gränssnitt (`liveConnectConstraints: { model: "..." }`).

3. **Resilience & Testing**:
   - Skriptet `scripts/test-gemini-stream.ts` uppdateras för att läsa in `.env.local`, skapa ett ephemeral token via `ai.authTokens.create`, och koppla upp en skarp WebSocket mot Gemini Live API (`BidiGenerateContentConstrained`).
   - Skriptet skickar `setup`-meddelandet och verifierar att Gemini svarar med `{ "setupComplete": {} }`.
   - Skriptet anropas via `pnpm test:live` (`tsx scripts/test-gemini-stream.ts`).
   - `translationBridge.test.ts` uppdateras för att testa att prefixet skalas av i `access_token=`.

```json
{
  "status": "In Progress",
  "current_domain": "live_translation",
  "next_step": "2a",
  "ticket_id": "TCK-LT-016",
  "active_skill": "gemini-api",
  "active_vectors": ["Contract"]
}
```
