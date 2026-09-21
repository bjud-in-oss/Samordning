# Steg 3c: Fil-operativ källkodsspecifikation (TCK-LT-015)

## 1. Mål och omfattning
Korrigering av `isEphemeral`-villkoret i `src/features/live_translation/domain/translationBridge.ts`:
1. I `connect()` och `executeHotSwap()`:
   Ändra logiken för `isEphemeral` så att den ENBART utvärderas till `true` om `this.currentApiKey` faktiskt är en ephemeral token (d.v.s. startar med `/^auth_?tokens\//i`).
2. Om `this.currentApiKey` startar med "AIza" (standard API-nyckel) ska `isEphemeral` ALLTID vara `false`, även om en `tokenProvider` finns angiven.
3. När `isEphemeral` är `false` ska anslutningen ALLTID gå till:
   `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(this.currentApiKey)}`
4. Uppdatera enhetstesterna i `translationBridge.test.ts`, kör pnpm test och pusha ändringarna till GitHub.

---

## 2. Källkodsspecifikation

### A. `src/features/live_translation/domain/translationBridge.ts`
I `connect()` (rad ~72):
```ts
const isEphemeral = !this.currentApiKey.startsWith("AIza") && /^auth_?tokens\//i.test(this.currentApiKey);
const wsUrl = isEphemeral
  ? `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(this.currentApiKey)}`
  : `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(this.currentApiKey)}`;
```

I `executeHotSwap()` (rad ~207):
```ts
const isEphemeral = !this.currentApiKey.startsWith("AIza") && /^auth_?tokens\//i.test(this.currentApiKey);
const wsUrl = isEphemeral
  ? `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(this.currentApiKey)}`
  : `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(this.currentApiKey)}`;
```
Filen förblir på ca 240 rader (< 250 rader).

### B. `src/features/live_translation/domain/__tests__/translationBridge.test.ts`
Lägg till testfall:
```ts
it("dirigerar till standard API-nyckel url även om tokenProvider returnerar en nyckel som börjar med AIza", async () => {
  const tokenProvider = vi.fn(async () => "AIzaSyDynamicKeyFromProvider999");
  const bridge = createBridge(tokenProvider, "es");
  await bridge.connect();
  expect(MockWebSocket.instances.length).toBe(1);
  const ws = MockWebSocket.instances[0]!;
  expect(ws.url).toContain("BidiGenerateContent?key=AIzaSyDynamicKeyFromProvider999");
  expect(ws.url).not.toContain("BidiGenerateContentConstrained");
  expect(ws.url).not.toContain("access_token=");
});
```
Filen hålls under 250 rader.
