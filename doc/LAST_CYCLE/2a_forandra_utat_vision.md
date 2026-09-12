# Steg 2a: Förändra utåt (Vision för TCK-LIVE-006)

## Vision för Produktionsklar Server-växel (Fas 2)

Visionen är att etablera en robust, högpresterande ljudbrygga i `server.ts` och `src/server/translationServer.ts`:

1. **Dual Ingestion Engine**:
   - Stöd för `AUDIO_SOURCE` (`VMIX` för kyrksalens ljudsystem och `WEBSOCKET` för bärbar mikrofon).
   - Automatisk resamplering 48kHz <-> 16kHz/24kHz via `AudioResampler`.

2. **Effektiv Ljudtransport**:
   - Opus-stöd i transportlagret för minimal bandbreddsanvändning och jämn strömning över 4G/5G.
   - Pacing anpassad till 100–150 ms ringbuffert i klientens AudioWorklet.

3. **Orkestrering och Driftsäkerhet**:
   - Full-duplex WebSocket-server tillgänglig på dedikerad port 8080 samt integrerad på port 3000 (`/ws/translation`).
   - Automatisk 14-minuters hot-swap rotation via `HotSwapManager`.
