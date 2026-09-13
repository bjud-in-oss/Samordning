# Steg 1b: Kartlägga (TCK-UI-001)

## Analys och svar på GROW-frågor

### 1. State: Vy-växling och Toggling
- I `src/App.tsx` utökas `currentView` till att stödja `'stream' | 'settings' | 'translation' | 'admin'`.
- När användaren klickar på hörlursknappen i `AppHeader`:
  - Om `currentView === 'translation'` togglas den tillbaka till `'stream'`.
  - Om `currentView !== 'translation'` sätts den till `'translation'`.
- På samma sätt som med kugghjulet för inställningar ger detta en direkt, responsiv tvåvägsväxling.

### 2. Contract: Komponentgränssnitt utan Typläckage
- I `src/components/AppHeader.tsx`:
  - Importera `Headphones` från `lucide-react`.
  - `currentView` typas till `"stream" | "settings" | "translation"`.
  - Ny callback: `onToggleTranslation: () => void`.
  - Hörlursknapp placeras i högra styrpanelen bredvid inställningskugghjulet. Aktivt läge markeras med `bg-brand-paper text-brand-accent`.
- I `src/components/MainViewContent.tsx`:
  - `currentView` typas till `'stream' | 'settings' | 'translation'`.
  - `setCurrentView` typas till `React.Dispatch<React.SetStateAction<'stream' | 'settings' | 'translation'>>`.
  - Vid `currentView === 'translation'` renderas `<LiveTranslationWidget />` importerad från `../features/live_translation`.
- I `src/App.tsx`:
  - `currentView` hanteras med explicit unionstyp utan `as any`.

### 3. Effects: Resursstädning och PWA-layout
- `LiveTranslationWidget` har redan intern livscykelhantering (`useEffect` för frikoppling av AudioContext/WebSockets).
- Layouten i `MainViewContent` placerar widgeten i en ren behållare som matchar övriga kort (`max-w-xl`, subtil ram, mjuk övergång).

```json
{
  "status": "IN_PROGRESS",
  "current_domain": "Global",
  "next_step": "2a",
  "ticket_id": "TCK-UI-001",
  "active_skill": "pwa-integration",
  "active_vectors": ["Contract"]
}
```
