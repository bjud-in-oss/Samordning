# Steg 4: Producera (TCK-015: Permanent persistens för admin-telefonnummer över serveromstarter)

## Genomförda källkodsändringar

1. **TDD-test i `src/server/__tests__/storage.test.ts`**:
   - Skapade ett nytt test som verifierar att tillagda admin-nummer sparas permanent till disk och Firestore och återställs fullt ut efter en simulerad omstart/nollställning av in-memory-tillståndet.

2. **Lagrings- och persistensmotor i `src/server/storage.ts`**:
   - `saveAdmins()`: Skriver omedelbart till både `data/admins.json` på lokal disk och Cloud Firestore (`system_config/admins`).
   - `loadAdmins()`: Slår samman, deduplicerar och normaliserar nummer från miljövariabler (`ADMIN_NUMBERS`), lokal diskfil (`data/admins.json`) och Cloud Firestore vid serverstart.
   - Samma robusta mönster har implementerats för `trustedNumbers` mot `data/trusted.json`.

3. **Serverstart i `server.ts`**:
   - `initServerStorage()` startas asynkront och garanterar snabb inläsning från disk med asynkron uppdatering från Firestore.
