# Steg 3b: Domän, kontrakt och fraktal dokumentation (TCK-LT-016)

## Kontrakt och datastrukturer

### 1. `/api/translation/token` JSON Response
```typescript
interface EphemeralTokenResponse {
  token: string;      // Fullständigt resursnamn (t.ex. "auth_tokens/xyz")
  tokenId: string;    // Rent token-id (t.ex. "xyz")
  name: string;       // Fullständigt resursnamn
  cleanToken: string; // Rent token-id
  expireTime?: string;
  model: "models/gemini-3.5-live-translate-preview";
}
```

### 2. URL-kontrakt för `TranslationBridge`
- **Om `isEphemeral === true`**:
  ```
  wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(cleanToken)}
  ```
  där `cleanToken = currentApiKey.replace(/^auth_?tokens\//i, "")`.
- **Om `isEphemeral === false`**:
  ```
  wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(currentApiKey)}
  ```
