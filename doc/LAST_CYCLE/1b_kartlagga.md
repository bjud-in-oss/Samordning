# Steg 1b: Kartlägga (TCK-LIVE-008)

## Analys och svar på GROW-frågor

### 1. State: Dynamisk initiering av transportMode
- En hjälpfunktion `getInitialTransportMode(): TransportMode` implementeras.
- Den läser från `import.meta.env` (`VITE_AUDIO_SOURCE` / `AUDIO_SOURCE`) eller `process.env`.
- Om värdet matchar `"WEBSOCKET"` eller `"LOCAL_WS"` (case-insensitive) returneras `"local_ws"`, annars faller det tillbaka på `"sfu"`.
- Denna funktion anropas som lazy initializer i `useState<TransportMode>(getInitialTransportMode)` vilket garanterar att utvärderingen endast sker en gång vid montering.

### 2. Contract: Korrekt WebSocket-ändpunkt
- I `src/features/live_translation/domain/LocalWebSocketAdapter.ts` uppdateras `getDefaultWebSocketUrl`:
  - Ersätt `/api/ws/audio` med `/ws/translation`.
  - Protokollväxling (`https:` -> `wss:`, `http:` -> `ws:`) behålls intakt.
  - Porten och värden härleds från `window.location.host` (vilket stöder både localhost, trycloudflare.com-tunnlar och produktions-URL:er).

### 3. Effects & Resilience: Bakåtkompatibilitet och teststabilitet
- Befintliga tester i `localWebSocketAdapter.test.ts` uppdateras till att förvänta sig `/ws/translation`.
- Nya tester läggs till i `useLiveTranslation.test.ts` för att verifiera initiering via `VITE_AUDIO_SOURCE="WEBSOCKET"`.
- När ingen miljövariabel finns bibehålls standardläget `"sfu"`.

```json
{
  "status": "IN_PROGRESS",
  "current_domain": "live_translation",
  "next_step": "2a",
  "ticket_id": "TCK-LIVE-008",
  "active_skill": "pwa-integration",
  "active_vectors": ["State"]
}
```
