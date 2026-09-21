# Steg 3a: Helhet, orkestrering och integration (TCK-LT-015)

## Orkestreringsöversikt
1. **Live Translation Gateway Integration**:
   - `TranslationBridge` instansieras antingen med en statisk nyckel (t.ex. konfigurerad `AIza...`) eller en dynamisk asynkron `tokenProvider`.
   - `connect()` anropar `resolveApiKey()` om `tokenProvider` finns.
   - När `this.currentApiKey` är satt, utvärderas `isEphemeral`:
     - Om `authTokens/...` eller `auth_tokens/...`: anslut mot `v1alpha ... BidiGenerateContentConstrained?access_token=...`.
     - Annars (inklusive `"AIza..."`): anslut mot `v1beta ... BidiGenerateContent?key=...`.
2. **Hot Swap och återanslutning**:
   - `executeHotSwap()` tillämpar exakt samma logik för att förhindra felaktig endpoint vid sessionrotering.
