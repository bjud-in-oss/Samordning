# Steg 2e: Försoning och förlikning (TCK-LT-016)

## Målharmonisering
1. **SKILL.md**:
   - I Sektion 7: Ersätt `uses: 1` med `uses: 50`.
   - Korrigera kodexemplet så att `liveConnectConstraints` endast innehåller `{ model: "models/gemini-3.5-live-translate-preview" }` utan överflödigt `config`-underobjekt.
2. **Server `src/server/routes.ts`**:
   - Säkerställ `ai.authTokens.create` med `uses: 50`, `expireTime` och `liveConnectConstraints: { model: "models/gemini-3.5-live-translate-preview" }`.
   - Returnera `{ token: tokenObj.name, name: tokenObj.name, tokenId: cleanToken, cleanToken, expireTime, model }`.
3. **Klient `src/features/live_translation/domain/translationBridge.ts`**:
   - Skala av prefixet via `const cleanToken = this.currentApiKey.replace(/^auth_?tokens\//i, "");` vid bygge av `wsUrl` i både `connect()` och `executeHotSwap()`.
   - Håll radantalet strikt under 250 rader.
4. **Integrationstest `scripts/test-gemini-stream.ts`**:
   - Implementera skarp testsekvens: Skapa ephemeral token -> Anslut WebSocket till `BidiGenerateContentConstrained` -> Skicka `setup` -> Bekräfta `setupComplete` -> Avsluta rent med kod 0.
5. **Kommando `package.json`**:
   - Lägg till `"test:live": "tsx scripts/test-gemini-stream.ts"` under `"scripts"`.

MÄTTNAD: JA
