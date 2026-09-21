# Steg 2a: Förändra utåt – Vision (TCK-LT-015)

## Vision för robust API-nyckel och Ephemeral Token dirigering
1. **Kristallklar auktoriseringsdirigering**:
   - Skilj med absolut precision mellan standard API-nycklar (`AIza...`) och efemära tokens (`authTokens/...`, `auth_tokens/...`).
   - Standard API-nycklar dirigeras odelat till standard Live API v1beta med `?key=`.
   - Efemära tokens dirigeras till v1alpha `BidiGenerateContentConstrained` med `?access_token=`.
2. **Robusthet i hybridmiljöer**:
   - Även om applikationen använder en dynamisk nyckelleverantör (`tokenProvider`) som returnerar en standardnyckel ("AIza..."), dirigeras anslutningen till rätt Google API-gateway.
3. **Resiliens och Fail Fast**:
   - 100 % täckning i enhetstester och strikt efterlevnad av ADR-018 (< 250 rader per fil).
