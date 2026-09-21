# Steg 2a: Förändra utåt – Vision (TCK-LT-016)

## Vision för synkroniserade Ephemeral Tokens och skarpa integrationstester
1. **Full överensstämmelse mellan specifikation och kod**:
   - `SKILL.md` speglar exakt verkligheten: `uses: 50` och rent `liveConnectConstraints`-objekt.
   - Serverns route `/api/translation/token` producerar konforma tokens med begränsningar för översättningsmodellen och exponerar både resursnamn och ren identifierare.
2. **Korrekt access token URL-formatering**:
   - Google Generative Language API kräver det rena token-id:t (utan resursvägen `authTokens/` eller `auth_tokens/`) i URL-parametern `access_token=`.
   - `TranslationBridge` skalar av prefixet vid anslutning och hot-swap.
3. **Verifierbarhet och skarp testbarhet**:
   - `test:live` erbjuder ett deterministiskt och direkt sätt att verifiera anslutningen mot Geminis produktions-API utan manuella handpåläggningar.
