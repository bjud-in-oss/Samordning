# Steg 2b: Förändra Inåt - Arkitektur och Komponentansvar

## Arkitektur & Flödesstyrning
- `App.tsx` & `usePersistentState`:
  - Central källa till sanning för `pushEnabled` (boolean) och `savedTags` (områdesfilter).
  - Skickar `onTogglePush`, `onEnablePush`, `onDisablePush` och `onToggleSettings` till `AppHeader`, `StreamFilterStatus` och `OnboardingWizard`.
- `StreamFilterStatus.tsx`:
  - Tar emot `onEnableAndOpenSettings` eller kombinerade handlers (`onEnablePush` + `onOpenSettings`) så att klick i inaktivt läge sömlöst aktiverar läget.
- `ActiveStream.tsx`:
  - Beräknar kortplacering:
    - `!pushEnabled` $\rightarrow$ `topItems = []`, statuskort infogas på index 0 före alla `filteredStream`.
    - `pushEnabled` $\rightarrow$ `topItems = filteredStream.slice(0, 2)`, statuskort infogas på index 2, därefter `remainingItems = filteredStream.slice(2)`.
- `CreateInvitationForm.tsx`:
  - Slutknapp med texten "Ge en inbjudan".
