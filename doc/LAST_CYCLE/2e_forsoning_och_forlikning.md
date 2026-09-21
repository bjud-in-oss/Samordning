# Steg 2e: Försoning och förlikning (TCK-LT-014)

## Målharmonisering
1. **Färdigheter installerade och harmoniserade**:
   - `gemini-api-dev` och `gemini-live-api-dev` finns under `.agents/skills/` och `doc/skills/`.
   - `doc/skills/gemini-live-translate/SKILL.md` har uppdaterats för att korrigera `setup`-strukturen och WebSocket-URL:er för ephemeral tokens.
2. **Källkod och tester (`src/features/live_translation/`)**:
   - `translationBridge.ts` bekräftas följa `gemini-live-api-dev`:
     - Skiftlägesoberoende `isEphemeral` i `connect()` och `executeHotSwap()`.
     - `setup`-payloaden har `model`, `generationConfig`, `inputAudioTranscription: {}` och `outputAudioTranscription: {}` på rotnivå.
     - Filstorleken hålls strikt under 250 rader.
   - `translationBridge.test.ts`:
     - Verifierar setup-payloadens struktur och ephemeral token-dirigering.
     - Hålls strikt under 250 rader.

MÄTTNAD: JA
