# Steg 2b: Evaluera yttre anpassning (TCK-LIVE-006)

## Granskning mot befintlig arkitektur och beroenden

1. **Kompatibilitet med FSD och live_translation**:
   - `AudioResampler` i `src/features/live_translation/domain/audioResampler.ts` används för linjär interpolation och filtrering mellan 48kHz, 24kHz och 16kHz.
   - `TranslationBridge` och `HotSwapManager` ger tillförlitlig session resumption utan att bryta befintliga klienter.

2. **Server-arkitektur i Cloud Run**:
   - Port 3000 hanterar Express och HTTP-uppgradering till WebSocket (`/ws/translation`).
   - För lokal testning och PoC-miljö kan port 8080 startas som en dedikerad full-duplex WebSocket-server när `WS_PORT=8080` eller under PoC/E2E-körning.

3. **Buffert & Klientkompatibilitet**:
   - Paketstorleken struktureras till 20 ms ramar med jämn sändningsintervall vilket perfekt matchar `AudioProcessor.worklet.ts` och dess adaptiva slew rate.
