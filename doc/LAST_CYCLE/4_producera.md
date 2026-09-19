# Steg 4: Producera (TCK-LT-012)

## Genomförda åtgärder
1. **TDD-tester (`src/features/live_translation/domain/__tests__/translationBridge.test.ts`)**:
   - Kompletterat testet för reella anslutningar (`AIzaSyTestRealKey123`) med kontroller som bekräftar att WebSocket dirigeras till `BidiGenerateContent?key=AIzaSyTestRealKey123` och varken innehåller `BidiGenerateContentConstrained` eller `access_token=`.
   - Uppdaterat testet för dynamisk `tokenProvider` så att nycklar som inte börjar med `auth_tokens/` (t.ex. standard API-nycklar) dirigeras till `BidiGenerateContent?key=...`.
   - Behållit testet för efemära tokens (`auth_tokens/...`) som dirigerar till `BidiGenerateContentConstrained?access_token=...`.
2. **Källkod (`src/features/live_translation/domain/translationBridge.ts`)**:
   - I `connect()`: ändrat `isEphemeral` till `this.currentApiKey.startsWith("auth_tokens/")`.
   - I `executeHotSwap()`: ändrat `isEphemeral` till `this.currentApiKey.startsWith("auth_tokens/")`.
3. **Tester och synkronisering**:
   - Verifierat med vitest att alla 15 enhetstester passerar.
   - Kör `verify-architecture.js` och synkroniserar ändringarna till GitHub vid cykelavslut.
