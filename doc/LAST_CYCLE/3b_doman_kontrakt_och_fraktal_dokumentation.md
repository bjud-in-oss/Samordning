# Steg 3b: Domänkontrakt och fraktal dokumentation (TCK-011)

## 1. Datalagringskontrakt
- **Firestore Samlingar**:
  - `alerts`: Dokument per ID (innehåller `ActiveAlert`).
  - `system_config`: Dokument `admins` (`{ numbers: string[] }`) och `trusted` (`{ numbers: string[] }`).
  - `paired_devices`: Dokument per token (`{ token: string, pairedAt: number }`).
- **Server Export**:
  - `src/server/storage.ts`: `initServerStorage`, `saveActiveAlerts`, `saveAdmins`, `saveTrusted`, `savePairedDevices`, `pairDeviceToken`.
  - `src/server/__tests__/storage.test.ts`: TDD-enhetstest för datalagring och Firestore-abstraktion.
