# Steg 1a: Orientera (TCK-LIVE-008)

## Domän och Mål
- **Domän**: `live_translation`
- **Ticket**: TCK-LIVE-008 - Transportläges- och WebSocket-konfiguration för direktöversättning
- **Syfte**: Anpassa `LocalWebSocketAdapter` och `useLiveTranslation` för att använda serverns korrekta WebSocket-sökväg (`/ws/translation`) och dynamiskt initiera transportläge baserat på miljövariabeln `VITE_AUDIO_SOURCE` / `AUDIO_SOURCE`.

## GROW-frågor (Risknoder: State, Contract, Effects/Resilience)
1. **Goal & State**: Hur ska `useLiveTranslation` extrahera och utvärdera `VITE_AUDIO_SOURCE` / `AUDIO_SOURCE` så att `transportMode` initieras till `"local_ws"` utan att orsaka onödiga omrenderingar eller instabilitet i livscykeln?
2. **Reality & Contract**: Vilken URL-struktur förväntar sig klient och server, och hur säkerställer vi att standard-URL:en i `LocalWebSocketAdapter.getDefaultWebSocketUrl()` konsekvent pekar mot `/ws/translation` oavsett om protokollväxling sker för `ws://` eller `wss://`?
3. **Options/Will & Effects**: Hur påverkar ändringen befintliga tester och gränssnittskomponenter (`LiveTranslationWidget`), och hur säkerställs bakåtkompatibilitet när miljövariabeln inte är satt (fortsatt standard `"sfu"`)?
