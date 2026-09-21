# Steg 4: Producera (TCK-LT-015)

## Genomförda åtgärder i Fas 2
1. **Korrigering av `isEphemeral`-villkoret**:
   - I `src/features/live_translation/domain/translationBridge.ts`:
     - I både `connect()` och `executeHotSwap()` ändrades villkoret till:
       ```ts
       const isEphemeral = !this.currentApiKey.startsWith("AIza") && /^auth_?tokens\//i.test(this.currentApiKey);
       ```
     - Säkerställt att:
       1. `isEphemeral` ENBART utvärderas till `true` om `this.currentApiKey` faktiskt är en ephemeral token (`/^auth_?tokens\//i`).
       2. Om `this.currentApiKey` startar med "AIza" blir `isEphemeral` ALLTID `false`, även om en `tokenProvider` finns angiven.
       3. När `isEphemeral` är `false` går anslutningen alltid till:
          `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(this.currentApiKey)}`
     - Filen håller sig på 240 rader (< 250 rader).

2. **Enhetstester**:
   - I `src/features/live_translation/domain/__tests__/translationBridge.test.ts`:
     - Lade till testfall för att verifiera att när en `tokenProvider` tillhandahåller en `"AIzaSy..."`-nyckel dirigeras anslutningen till v1beta med `?key=...` och varken `BidiGenerateContentConstrained` eller `access_token=`.
     - Samtliga 16 enhetstester körda och godkända gröna.
     - Filen håller sig på 248 rader (< 250 rader).
