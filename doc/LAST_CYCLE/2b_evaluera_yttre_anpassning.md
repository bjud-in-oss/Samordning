# Steg 2b: Evaluera yttre anpassning (TCK-LT-014)

## Konsekvensanalys
1. **Google Gemini Live API specifikation**:
   - `BidiGenerateContentSetup` kräver att transkriptionskonfigurationer (`inputAudioTranscription`, `outputAudioTranscription`) ligger direkt på rotnivån av `setup`, inte nästlade inuti `generationConfig`.
   - Ephemeral tokens skapade med `ai.authTokens.create(...)` har formatet `authTokens/<id>` och kräver anslutning till `v1alpha ... BidiGenerateContentConstrained?access_token=...`.
2. **Bakåtkompatibilitet och samverkan**:
   - Den uppdaterade dokumentationen och källkoden stödjer både statiska API-nycklar (`AIza...`) och efemära tokens (`authTokens/` och `auth_tokens/`).
   - Inga externa beroenden bryts; stabiliteten i realtidstolkningen säkras fullt ut.
