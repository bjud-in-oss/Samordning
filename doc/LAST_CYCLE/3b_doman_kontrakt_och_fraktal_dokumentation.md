# Steg 3b: Domän, kontrakt och fraktal dokumentation (TCK-LT-014)

## Kontraktspecifikation för Live Translation Endpoints och Setup

### 1. BidiGenerateContentSetup-meddelande
```json
{
  "setup": {
    "model": "models/gemini-3.5-live-translate-preview",
    "generationConfig": {
      "responseModalities": ["AUDIO"],
      "translationConfig": {
        "targetLanguageCode": "sv",
        "echoTargetLanguage": false
      }
    },
    "inputAudioTranscription": {},
    "outputAudioTranscription": {},
    "sessionResumption": {
      "handle": "..."
    }
  }
}
```

### 2. WebSocket Endpoints
- **Ephemeral Token**: `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token={token}`
- **Statisk API-nyckel**: `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key={API_KEY}`
