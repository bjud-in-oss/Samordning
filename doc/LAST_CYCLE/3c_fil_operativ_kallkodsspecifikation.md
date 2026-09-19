# Steg 3c: Fil-operativ källkodsspecifikation (TCK-LT-012)

## 1. Mål och omfattning
Korrigera URL-valet för WebSocket i `src/features/live_translation/domain/translationBridge.ts`:
1. I `connect()` och `executeHotSwap()`: Ändra `isEphemeral` så att det enbart returnerar `true` om `this.currentApiKey.startsWith("auth_tokens/")`.
2. Om nyckeln är en vanlig API-nyckel (som börjar på "AIza...") ska anslutningen alltid använda:
   `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=...`
3. Uppdatera enhetstesterna i `src/features/live_translation/domain/__tests__/translationBridge.test.ts`.

---

## 2. Källkodsspecifikation

### A. `src/features/live_translation/domain/translationBridge.ts`
1. I `connect()` (rad ~72):
   ```ts
   // Före:
   const isEphemeral = Boolean(this.tokenProvider || this.currentApiKey.startsWith("auth_tokens/"));
   // Efter:
   const isEphemeral = this.currentApiKey.startsWith("auth_tokens/");
   ```
2. I `executeHotSwap()` (rad ~206):
   ```ts
   // Före:
   const isEphemeral = Boolean(this.tokenProvider || this.currentApiKey.startsWith("auth_tokens/"));
   // Efter:
   const isEphemeral = this.currentApiKey.startsWith("auth_tokens/");
   ```

### B. `src/features/live_translation/domain/__tests__/translationBridge.test.ts`
1. I testet "skickar transkriberingskonfiguration på reella anslutningar" (~rad 186):
   Lägg till kontroll av WebSocket-URL:
   ```ts
   expect(ws.url).toContain("BidiGenerateContent?key=AIzaSyTestRealKey123");
   expect(ws.url).not.toContain("BidiGenerateContentConstrained");
   expect(ws.url).not.toContain("access_token=");
   ```
2. I testet (~rad 222):
   Uppdatera testet till att verifiera att en `tokenProvider` som returnerar en vanlig API-nyckel dirigerar till `?key=`:
   ```ts
   it("använder ?key= när tokenProvider returnerar en standard API-nyckel och inte auth_tokens/", async () => {
     const tokenProvider = vi.fn(async () => "AIzaSyCustomTokenFromProvider");
     const bridge = createBridge(tokenProvider, "de");
     await bridge.connect();
     expect(tokenProvider).toHaveBeenCalledTimes(1);
     const ws = MockWebSocket.instances[MockWebSocket.instances.length - 1]!;
     expect(ws.url).toContain("BidiGenerateContent?key=AIzaSyCustomTokenFromProvider");
     expect(ws.url).not.toContain("BidiGenerateContentConstrained");
     expect(ws.url).not.toContain("access_token=");
   });
   ```
   Håll testfilens radantal strikt under 250 rader.
