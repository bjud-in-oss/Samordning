# Steg 2c2: Arkitekturgren B (Hybrid dubbelpersistens: Disk + Firestore med union-inläsning)

## Förslag i Gren B: Hybrid persistensmodell

1. **Skrivning (`saveAdmins`)**:
   - Skriver atomärt och synkront till `data/admins.json`.
   - Skriver parallellt till Firestore `system_config/admins`.
2. **Inläsning (`loadAdmins`)**:
   - Läser `ADMIN_NUMBERS` från miljövariabler.
   - Läser in och parsar `data/admins.json`.
   - Hämtar `admins`-dokumentet från Firestore.
   - Slår ihop alla källor till en unik normaliserad uppsättning telefonnummer.
   - Skriver tillbaka eventuellt kompletterade nummer till disk/Firestore så att båda källor hålls uppdaterade.

### Fördelar:
- Omedelbar tillgänglighet vid boot utan att invänta Firestore-anslutning.
- Fullständig långsiktig persistens i molnet även om disk nollställs.
- Robust mot offline-utveckling och isolerade enhetstester.
