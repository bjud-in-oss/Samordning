# Steg 3a: Helhet, Orkestrering och Integration

- **Integrationsöversikt**:
  - `AppHeader.tsx` integreras mot `App.tsx` och tar emot `pushEnabled`, `onTogglePush`, `isToggling`, `currentView`, `onToggleSettings` och `onCreateInvitation`.
  - `ActiveStream.tsx` skickar `pushEnabled` och `savedTags` till `StreamFilterStatus.tsx`.
  - När aviseringar är PÅ placeras `StreamFilterStatus` efter andra eller tredje kortet i inbjudningslistan.
  - När aviseringar är AV visas ett pedagogiskt introduktionskort överst med handledning för att aktivera notiser samt konfigurera geografiska områden och intressegrupper via inställningarna.
