# Steg 1b: Kartlägga (TCK-LT-014)

## Svar på GROW-frågor

1. **Contract**:
   *Svar*: De officiella Google-specifikationerna för Gemini Live API (`gemini-live-api-dev`) föreskriver följande kontrakt:
   - **BidiGenerateContentSetup**: `model` (`models/gemini-3.5-live-translate-preview`), `generationConfig` (innehållande `responseModalities: ["AUDIO"]` och `translationConfig: { targetLanguageCode, echoTargetLanguage }`), samt `inputAudioTranscription: {}` och `outputAudioTranscription: {}` placerade direkt under roten i `setup` (inte inuti `generationConfig`).
   - **WebSocket-endpoints**:
     - Ephemeral tokens: `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token={token}`
     - Standard API-nyckel: `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key={API_KEY}`
   - Ephemeral token-detektering: Skiftlägesoberoende matchning (`/^auth_?tokens\//i`) samt nycklar som inte börjar med `AIza`.

2. **State & Effects**:
   *Svar*: I `translationBridge.ts` garanteras identiska regler i både `connect()` och `executeHotSwap()`. Vid hot-swap förnyas tokenet via `tokenProvider()` och `executeHotSwap()` etablerar `nextWs` med samma säkra URL-konstruktion och överför aktiv session via `sessionResumption.handle`.

3. **Resilience & Testing**:
   *Svar*: Enhetstesterna i `translationBridge.test.ts` validerar:
   - Att `setup`-meddelandet innehåller `model`, `generationConfig`, `inputAudioTranscription` och `outputAudioTranscription` på rätt hierarkisk nivå.
   - Att `isEphemeral` dirigerar efemära tokens (`authTokens/` och `auth_tokens/`) till v1alpha constrained endpoint och statiska nycklar (`AIza...`) till v1beta.
   - Att radantalet strikt underskrider 250 rader per fil i enlighet med ADR-018.

```json
{
  "status": "In Progress",
  "current_domain": "live_translation",
  "next_step": "2a",
  "ticket_id": "TCK-LT-014",
  "active_skill": "gemini-api",
  "active_vectors": ["Contract"]
}
```
