# Steg 3c: Fil-operativ Källkodsspecifikation (TCK-SMS-005)

## Ändringsmanifest

### 1. Enhetstester (TDD)
- **Fil**: src/server/__tests__/pairingSync.test.ts
- **Syfte**: Verifiera skiftlägesoberoende parning, realtidssynk och fallback i minnet.
- **Specifikation**:
  - Testa pairDeviceToken med blandade versaler och verifiera att både original och gemener finns i pairedDevices.
  - Testa asynkron Firestore-fallback och cachenivåer.
  - Verifiera att tomma eller ogiltiga tokens avvisas korrekt.

### 2. Server Storage
- **Fil**: src/server/storage.ts
- **Syfte**: Uppdatera pairDeviceToken och registrera onSnapshot-lyssnare på paired_devices.
- **Specifikation**:
  - pairDeviceToken: Spara både original och lowercase i pairedDevices och i Firestore.
  - initServerStorage(): Lägg till onSnapshot-lyssnare på paired_devices som lägger till både doc.id och doc.id.toLowerCase() vid added och modified.

### 3. Server Routes
- **Fil**: src/server/routes.ts
- **Syfte**: Gör /api/admin/check-pairing asynkron med Firestore-fallback.
- **Specifikation**:
  - Om token finns i minnet (original eller lowercase), returnera { paired: true, verified: true }.
  - Om ej i minnet, gör Firestore-uppslag mot paired_devices, cacha vid träff och returnera { paired: true, verified: true }.
  - Returnera annars { paired: false, verified: false }.

### 4. Admin Member Routes
- **Fil**: src/server/adminMemberRoutes.ts
- **Syfte**: Ta bort dubblerad /api/admin/check-pairing route och åtgärda as any typningar.
