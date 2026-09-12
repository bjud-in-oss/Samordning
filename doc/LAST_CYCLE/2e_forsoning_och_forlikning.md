# Steg 2e: Försoning och förlikning (TCK-LIVE-006)

## Syntes och harmonisering

Målkonflikter mellan realtidskrav och tillförlitlighet har lösts:
- `AUDIO_SOURCE` stödjer både `VMIX` (virtuellt ljudkort på kapelldatorn via 48kHz PCM + `AudioResampler`) och `WEBSOCKET` (mobilklienter).
- Opus-transporten integreras med 20ms paketramar som matchar klientens ringbuffert på 100–150 ms utan jitter.
- WebSocket-servern erbjuder full-duplex på port 8080 samt port 3000 (`/ws/translation`), integrerad med `TranslationBridge` och `HotSwapManager` för 14-minuters rotation.

**MÄTTNAD: JA**
