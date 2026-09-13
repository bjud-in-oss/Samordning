# Steg 3c: Fil-operativ Källkodsspecifikation (TCK-UI-002)

## Filer som berörs

### 1. Testfiler (TDD i Steg 4)
- `src/components/__tests__/MainViewContent.test.tsx`:
  - Test som verifierar att `<LiveTranslationWidget />` renderas när `currentView === 'translation'` och `isAdmin === true`.
  - Test som verifierar att `<LiveTranslationListenerWidget />` renderas när `currentView === 'translation'` och `isAdmin === false`.

### 2. Produktionskällkod
- `src/components/MainViewContent.tsx`:
  - Importera `LiveTranslationListenerWidget` från `../features/live_translation`.
  - Uppdatera vyn för `currentView === 'translation'` så att den villkorligt renderar `<LiveTranslationWidget />` vid `isAdmin` och `<LiveTranslationListenerWidget />` vid `!isAdmin`.
