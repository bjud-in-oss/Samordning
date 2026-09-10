# Steg 3b: Domänkontrakt och fraktal dokumentation (TCK-016)

## Domänkontrakt

Samtliga implementationer ryms inom `src/features/live_translation/` med strikt typkontrakt och Zod-validering.

### Exporter i `src/features/live_translation/index.ts`:
- `LiveTranslationWidget`
- `useLiveTranslation`, `useAudioPlayer`, `useCloudflareSFU`, `useLocalWebSocket`
- `SupportedLanguageSchema`, `SessionStatusSchema`, `TranslationSessionConfigSchema`
- Inga `export *`-satser används.
