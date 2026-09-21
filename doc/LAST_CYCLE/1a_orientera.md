# Steg 1a: Orientera (TCK-LT-015)

## Fokus och mål
Korrigera `isEphemeral`-villkoret i `src/features/live_translation/domain/translationBridge.ts`:
1. I `connect()` och `executeHotSwap()`: Ändra logiken för `isEphemeral` så att den ENBART utvärderas till `true` om `this.currentApiKey` faktiskt är en ephemeral token (d.v.s. startar med `/^auth_?tokens\//i`).
2. Om `this.currentApiKey` startar med "AIza" (standard API-nyckel) ska `isEphemeral` ALLTID vara `false`, även om en `tokenProvider` finns angiven.
3. När `isEphemeral` är `false` ska anslutningen ALLTID gå till:
   `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(this.currentApiKey)}`
4. Uppdatera enhetstesterna i `translationBridge.test.ts` och bibehåll radantalet under 250 rader per fil.

## GROW-frågor för risknoder (Contract, State, Resilience)
1. **Contract**: Hur ska `isEphemeral` definieras i `connect()` och `executeHotSwap()` så att den enbart returnerar `true` för autentiska efemära tokens (`/^auth_?tokens\//i`) och garanterat `false` för standard API-nycklar som börjar med "AIza"?
2. **State & Effects**: Vad blir effekten på anslutnings-URL:en när `isEphemeral` är `false`, särskilt om en `tokenProvider` tillhandahåller en API-nyckel som börjar med "AIza"?
3. **Resilience & Testing**: Hur uppdaterar och utökar vi enhetstesterna i `translationBridge.test.ts` för att garantera att `AIza`-nycklar aldrig dirigeras till `v1alpha Constrained`, samtidigt som radantalet hålls under 250 rader enligt ADR-018?
