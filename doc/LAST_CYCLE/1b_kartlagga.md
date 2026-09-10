# Steg 1b: Kartlägga (TCK-016: Integrera realtidsöversättning och Gemini Live-server)

## Svar på GROW-frågor mot kodbasen

1. **Contract (Fasad & Exporter)**:
   - `src/features/live_translation/index.ts` exporterar uteslutande namngivna komponenter (`LiveTranslationWidget`), krokar (`useLiveTranslation`, `useAudioPlayer`, `useCloudflareSFU`, `useLocalWebSocket`), domänadaptrar (`AudioResampler`, `TranslationBridge`, `LocalWebSocketAdapter`, `CloudflareSFUAdapter`, `HotSwapManager`, `MultiBridgeOrchestrator`), typer och Zod-scheman.
   - Inga `export *`-satser används.

2. **Contract (Zod-validering)**:
   - `src/features/live_translation/domain/schema.ts` definierar och exporterar:
     - `SupportedLanguageSchema` (Zod enum med 'sv', 'en', 'es', 'de', 'fr', 'ar', 'fa', 'uk', 'ru', 'ti')
     - `SessionStatusSchema`
     - `TranslationSessionConfigSchema`
   - Detta säkerställer körtidstypning och full överensstämmelse med FSD-arkitekturen.

3. **Contract (TDD & Arkitekturverifiering)**:
   - Enhetstester under `src/features/live_translation/` täcker samtliga krokar, domänklasser och widgets.
   - E2E-verifiering i `scripts/test-e2e.ts` validerar WebSocket-anslutningen och ljudströmningen.

```json
{
  "status": "IN_PROGRESS",
  "current_domain": "live_translation",
  "next_step": "2a_forandra_utat_vision",
  "ticket_id": "TCK-016",
  "active_skill": "wayfinder",
  "active_vectors": ["Contract"]
}
```
