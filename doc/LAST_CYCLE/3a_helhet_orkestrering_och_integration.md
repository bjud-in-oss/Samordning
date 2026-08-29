# Steg 3a: Helhet, orkestrering och integration (TCK-015)

## Systemövergripande orkestrering

1. **Boot-sekvens (`server.ts` & `initServerStorage`)**:
   - Vid uppstart anropas `initServerStorage()`.
   - `loadAdmins()` initierar omedelbar inläsning från `data/admins.json` och eventuella `ADMIN_NUMBERS`.
   - När Firestore-anslutningen är etablerad hämtas `system_config/admins` och slås samman med minnestillståndet.

2. **Administrationsmutationer (`/api/admin/members/add` & `/api/admin/members/remove`)**:
   - När ett administratörsnummer läggs till eller tas bort uppdateras minnesarrayen `adminNumbers`.
   - `saveAdmins()` exekveras för att omedelbart uppdatera både `data/admins.json` och Firestore.
