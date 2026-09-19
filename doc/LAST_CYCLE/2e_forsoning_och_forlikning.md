# Steg 2e: Försoning och förlikning (TCK-LT-012)

## Målharmonisering
1. **Källkodsändring (`src/features/live_translation/domain/translationBridge.ts`)**:
   - I `connect()`:
     ```ts
     const isEphemeral = this.currentApiKey.startsWith("auth_tokens/");
     const wsUrl = isEphemeral
       ? `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(this.currentApiKey)}`
       : `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(this.currentApiKey)}`;
     ```
   - I `executeHotSwap()`:
     ```ts
     const isEphemeral = this.currentApiKey.startsWith("auth_tokens/");
     const wsUrl = isEphemeral
       ? `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(this.currentApiKey)}`
       : `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(this.currentApiKey)}`;
     ```
2. **TDD-tester (`src/features/live_translation/domain/__tests__/translationBridge.test.ts`)**:
   - Verifiera att anslutningar med `AIza...` alltid använder standardendpointen med `?key=`.
   - Verifiera att dynamisk `tokenProvider` som returnerar en API-nyckel (ej börjande med `auth_tokens/`) använder `?key=`.
   - Verifiera att `tokenProvider` som returnerar `auth_tokens/...` använder `BidiGenerateContentConstrained?access_token=...`.
   - Säkerställ att filstorleken för testfilen hålls inom 250-radersgränsen.

MÄTTNAD: JA
