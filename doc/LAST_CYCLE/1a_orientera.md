# Steg 1a: Orientera (TCK-LT-016)

## Fokus och mål
Synkronisera Ephemeral Tokens, korrigera `doc/skills/gemini-live-translate/SKILL.md` och skapa ett skarpt integrationstest mot Gemini Live API:
1. **SKILL.md**:
   - Ändra "uses: 1" till "uses: 50" i Sektion 7 för att spegla behovet av återanslutningar och hot-swaps i realtid.
   - Korrigera kodexemplet under Sektion 7 så att `liveConnectConstraints` inte har ett överflödigt `config`-underobjekt.
2. **Server-rutt `/api/translation/token` (`src/server/routes.ts`)**:
   - Säkerställ att `ai.authTokens.create` inkluderar `liveConnectConstraints` med exakt modellnamn: `"models/gemini-3.5-live-translate-preview"`.
   - Returnera både det rena token-id:t (utan `"authTokens/"`-prefix) och det fullständiga resursnamnet i JSON-svaret.
3. **Klient `TranslationBridge` (`src/features/live_translation/domain/translationBridge.ts`)**:
   - Vid URL-bygge för `isEphemeral = true`: Om token-strängen startar med `"authTokens/"` eller `"auth_tokens/"`, skala av prefixet så att enbart det rena token-id:t skickas i `access_token=${encodeURIComponent(cleanToken)}`.
4. **Skarpt integrationstest (`scripts/test-gemini-stream.ts`)**:
   - Hämta `GEMINI_API_KEY` från `.env.local`, skapa ett ephemeral token via serverns logik, och genomföra en RIKTIG WebSocket-handskakning mot Geminis `wss://`-endpoint.
   - Verifiera att Gemini svarar med ett giltigt setup-svar (`setupComplete`) och inte stänger anslutningen med autentiseringsfel.
   - Lägg till skriptet i `package.json` under `test:live` (`tsx scripts/test-gemini-stream.ts`).
5. **Enhetstester och GitHub-synk**:
   - Uppdatera enhetstesterna i `translationBridge.test.ts`, kör både `pnpm test` och `pnpm test:live`, verifiera att testerna passerar och pusha ändringarna till GitHub.

## GROW-frågor för risknoder (Contract, State, Resilience)
1. **Contract**: Hur ska `TranslationBridge` och `/api/translation/token` harmoniseras så att token-prefixet (`authTokens/` eller `auth_tokens/`) skalas bort vid URL-bygget till Geminis `v1alpha Constrained`-endpoint utan att störa typ- eller kontraktkrav?
2. **State & Effects**: Vilken effekt har uppdateringen av `uses: 50` och borttagandet av överflödigt `config`-underobjekt i `SKILL.md` samt `routes.ts` på sessioners livslängd och hot-swaps under långa tolkningar?
3. **Resilience & Testing**: Hur utformas det skarpa integrationstestet i `scripts/test-gemini-stream.ts` och enhetstesterna i `translationBridge.test.ts` för att säkerställa 100 % verifiering både i CI/lokala tester och mot Geminis faktiska Live API?
