# Steg 2: Att planera

## Strategisk Rådsdebatt

### 1. Helhetsnivå
- **Att förändra (Tes / Kreativ fas)**: Vi förbättrar logghanteringen i SMS-assistenten så att administratören har fullständig kontroll över logginlägg. Detta sker genom realtidssökning, nivåfiltrering (`ALLA`, `INFO`, `WARN`, `ERROR`), knappsats för loggrensning samt färgkodade visningskort för snabb visuell felsökning på mobil och desktop.
- **Att vända (Antites / Anpassande fas)**: Granska `src/features/sms_assistant/domain/adminLogic.ts` (86 rader) och `src/features/sms_assistant/components/AdminLogsArea.tsx` (208 rader). Loggfiltrering och loggnivåklassificering måste ligga helt tillståndslöst i rena funktioner (`classifyLogLevel`, `filterLogs`) i `adminLogic.ts` för att säkerställa 100 % testbarhet och uppfylla 250-radersregeln.
- **Att förlika (Syntes / Systemdomare)**: Vi fastställer en tillståndslös loggarkitektur. `classifyLogLevel` och `filterLogs` i `adminLogic.ts` hanterar affärslogik och klassificering. `AdminLogsArea.tsx` använder `useMemo` för prestanda. `AdminConsole.tsx` (249 rader) skickar med `onClearLogs` och håller sig strikt under 250 rader.

### 2. Domännivå (`sms_assistant`)
- **Att förändra**: Exportera `LogLevel`, `LogEntry`, `classifyLogLevel` och `filterLogs` från `src/features/sms_assistant/domain/adminLogic.ts`. Uppdatera `doc/features/sms_assistant/` med uppdaterade regler.
- **Att vända**: Verifiera att inga importer görs från interna undermappar utanför domänen (följ Feature-Sliced Design). Alla externa anrop till domänen måste gå via `src/features/sms_assistant/index.ts`.
- **Att förlika**: Strategisk byggplan godkänd. Vi låser kontrakten och fortsätter till Steg 3 (Att designa).

## Bindande domstolsbeslut
BESLUT: GODKÄND
