# Steg 1a: Orientera (TCK-LT-014)

## Fokus och mål
Harmonisera arkitektur och process med officiella Google Gemini Agent Skills:
1. Installera de officiella färdigheterna `gemini-api-dev` och `gemini-live-api-dev` under `.agents/skills/` samt `doc/skills/`.
2. Granska och harmonisera `doc/skills/gemini-live-translate/SKILL.md` mot Googles officiella standard (`gemini-live-api-dev`).
3. Validera och förbereda källkodsspecifikationen för `translationBridge.ts` och enhetstester i `translationBridge.test.ts` inför Fas 2 (Steg 4).

## GROW-frågor för risknoder (Contract, State, Resilience)
1. **Contract**: Hur säkerställer vi full överensstämmelse mellan `gemini-live-api-dev`, `gemini-live-translate/SKILL.md` och källkoden i `translationBridge.ts` gällande `BidiGenerateContentSetup`, WebSocket URL:er och autentisering?
2. **State & Effects**: Hur påverkar tillämpningen av `gemini-live-api-dev` anslutningsflödet i `connect()`, återanslutning vid hot-swap och sessionResumption?
3. **Resilience & Testing**: Hur verifieras kontraktet i `translationBridge.test.ts` mot den officiella specifikationen utan att överskrida 250 rader per fil?
