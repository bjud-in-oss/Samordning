# Steg 3b: Domän, Kontrakt och Fraktal Dokumentation (TCK-LIVE-009)

## Kontraktspecifikation för LiveTranslationListenerWidget

```typescript
export interface LiveTranslationListenerWidgetProps {
  initialLanguage?: SupportedLanguage;
  onLanguageChange?: (language: SupportedLanguage) => void;
}
```

### Beteendekontrakt
1. **AudioContext Aktivering**: `useAudioPlayer.initAudio()` exekveras enbart vid explicit klick på lyssnarknappen.
2. **Dataström**: Meddelanden från `/ws/translation` vidarebefordras till `useAudioPlayer.playAudioChunk`.
3. **Ingen Mikrofonåtkomst**: Inga anrop görs till `navigator.mediaDevices.getUserMedia`.
4. **Zod-schemavalidering**: Språkkoder valideras mot befintligt `SupportedLanguageSchema` i `domain/schema.ts`.
