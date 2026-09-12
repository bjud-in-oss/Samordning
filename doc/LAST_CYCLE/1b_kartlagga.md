# Steg 1b: Kartlägga (TCK-LIVE-006: Dual Audio Ingestion, Opus och Resiliens i server.ts och translationServer.ts)

## Svar på GROW-frågor mot kodbasens arkitektur

1. **State (Dual Audio Ingestion)**:
   - `AUDIO_SOURCE` definieras i miljökonfigurationen med två lägen: `VMIX` (primär ingång för kapelljud via virtuellt ljudkort/ljudström 48kHz PCM mono) och `WEBSOCKET` (mikrofonström över WSS från mobil/PWA).
   - Vid `AUDIO_SOURCE=VMIX` tar ingestion-modulen emot 48kHz Float32/Int16 och skickar genom `AudioResampler.downsample48kTo16k` för 16kHz Gemini ingest och `AudioResampler.upsample24kTo48k` för 48kHz uppspelningskanaler.
   - Vid `AUDIO_SOURCE=WEBSOCKET` tar servern emot binära Opus/PCM-paket direkt från anslutna talarklienter.

2. **Contract (Opus-komprimering & Buffert)**:
   - Servern tillhandahåller Opus-kodning/avkodning via ett modulärt lager som kapslar paket i 20ms-ramar (480 samplar vid 24kHz / 320 samplar vid 16kHz).
   - För klienter med `AudioProcessor.worklet.ts` garanteras 100–150 ms målbuffertstorlek genom jämn paketpacing (20ms frames) och tidsstämplar i metadata, vilket eliminerar jitter och hackigt mobilnätljud.

3. **Resilience (Hot-Swap & Full-Duplex orkestrering)**:
   - Full-duplex WebSocket-servern i `translationServer.ts` utökas med stöd för att lyssna på port 8080 parallellt med Express HTTP upgrade på port 3000 (`/ws/translation`).
   - `TranslationBridge` och `HotSwapManager` integreras i servermiljön: efter 14 minuter triggas `executeHotSwap` som upprättar en parallell standby-session med Gemini Live och överför resumption-handtag utan tystnad eller avbruten ljuduppspelning.

```json
{
  "status": "IN_PROGRESS",
  "current_domain": "live_translation",
  "next_step": "2a_forandra_utat_vision",
  "ticket_id": "TCK-LIVE-006",
  "active_skill": "wayfinder",
  "active_vectors": ["Resilience"]
}
```
