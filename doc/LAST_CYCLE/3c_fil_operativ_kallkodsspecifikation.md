# Steg 3c: Fil-operativ källkodsspecifikation (TCK-016: Integrera realtidsöversättning och Gemini Live-server)

## Berörda filer och förändringsspecifikation

### Berörda relativa filvägar:
- `src/features/live_translation/domain/__tests__/audioResampler.test.ts`
- `src/features/live_translation/domain/__tests__/localWebSocketAdapter.test.ts`
- `src/features/live_translation/domain/__tests__/quotaService.test.ts`
- `src/features/live_translation/domain/__tests__/translationBridge.test.ts`
- `src/features/live_translation/domain/__tests__/transportAdapter.test.ts`
- `src/features/live_translation/hooks/__tests__/useAudioPlayer.test.ts`
- `src/features/live_translation/hooks/__tests__/useCloudflareSFU.test.ts`
- `src/features/live_translation/hooks/__tests__/useLiveTranslation.test.ts`
- `src/features/live_translation/hooks/__tests__/useLocalWebSocket.test.ts`
- `src/features/live_translation/components/__tests__/LiveTranslationWidget.test.tsx`
- `src/features/live_translation/domain/types.ts`
- `src/features/live_translation/domain/schema.ts`
- `src/features/live_translation/domain/languages.ts`
- `src/features/live_translation/domain/adaptiveLogic.ts`
- `src/features/live_translation/domain/audioResampler.ts`
- `src/features/live_translation/domain/CloudflareSFUAdapter.ts`
- `src/features/live_translation/domain/LocalWebSocketAdapter.ts`
- `src/features/live_translation/domain/quotaService.ts`
- `src/features/live_translation/domain/translationBridge.ts`
- `src/features/live_translation/domain/hotSwapManager.ts`
- `src/features/live_translation/domain/multiBridgeOrchestrator.ts`
- `src/features/live_translation/hooks/useAudioPlayer.ts`
- `src/features/live_translation/hooks/useCloudflareSFU.ts`
- `src/features/live_translation/hooks/useLiveTranslation.ts`
- `src/features/live_translation/hooks/useLocalWebSocket.ts`
- `src/features/live_translation/hooks/useQuotaGuard.ts`
- `src/features/live_translation/components/LiveTranslationWidget.tsx`
- `src/features/live_translation/components/QuotaMeter.tsx`
- `src/features/live_translation/workers/AudioProcessor.worklet.ts`
- `src/features/live_translation/workers/MicCapture.worklet.ts`
- `src/features/live_translation/index.ts`

### Detaljerade källkodsinstruktioner för Steg 4:
1. Skapa och kör enhetstester för samtliga krokar, domänklasser och widgets under `src/features/live_translation/`.
2. Implementera domänadaptrar och Web Audio API-strömning.
3. Exponera ren fasad i `src/features/live_translation/index.ts`.

BESLUT: GODKÄND
