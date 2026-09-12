# Steg 3a: Helhet, orkestrering och integration (TCK-LIVE-006)

## Systemövergripande samordning

1. **Miljökonfiguration (`.env` & `.env.example`)**:
   - `AUDIO_SOURCE`: `VMIX` | `WEBSOCKET` (standard `WEBSOCKET`).
   - `WS_PORT`: Dedikerad WebSocket-port (t.ex. `8080`).

2. **Server-integration (`server.ts`)**:
   - Startar HTTP/Express-server på port 3000.
   - Startar eller kopplar `setupTranslationWebSocket` med stöd för dual audio ingestion och port 8080 när konfigurerat.

3. **Strömningsbrygga (`src/server/translationServer.ts`)**:
   - Sköter anslutningar, audio-ingestion (VMIX/WebSocket), Opus-avkodning/kodning samt integration med `TranslationBridge` och `HotSwapManager`.
