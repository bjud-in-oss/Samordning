# Steg 1b: Kartlägga (TCK-015: Permanent persistens för admin-telefonnummer över serveromstarter)

## Svar på GROW-frågor mot kodbasen

1. **State (Tillstånd & Persistens)**:
   - I `src/server/storage.ts` hanteras `adminNumbers` idag som en intern minnesarray (`export let adminNumbers: string[] = [];`).
   - Funktionen `saveAdmins()` uppdateras så att den:
     1. Synkront eller via `fs.writeFileSync`/`fs.promises.writeFile` skriver ut `adminNumbers` som ett formaterat JSON-fält till `data/admins.json` (skapar `data/`-katalogen om den saknas).
     2. Asynkront anropar Firestore `setDoc(doc(collection(db, "system_config"), "admins"), { numbers: adminNumbers, updatedAt: Date.now() })`.
   - Detta garanterar att en omedelbar serveromstart alltid hittar de senaste numren på disk och i molnet.

2. **State & Resilience (Inläsning och Flerkällssammanfogning)**:
   - `loadAdmins()` i `src/server/storage.ts` ska läsa från:
     1. `process.env.ADMIN_NUMBERS` (kommaseparerad sträng).
     2. `data/admins.json` (lokal JSON-fil om den existerar och är giltig JSON).
     3. Firestore (`system_config/admins`-dokument).
   - Alla inlästa nummer normaliseras via `normalizePhone` och samlas i ett `Set<string>`.
   - Arrayen `adminNumbers` tilldelas det deduplicerade resultatet (`Array.from(set)`), och `saveAdmins()` sparar därefter det sammanslagna tillståndet så att båda källor hålls i full paritet.

3. **Resilience (TDD & Verifierbarhet)**:
   - I `src/server/__tests__/storage.test.ts` skapar vi ett dedikerat testfall som:
     1. Lägger till ett nytt admin-nummer och anropar `await saveAdmins()`.
     2. Tömmer `adminNumbers.length = 0`.
     3. Anropar `await loadAdmins()`.
     4. Verifierar med `expect(adminNumbers).toContain(...)` att numret lästes in korrekt från disk/mockad lagring.

```json
{
  "status": "IN_PROGRESS",
  "current_domain": "Global",
  "next_step": "2a_forandra_utat_vision",
  "ticket_id": "TCK-015",
  "active_skill": "wayfinder",
  "active_vectors": ["State", "Resilience"]
}
```
