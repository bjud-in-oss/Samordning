# Steg 3a: Helhet, orkestrering och integration

## Systemintegration och orkestrering
- **Klient-server-kontrakt**:
  - Klienten ansluter mot `${protocol}//${host}/ws/translation`.
  - Servern (`server.ts`) lyssnar på `server.on('upgrade', ...)` och verifierar `pathname === '/ws/translation'`.
- **Tillståndshantering**:
  - `useLiveTranslation` läser konfigurationen vid initialisering via `getInitialTransportMode`.
  - Användaren kan fortfarande manuellt byta läge i UI via `setTransportMode`.
