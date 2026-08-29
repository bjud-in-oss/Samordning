# Steg 2e: Försoning och förlikning (TCK-015)

## Syntes och harmonisering

Vi antar Gren B i sin helhet för permanent admin-persistens:
- `saveAdmins()` skriver till både `data/admins.json` och Firestore.
- `loadAdmins()` slår samman `ADMIN_NUMBERS`, `data/admins.json` och Firestore med normalisering och deduplicering.
- `src/server/__tests__/storage.test.ts` validerar omläsning och persistens efter in-memory reset.

**MÄTTNAD: JA**
