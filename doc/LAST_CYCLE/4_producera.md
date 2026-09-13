# Steg 4: Producera (TCK-LIVE-008)

## Utförda ändringar

1. **Enhetstester**:
   - `src/features/live_translation/domain/__tests__/localWebSocketAdapter.test.ts`: Uppdaterat förväntad standard-URL till `/ws/translation`.
   - `src/features/live_translation/hooks/__tests__/useLiveTranslation.test.ts`: Tillagt testfall för dynamisk initiering av `transportMode` via `VITE_AUDIO_SOURCE="WEBSOCKET"`.

2. **Källkodsändringar**:
   - `src/features/live_translation/domain/LocalWebSocketAdapter.ts`: Ändrat standard-URL i `getDefaultWebSocketUrl()` till `/ws/translation`.
   - `src/features/live_translation/hooks/useLiveTranslation.ts`: Implementerat `getInitialTransportMode()` för att läsa `VITE_AUDIO_SOURCE` / `AUDIO_SOURCE` och förvälja `"local_ws"` vid värden som `"WEBSOCKET"` eller `"local_ws"`.
