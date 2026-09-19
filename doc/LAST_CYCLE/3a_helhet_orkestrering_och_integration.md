# Steg 3a: Helhet, orkestrering och integration (TCK-LT-012)

## Orkestreringsöversikt
1. **Initiering**:
   - `TranslationBridge` anropas med antingen en hårdkodad sträng eller en asynkron `tokenProvider`.
   - `resolveApiKey()` hämtar färsk nyckel om `tokenProvider` finns.
2. **WebSocket URL-konstruktion**:
   - Om nyckeln börjar på `auth_tokens/`: `v1alpha ... BidiGenerateContentConstrained?access_token=...`
   - Annars: `v1beta ... BidiGenerateContent?key=...`
3. **Session & Hot-Swap**:
   - Vid hot-swap förnyas eventuell token och samma URL-konstruktion tillämpas på `nextWs`.
