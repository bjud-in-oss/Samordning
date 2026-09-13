# Steg 4: Producera (TCK-UI-002)

## Utförda ändringar

1. **Enhetstester (TDD)**:
   - `src/components/__tests__/MainViewContent.test.tsx`:
     - Skapade enhetstester som verifierar att:
       - När `currentView === 'translation'` och `isAdmin === false`, renderas `<LiveTranslationListenerWidget />` och `<LiveTranslationWidget />` utesluts.
       - När `currentView === 'translation'` och `isAdmin === true`, renderas `<LiveTranslationWidget />` och `<LiveTranslationListenerWidget />` utesluts.

2. **Produktionskällkod**:
   - `src/components/MainViewContent.tsx`:
     - Importerade `LiveTranslationListenerWidget` från `../features/live_translation`.
     - Implementerade villkorlig rendering under `currentView === 'translation'`:
       `{isAdmin ? <LiveTranslationWidget /> : <LiveTranslationListenerWidget />}`.
