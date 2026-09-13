# Steg 1b: Kartlägga och Svara på GROW-frågor (TCK-UI-002)

## Svar på GROW-frågor

1. **State & RBAC**:
   - `MainViewContent` tar redan emot `isAdmin: boolean` via sina props.
   - När `currentView === 'translation'` görs en ren villkorlig gren: `isAdmin ? <LiveTranslationWidget /> : <LiveTranslationListenerWidget />`.
   - React demonterar den ena komponenten och monterar den andra, vilket triggar respektive komponent/hooks `useEffect`-cleanup och stänger ned eventuella aktiva resurser.

2. **Contract & Interface**:
   - Båda komponenterna exporteras från `src/features/live_translation`.
   - `MainViewContent.tsx` importerar `LiveTranslationWidget, LiveTranslationListenerWidget` från `../features/live_translation`.
   - Inga extra props krävs för `LiveTranslationListenerWidget` vid standardanvändning.

3. **Effects & Separation**:
   - `LiveTranslationListenerWidget` anropar varken `getUserMedia` eller `GeminiSession`.
   - Deltagare som inte är administratörer ser uteslutande lyssnargränssnittet med språkval och play/pause för mottaget tolkarljud.

## Metadata Deklaration

```json
{
  "status": "PLANNED",
  "current_domain": "Global",
  "next_step": "2a",
  "ticket_id": "TCK-UI-002",
  "active_skill": "systemarkitekt",
  "active_vectors": ["State"]
}
```
