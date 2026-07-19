# 4_Produce

## Genomförda åtgärder
- **App.tsx (Ny iOS-style Toggle)**:
  - Skrotade den 3-delade togglen som skapade krockar mellan vyer och notis-status.
  - Implementerade en klassisk, separat iOS-style switch för "Få inbjudningar som notiser" som enbart styr notis-status (via `handleEnablePush` / `handleDisablePush`).
  - Switchen har asynkront lås (`isToggling`) via `disabled`-attributet och tydlig visuell färgindikering.
  - Separerade ut en egen knapp för `⚙️ Anpassa` som enbart styr vyn (`setCurrentView('settings')`). Knappen gråas ut något när notiser är avstängda, enligt direktiv.
  - Tydlig, idiotsäker separation av ansvarsområden (state).

Bygget är grönt och uppdaterat!
