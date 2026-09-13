# Steg 1a: Orientera (TCK-UI-002)

## Mål och Omfång
Villkorlig rendering av tolk- respektive lyssnarvy i `MainViewContent.tsx` baserat på `isAdmin`:
- Om `currentView === 'translation'` och `isAdmin === true`: rendera `<LiveTranslationWidget />`.
- Om `currentView === 'translation'` och `isAdmin === false`: rendera `<LiveTranslationListenerWidget />`.

## GROW-frågor (Risknoder: State, Contract, Effects)

1. **State & RBAC**:
   *Fråga*: Hur säkerställs att rollväxling i applikationstillståndet omedelbart och reaktivt skiftar vyn mellan administratörens tolkvy och deltagarens lyssnarvy?

2. **Contract & Gränssnitt**:
   *Fråga*: Hur integreras `LiveTranslationListenerWidget` rent i `MainViewContent.tsx` via `src/features/live_translation` utan att rubba befintliga navigationsegenskaper?

3. **Effects & Resurshantering**:
   *Fråga*: Hur garanteras att byte av vy eller roll frigör eventuella aktiva ljudsessioner och förhindrar otillbörlig åtkomst till mikrofon eller administrationsreglage?
