# Steg 3c: Fil-operativ källkodsspecifikation (TCK-LIVE-006: Dual Audio Ingestion, Opus och Resiliens i server.ts och translationServer.ts)

## Berörda filer och förändringsspecifikation

### Berörda relativa filvägar:
- `src/server/__tests__/translationServer.test.ts`
- `src/features/live_translation/domain/__tests__/translationBridge.test.ts`
- `src/features/live_translation/domain/__tests__/audioResampler.test.ts`
- `src/features/live_translation/domain/schema.ts`
- `src/features/live_translation/domain/types.ts`
- `src/features/live_translation/domain/translationBridge.ts`
- `src/features/live_translation/domain/hotSwapManager.ts`
- `src/features/live_translation/index.ts`
- `src/server/translationServer.ts`
- `server.ts`

### Detaljerade källkodsinstruktioner för Steg 4:
1. **TDD Först**:
   - Skapa/uppdatera `src/server/__tests__/translationServer.test.ts` med aktiva påståenden (`expect`) för dubbel ingestion (`VMIX` och `WEBSOCKET`), Opus-hantering samt 14-minuters hot-swap triggers.
2. **Källkodsändringar**:
   - `server.ts`: Läs in `AUDIO_SOURCE` och `WS_PORT` från miljövariabler, initiera och orkestrera WebSocket-servern på port 8080 samt port 3000.
   - `src/server/translationServer.ts`:
     - Implementera dual audio ingestion: VMIX 48kHz (med `AudioResampler.downsample48kTo16k`) vs WEBSOCKET.
     - Implementera Opus-kodning/avkodning med 20ms paketramar för adaptiv buffertkompatibilitet (100–150 ms).
     - Integrera `TranslationBridge` och `HotSwapManager` för proaktiv rotation efter 14 minuter.
   - `src/features/live_translation/domain/schema.ts` & `index.ts`: Exportera uppdaterade scheman och domänklasser utan `export *`.

BESLUT: GODKÄND INFÖR TOKEN-GATE
