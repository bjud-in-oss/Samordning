# Steg 2b: Evaluera yttre anpassning (TCK-LT-015)

## Konsekvensanalys för anslutningar
1. **Google Gemini Live API specifikation**:
   - `BidiGenerateContentConstrained` accepterar uteslutande korta, begränsade sessionstokens via `access_token=`. Om en vanlig API-nyckel ("AIza...") skickas dit avvisas anslutningen med autentiseringsfel ("Expected OAuth 2 access token...").
   - Genom att kräva att `isEphemeral` enbart är sann för faktiska ephemeral tokens elimineras felaktig dirigering.
2. **Bakåtkompatibilitet**:
   - Befintliga tester för `authTokens/` och `auth_tokens/` förblir oförändrat giltiga.
   - Testsituationer med testnycklar (t.ex. `"test-key"`) behandlas som icke-ephemeral och ansluter via standard endpoint `?key=test-key`.
