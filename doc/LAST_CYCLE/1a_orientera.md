# Steg 1a: Orientera (TCK-LT-012)

## Ärendebeskrivning
Korrigera URL-valet för WebSocket i `src/features/live_translation/domain/translationBridge.ts`:
1. I `connect()` och `executeHotSwap()`: Ändra `isEphemeral` så att det enbart returnerar `true` om `this.currentApiKey.startsWith("auth_tokens/")`.
2. Om nyckeln är en vanlig API-nyckel (som börjar på "AIza..." eller inte är ett ephemeral auth_token) ska anslutningen alltid använda:
   `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=...`
3. Uppdatera enhetstesterna i `translationBridge.test.ts` i enlighet med ADR-018 (Fail Fast & Isolerade tester).
4. Kör `pnpm test`, verifiera att alla tester passerar och synkronisera ändringarna till GitHub vid cykelavslut.

## GROW-frågor
1. **Contract**: Hur skiljer sig URL-kontraktet mellan efemära sessionstokens (`auth_tokens/`) och vanliga Gemini API-nycklar (`AIza...`), och varför orsakade det tidigare villkoret felaktig dirigering till `BidiGenerateContentConstrained`?
2. **Effects**: Vilka enhetstester i `translationBridge.test.ts` kontrollerar konstruktionen av `wsUrl` och hur ska de uppdateras för att explicit verifiera att API-nycklar dirigeras till standard BidiGenerateContent-endpointen med `?key=`?
3. **Resilience & Fail Fast**: Hur säkerställer vi att anslutningen fallerar snabbt och tydligt med begripliga felmeddelanden i diagnostikgränssnittet vid ogiltiga eller saknade nycklar, utan tysta fallback-fel?
