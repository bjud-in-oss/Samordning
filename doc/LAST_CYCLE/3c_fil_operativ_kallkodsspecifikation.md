# Steg 3c: Fil-operativ Källkodsspecifikation (TCK-SMS-006)

## Ändringsmanifest

### 1. Enhetstester (TDD)
- **Fil**: `src/server/__tests__/storageResilience.test.ts`
- **Syfte**: Verifiera lokal diskpersistens för `paired_devices.json`, tyst hantering av behörighetsfel och minnesprioriterad parningskontroll.

### 2. Server Storage
- **Fil**: `src/server/storage.ts`
- **Syfte**: Säkra lokal fallback, tysta behörighetsfel och avregistrera felande snapshots.
- **Specifikation**:
  - Introducera `PAIRED_DEVICES_FILE_PATH` (`data/paired_devices.json`).
  - I `pairDeviceToken`: Spara i minnet och skriv synkront/asynkront till `PAIRED_DEVICES_FILE_PATH`.
  - I `loadPairedDevices`: Läs från `data/paired_devices.json` först, därefter Firestore med tyst felhantering.
  - I `loadAdmins`, `loadTrusted`, `loadActiveAlerts`: Fånga `permission-denied` utan terminal-spam.
  - I `initServerStorage`: Lagra `unsubscribe`-funktioner och avregistrera lyssnare vid behörighetsfel, logga informationsmeddelande en gång.

### 3. Server Routes
- **Fil**: `src/server/routes.ts`
- **Syfte**: Säkerställ att `/api/admin/check-pairing` prioriterar `pairedDevices` i minnet för omedelbart svar.
