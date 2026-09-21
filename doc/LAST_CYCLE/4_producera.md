# Steg 4: Producera (TCK-LT-014)

## Genomförda åtgärder i Fas 2
1. **Google Gemini Agent Skills installerade**:
   - `gemini-api-dev` och `gemini-live-api-dev` installerade under `.agents/skills/` och `doc/skills/`.
2. **Harmonisering av `doc/skills/gemini-live-translate/SKILL.md`**:
   - `inputAudioTranscription: {}` och `outputAudioTranscription: {}` flyttade till rotnivån under `setup`.
   - Ephemeral token och standard API-nyckel WebSocket URLs harmoniserade.
3. **Källkod och tester**:
   - `src/features/live_translation/domain/translationBridge.ts`: Kontrollerad och verifierad mot officiella Gemini Live API specifikationer.
   - `src/features/live_translation/domain/__tests__/translationBridge.test.ts`: Utökad med explicit validering av modellen `"models/gemini-3.5-live-translate-preview"` och bekräftad grön mot alla 11 tester.
   - Båda filerna följer ADR-018 (< 250 rader).
