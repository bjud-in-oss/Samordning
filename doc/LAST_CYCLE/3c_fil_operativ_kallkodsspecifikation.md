# Steg 3c: Fil-operativ källkodsspecifikation (TCK-015: Permanent persistens för admin-telefonnummer över serveromstarter)

## Berörda filer och förändringsspecifikation

### Berörda relativa filvägar:
- `src/server/__tests__/storage.test.ts`
- `src/server/storage.ts`
- `server.ts`

### Detaljerade källkodsinstruktioner för Steg 4:

1. **`src/server/__tests__/storage.test.ts` (TDD-test först)**:
   - Skapa ett enhetstest `"guarantees admin numbers persist across simulated server restarts by writing to disk and reloading"`:
     - Tömmer `adminNumbers`.
     - Lägger till ett testnummer (t.ex. `"0709998877"`).
     - Anropar `await saveAdmins()`.
     - Nollställer `adminNumbers.length = 0`.
     - Anropar `await loadAdmins()`.
     - Verifierar med `expect(adminNumbers).toContain("0709998877")`.

2. **`src/server/storage.ts`**:
   - Importera `fs` och `path` från Node.js.
   - Definiera konstant sökväg för lokal lagring `ADMINS_FILE_PATH = path.join(process.cwd(), "data", "admins.json")`.
   - Uppdatera `loadAdmins()`:
     - Skapa ett `Set<string>` för kombinerade nummer.
     - Läs in `process.env.ADMIN_NUMBERS` om det finns och lägg till alla poster normaliserade.
     - Om `ADMINS_FILE_PATH` existerar på disk, läs in filen synkront med `fs.readFileSync`, parsa JSON-arrayen och lägg till alla poster normaliserade.
     - Hämta från Firestore `system_config/admins` om Firestore är tillgänglig, och lägg till alla poster normaliserade.
     - Sätt `adminNumbers = Array.from(combinedSet)`.
     - Om diskfilen inte fanns eller Firestore innehöll nya nummer, spara det uppdaterade tillståndet.
   - Uppdatera `saveAdmins()`:
     - Säkerställ att mappen `data/` existerar (`fs.mkdirSync(path.dirname(ADMINS_FILE_PATH), { recursive: true })`).
     - Skriv `JSON.stringify(adminNumbers, null, 2)` till `ADMINS_FILE_PATH`.
     - Anropa Firestore `setDoc(doc(collection(db, "system_config"), "admins"), { numbers: adminNumbers, updatedAt: Date.now() })` om Firestore är ansluten.

3. **`server.ts`**:
   - Säkerställ att `initServerStorage()` anropas vid uppstart och att admin-inläsningen genomförs robust.

**BESLUT: GODKÄND**
