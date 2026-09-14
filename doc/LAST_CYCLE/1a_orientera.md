# Steg 1a: Orientera (TCK-SMS-006)

## Ärendebeskrivning
Tysta Firestore-behörighetsfel i storage.ts och säkra lokal fallback:
1. I `src/server/storage.ts`:
   - I `initServerStorage()`: Om `onSnapshot` ger ett fel (t.ex. `permission-denied`), stäng av lyssnaren omedelbart så att den inte hamnar i en oändlig reconnect-loop. Logga enbart en ren informationstext en gång:
     "[Firestore] Ingen databasbehörighet. Kör i helt lokalt RAM- och disk-läge."
   - I `loadPairedDevices()`, `loadAdmins()`, `loadTrusted()` och `loadActiveAlerts()`: Fånga behörighetsfel tyst utan terminal-spam och behåll alltid den lokala datan från disk/RAM.
   - I `pairDeviceToken()`: Spara alltid koden i minnes-Setet `pairedDevices` (både original och `.toLowerCase()`) samt skriv till en lokal diskfil `data/paired_devices.json`.
2. I `src/server/routes.ts`:
   - Se till att `/api/admin/check-pairing` kontrollerar `pairedDevices.has(token)` i minnet först. Finns den i minnet, svara direkt med `{ paired: true, verified: true }` utan väntetid.

## GROW-frågor
1. **State**: Hur garanteras att parningskoder och administratörsnummer kvarstår och laddas pålitligt från lokal disk (`data/paired_devices.json`, `data/admins.json`, etc.) när Firestore-behörigheter saknas?
2. **Contract**: Hur säkerställs att `/api/admin/check-pairing` omedelbart svarar med `{ paired: true, verified: true }` vid träff i minnet utan att blockeras av onödiga nätverks- eller databasanrop?
3. **Resilience**: Hur förhindras oändliga reconnect-loopar och terminal-spam från Firestore-lyssnare (`onSnapshot`) vid `permission-denied` genom omedelbar avregistrering och diskret felloggning?
