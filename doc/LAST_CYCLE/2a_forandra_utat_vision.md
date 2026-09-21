# Steg 2a: Förändra utåt – Vision (TCK-LT-014)

## Vision för officiell Google Agent Skill-harmonisering
1. **Officiella färdigheter integrerade**:
   - `gemini-api-dev` och `gemini-live-api-dev` etablerade under `.agents/skills/` och `doc/skills/` som standard för all Gemini API- och Live API-utveckling.
2. **Total samstämmighet i dokumentation**:
   - `doc/skills/gemini-live-translate/SKILL.md` harmoniserad med den officiella specifikationen för `BidiGenerateContentSetup`, WebSocket-dirigering och ephemeral tokens.
3. **Robust arkitektur och Fail Fast**:
   - Tillämpa standarden i `translationBridge.ts` och skydda med isolerade enhetstester under 250 rader per fil.
