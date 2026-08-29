# Steg 2b: Evaluera yttre anpassning (TCK-015)

## Utvärdering mot körtidsmiljö och krav

- **Cloud Run / Sandboxed miljö**: I en containerbaserad miljö kan containrar startas om, ersättas eller skalas. Både filsystem och Firestore samverkar för att maximera tillgänglighet och hastighet.
- **Bakåtkompatibilitet**: Befintliga admin-nummer i `data/admins.json` (t.ex. de 5 fördefinerade numren) förblir intakta och läses in automatiskt tillsammans med eventuella Firestore- och miljövariabelposter.
- **Säkerhet**: Endast giltiga, normaliserade telefonnummer sparas och exponeras via API och autentiseringskontroller.
