# Steg 1b: Kartlägga (TCK-LT-015)

## Svar på GROW-frågor

1. **Contract**:
   *Svar*: `isEphemeral` ska utvärderas strikt mot mönstret för efemära tokens och utesluta standardnycklar:
   ```ts
   const isEphemeral = !this.currentApiKey.startsWith("AIza") && /^auth_?tokens\//i.test(this.currentApiKey);
   ```
   Detta säkerställer att:
   - Den enbart är `true` om `this.currentApiKey` matchar `/^auth_?tokens\//i`.
   - Om `this.currentApiKey` börjar med `"AIza"` returneras ALLTID `false`, oavsett om `tokenProvider` finns.

2. **State & Effects**:
   *Svar*: När `isEphemeral` är `false` dirigeras anslutningen i både `connect()` och `executeHotSwap()` till:
   ```ts
   `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(this.currentApiKey)}`
   ```
   Om `tokenProvider` tillhandahåller en nyckel som börjar med `"AIza"`, dirigeras sessionen korrekt till v1beta med `?key=`, vilket förhindrar 401/403-autentiseringsfel på v1alpha Constrained-endpointen.

3. **Resilience & Testing**:
   *Svar*: I `src/features/live_translation/domain/__tests__/translationBridge.test.ts` lägger vi till ett explicit testfall där en `tokenProvider` returnerar en `"AIzaSy..."`-nyckel och verifierar att WebSocket kopplar till v1beta `BidiGenerateContent?key=...` och INTE `BidiGenerateContentConstrained` eller `access_token=`. Vi optimerar befintliga tester så att totalt radantal förblir < 250 rader.

```json
{
  "status": "In Progress",
  "current_domain": "live_translation",
  "next_step": "2a",
  "ticket_id": "TCK-LT-015",
  "active_skill": "gemini-api",
  "active_vectors": ["Contract"]
}
```
