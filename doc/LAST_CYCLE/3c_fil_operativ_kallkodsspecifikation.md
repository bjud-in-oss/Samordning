# Steg 3c: Fil-operativ Källkodsspecifikation

## Ändringar i källkod och tester

### 1. `src/features/live_translation/domain/LocalWebSocketAdapter.ts`
Uppdatera `getDefaultWebSocketUrl`:
```typescript
function getDefaultWebSocketUrl(): string {
  if (typeof window !== "undefined" && window.location) {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host || "localhost:3000"}/ws/translation`;
  }
  return "ws://localhost:3000/ws/translation";
}
```

### 2. `src/features/live_translation/hooks/useLiveTranslation.ts`
Lägg till `getInitialTransportMode` och koppla till `useState`:
```typescript
function getInitialTransportMode(): TransportMode {
  const getVal = (): string => {
    if (typeof import.meta !== "undefined" && (import.meta as unknown as { env?: Record<string, string> }).env) {
      const e = (import.meta as unknown as { env: Record<string, string> }).env;
      return e.VITE_AUDIO_SOURCE || e.AUDIO_SOURCE || "";
    }
    if (typeof process !== "undefined" && process.env) {
      return process.env.VITE_AUDIO_SOURCE || process.env.AUDIO_SOURCE || "";
    }
    return "";
  };
  const src = getVal().toUpperCase();
  return src === "WEBSOCKET" || src === "LOCAL_WS" ? "local_ws" : "sfu";
}
```
Och i hooken:
```typescript
const [transportMode, setTransportModeState] = useState<TransportMode>(getInitialTransportMode);
```

### 3. `src/features/live_translation/domain/__tests__/localWebSocketAdapter.test.ts`
Uppdatera förväntad WebSocket-URL från `/api/ws/audio` till `/ws/translation`:
```typescript
expect((defaultHttpsAdapter as unknown as { serverUrl: string }).serverUrl).toBe(
  "wss://church-stream.local:3000/ws/translation"
);
// och
expect((defaultHttpAdapter as unknown as { serverUrl: string }).serverUrl).toBe(
  "ws://192.168.1.100:8080/ws/translation"
);
```

### 4. `src/features/live_translation/hooks/__tests__/useLiveTranslation.test.ts`
Lägg till test för miljövariabelinitiering av `transportMode`:
```typescript
it("initieras med transportMode 'local_ws' om VITE_AUDIO_SOURCE är 'WEBSOCKET'", () => {
  const originalEnv = process.env.VITE_AUDIO_SOURCE;
  process.env.VITE_AUDIO_SOURCE = "WEBSOCKET";
  try {
    const { result } = renderHook(() => useLiveTranslation());
    expect(result.current.transportMode).toBe("local_ws");
  } finally {
    process.env.VITE_AUDIO_SOURCE = originalEnv;
  }
});
```
