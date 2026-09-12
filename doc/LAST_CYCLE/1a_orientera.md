# Steg 1a: Orientera (TCK-LIVE-006: Dual Audio Ingestion, Opus och Resiliens i server.ts och translationServer.ts)

## Mål
Implementera Fas 2 enligt ROADMAP.md och INDEX.md:
1. Dual Audio Ingestion med `AUDIO_SOURCE` i `.env` (`VMIX` 48kHz till `audioResampler.ts` kontra `WEBSOCKET` från mobil/PWA).
2. Komprimering & Buffring: Opus-avkodning/kodning i server.ts/translationServer.ts som ersätter rå PCM och matchar klientens adaptiva ringbuffert (100–150 ms) i `AudioProcessor.worklet.ts`.
3. Resilience & Brygga: Anslutning till `translationBridge.ts`, integration med `hotSwapManager.ts` för 14-minuters proaktiv rotation och orkestrering av full-duplex WebSocket-server på port 8080 och 3000.

## Sokratiska GROW-frågor ställda mot ändringens risknoder (State, Contract, Resilience)

1. **State (Dual Audio Ingestion)**: Hur struktureras ljudingestionsmotorn i `translationServer.ts` så att `AUDIO_SOURCE=VMIX` (48kHz linjärt PCM via virtuellt ljudkort som resamplas till 16kHz/24kHz) och `AUDIO_SOURCE=WEBSOCKET` (mikrofonström från PWA) hanteras sömlöst utan tillståndskonflikter?
2. **Contract (Opus-komprimering & Buffert)**: Hur kodas och avkodas Opus-strömmar över WebSocket så att latensen hålls under 150 ms och är direkt kompatibel med klientens `AudioProcessor.worklet.ts` utan att bryta befintliga testsviter?
3. **Resilience (Hot-Swap & Full-Duplex orkestrering)**: Hur orkestreras full-duplex WebSocket-servern på port 8080 (och upgrade på port 3000) med `HotSwapManager` för att rotera Gemini Live-sessionen efter 14 minuter utan avbrott i ljudströmmen?

```json
{
  "status": "IN_PROGRESS",
  "current_domain": "live_translation",
  "next_step": "1b_kartlagga",
  "ticket_id": "TCK-LIVE-006",
  "active_skill": "wayfinder"
}
```
