# Steg 3a: Helhet, Orkestrering och Integration (TCK-LIVE-009)

## Systemplacering och Domänflöde

```
[Mobil Webbläsare / Lyssnare]
           │
           ▼
[LiveTranslationListenerWidget.tsx] ───(initAudio, playAudioChunk)──► [useAudioPlayer.ts] (24kHz Web Audio)
           │
      (WebSocket)
           │
           ▼
[/ws/translation (Express Server / translationServer.ts)]
```

### Integrationspunkter
1. **Domänexport**: `src/features/live_translation/index.ts` exporterar `LiveTranslationListenerWidget`.
2. **Koppling mot server**: WebSocket-anslutning mot `window.location.host + '/ws/translation'`.
3. **Ljudmotor**: `useAudioPlayer` hanterar jitterbuffert och 24kHz PCM-avkodning utan klientbelastning.
