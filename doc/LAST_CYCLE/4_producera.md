# Steg 4: Producera (TCK-UI-001)

## Utförda ändringar
1. **TDD-tester skapade**:
   - `src/components/__tests__/AppHeader.test.tsx` skapades och testar hörlursknappen och vymarkering.
2. **Källkodsändringar**:
   - `src/components/AppHeader.tsx`: Importerat `Headphones` från `lucide-react`, lagt till `onToggleTranslation` i `AppHeaderProps` och renderat hörlursknappen bredvid inställningskugghjulet.
   - `src/components/MainViewContent.tsx`: Importerat `LiveTranslationWidget` från `../features/live_translation`, utökat `currentView` till `'stream' | 'settings' | 'translation'`, och renderat widgeten vid `currentView === 'translation'`.
   - `src/App.tsx`: Utökat vy-tillståndet, skickat `onToggleTranslation` till `AppHeader` och kopplat vymodulen till `MainViewContent`.
