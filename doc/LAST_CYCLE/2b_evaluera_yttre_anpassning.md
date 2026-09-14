# Steg 2b: Evaluera yttre anpassning (TCK-SMS-006)

## Utvärdering av Beroenden och Risker

1. **gRPC/Firestore Återanslutningsbeteende**:
   - *Risk*: Standardbeteendet i Firestore SDK vid strömfel är aggressiv återanslutning som fyller loggarna med `GrpcConnection RPC 'Write' stream error`.
   - *Lösning*: Omedelbart anrop till returnerad `unsub()` vid fel callback.

2. **Skrivfel mot disk**:
   - *Risk*: `data/`-katalogen kanske inte finns skapad vid första skrivning.
   - *Lösning*: Säkerställ `fs.mkdirSync(path.dirname(...), { recursive: true })` före skrivning.

3. **Loggningsdisciplin**:
   - *Lösning*: En `hasLoggedPermissionNotice`-flagga säkerställer att informationsmeddelandet endast skrivs ut en enda gång under serverns livstid.
