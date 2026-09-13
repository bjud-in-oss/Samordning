# Steg 3b: Domän, kontrakt och fraktal dokumentation

## Domänkontrakt och filstruktur
1. **Domän**: `src/features/live_translation/`
2. **Berörda filer**:
   - `src/features/live_translation/domain/LocalWebSocketAdapter.ts`:
     - Ändra `getDefaultWebSocketUrl` till att använda `/ws/translation`.
   - `src/features/live_translation/hooks/useLiveTranslation.ts`:
     - Inför `getInitialTransportMode` som kontrollerar `VITE_AUDIO_SOURCE` och `AUDIO_SOURCE`.
     - Sätt initialt state för `transportMode` till returvärdet från `getInitialTransportMode`.
3. **Tester**:
   - `src/features/live_translation/domain/__tests__/localWebSocketAdapter.test.ts`: Uppdatera förväntad URL till `/ws/translation`.
   - `src/features/live_translation/hooks/__tests__/useLiveTranslation.test.ts`: Lägg till testfall för initialisering vid konfigurerad miljövariabel.
