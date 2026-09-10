# Steg 3a: Helhet, orkestrering och integration (TCK-016)

## Systemövergripande orkestrering

1. **Klientintegration (`src/features/live_translation/`)**:
   - `LiveTranslationWidget` exponerar en ren och responsiv vy för realtidsöversättning.
   - Kroken `useLiveTranslation` orkestrerar transport, mikrofonströmning och ljuduppspelning.
2. **Kör- och transportresiliens**:
   - WebRTC via Cloudflare SFU som primär transportkanal.
   - Automatisk fallback till lokal WebSocket (`/ws/translation`).
