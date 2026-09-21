# Steg 4: Producera (TCK-LT-016)

## Genomförda förändringar
1. **Uppdatering av SKILL.md (`doc/skills/gemini-live-translate/SKILL.md`)**:
   - I Sektion 7: Ändrade `uses: 1` till `uses: 50` för att spegla behovet av återanslutningar och hot-swaps under långa tolkningar utan onödig token-förbrukning.
   - Tog bort överflödigt `config`-underobjekt inuti `liveConnectConstraints` så att det matchar det officiella SDK-formatet (`liveConnectConstraints: { model: "models/gemini-3.5-live-translate-preview" }`).

2. **Server-rutt `/api/translation/token` (`src/server/routes.ts`)**:
   - Skapar tokens med `uses: 50` och låst begränsning till `models/gemini-3.5-live-translate-preview`.
   - Returnerar både fullständigt resursnamn (`token`, `name`) och rent token-id (`tokenId`, `cleanToken`).

3. **Klient (`src/features/live_translation/domain/translationBridge.ts`)**:
   - I `connect()` och `executeHotSwap()` skalas prefixet av via `currentApiKey.replace(/^auth_?tokens\//i, "")` så att enbart det rena token-id:t skickas i query-parametern `access_token=${encodeURIComponent(cleanToken)}`.
   - Källkodsfilen omfattar 242 rader (< 250 rader).

4. **Skarpt integrationstest (`scripts/test-gemini-stream.ts` & `package.json`)**:
   - Implementerade skarp testsekvens som hämtar `GEMINI_API_KEY`, skapar en ephemeral token med `liveConnectConstraints`, öppnar WebSocket mot Gemini Live API (`BidiGenerateContentConstrained`), skickar setup-meddelande och verifierar `setupComplete`.
   - Lade till `"test:live": "tsx scripts/test-gemini-stream.ts"` under `"scripts"` i `package.json`.

5. **Enhetstester (`src/features/live_translation/domain/__tests__/translationBridge.test.ts`)**:
   - Uppdaterade testerna så att de verifierar att `access_token=` innehåller det rena token-id:t utan prefix.
   - Samtliga 16 enhetstester passerar. Testfilen omfattar 249 rader (< 250 rader).
