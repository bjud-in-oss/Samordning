# Steg 2b: Evaluera yttre anpassning (TCK-LT-016)

## Yttre anpassning och API-kontrakt
1. **Google Live API Gateway Beteende**:
   - Om `access_token=auth_tokens%2F...` skickas avvisar Gemini med felmeddelande eller ogiltig token ("Invalid authentication").
   - När enbart det rena id:t skickas (`access_token=a99b540...`) verifieras token korrekt och servern svarar med `setupComplete`.
2. **Paket och skript**:
   - Lägga till `test:live`: `"tsx scripts/test-gemini-stream.ts"` i `package.json` under `scripts`.
   - Ger utvecklare och CI möjligheten att validera integrationen mot live API:t med ett enkelt kommando.
