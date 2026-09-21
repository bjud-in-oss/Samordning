# Steg 3c: Fil-operativ källkodsspecifikation (TCK-LT-014)

## 1. Mål och omfattning
Harmonisering av Google Gemini Agent Skills och verifiering mot `TranslationBridge`:
1. Officiella instruktioner för `gemini-api-dev` och `gemini-live-api-dev` installerade under `.agents/skills/` samt `doc/skills/`.
2. Befintlig `doc/skills/gemini-live-translate/SKILL.md` har uppdaterats och harmoniserats:
   - `inputAudioTranscription` och `outputAudioTranscription` definieras som direkta barn under `setup` (ej inuti `generationConfig`).
   - Ephemeral token WebSocket-URL specificeras till `v1alpha ... BidiGenerateContentConstrained?access_token=...`.
3. Verifiera att `src/features/live_translation/domain/translationBridge.ts` och `translationBridge.test.ts` överensstämmer med denna officiella standard och håller sig under 250 rader.

---

## 2. Källkodsspecifikation

### A. `src/features/live_translation/domain/translationBridge.ts`
- I `connect()` och `executeHotSwap()`:
  ```ts
  const isEphemeral = Boolean(this.tokenProvider || /^auth_?tokens\//i.test(this.currentApiKey) || (!this.currentApiKey.startsWith("AIza") && this.currentApiKey !== "demo_key"));
  const wsUrl = isEphemeral
    ? `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(this.currentApiKey)}`
    : `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(this.currentApiKey)}`;
  ```
- I `setupSocketHandlers()`:
  ```ts
  const setup: Record<string, unknown> = {
    model: "models/gemini-3.5-live-translate-preview",
    generationConfig: {
      responseModalities: ["AUDIO"],
      translationConfig: { targetLanguageCode: this.targetLanguage, echoTargetLanguage: false },
    },
    inputAudioTranscription: {},
    outputAudioTranscription: {},
  };
  if (handle) setup.sessionResumption = { handle };
  socket.send(JSON.stringify({ setup }));
  ```
- Filen bibehålls på 241 rader (< 250).

### B. `src/features/live_translation/domain/__tests__/translationBridge.test.ts`
- Validerar den officiella setup-strukturen:
  - `model` = `"models/gemini-3.5-live-translate-preview"`
  - `generationConfig` har `responseModalities` och `translationConfig`
  - `inputAudioTranscription` och `outputAudioTranscription` som direkta egenskaper i `setup`
  - `isEphemeral` testas för både `authTokens/` och `auth_tokens/` samt statiska `AIza...`-nycklar
- Filen bibehålls på 246 rader (< 250).
