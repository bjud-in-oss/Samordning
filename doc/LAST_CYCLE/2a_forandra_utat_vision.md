# Steg 2a: Förändra utåt – Vision (TCK-LT-012)

## Vision för URL- och Endpoint-validering
1. **Exakt URL-val**:
   - WebSocket-anslutningen ska välja rätt endpoint baserat på nyckelns faktiska typ:
     - Börjar på `auth_tokens/`: Efemärt token via `v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=...`
     - Övriga nycklar (inklusive standard API-nycklar som börjar på `AIza...`): Standard v1beta via `v1beta.GenerativeService.BidiGenerateContent?key=...`
2. **Tillämpning vid Hot-Swap**:
   - Logiken i `executeHotSwap()` ska matcha `connect()` till 100%.
3. **Robust felhantering (ADR-018 Fail Fast)**:
   - Tydlig, transparent felrapportering utan stubs i produktionskod.
