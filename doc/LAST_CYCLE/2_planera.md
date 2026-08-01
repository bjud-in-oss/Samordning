# Steg 2: Att planera

## Strategisk Rådsdebatt

### 1. Helhetsnivå
- **Att förändra (Tes / Kreativ fas)**: Vi behöver ge administratörer i `AdminConsole` full kontroll över system- och kommunikationsloggar med snabb fritextsökning, nivåfilter (ALLA, INFO, WARN, ERROR), samt en tydlig knappsats för rensning av loggbuffert.
- **Att vända (Antites / Anpassande fas)**: Loggfiltreringen får inte introducera tunga externa bibliotek eller bryta Feature-Sliced Design. Alla logikfunktioner (`classifyLogLevel`, `filterLogs`) ska ligga renodlade i domänskiktet (`adminLogic.ts`) och testas med 100 % täckning innan UI-komponenter rörs.
- **Att förlika (Syntes / Systemdomare)**: Vi bygger en ren och typsäker loggfiltrering med renodlade funktioner i `adminLogic.ts`, täcker den med enhetstester i `adminLogic.test.ts`, och ansluter den till `AdminLogsArea.tsx` med `useMemo` för optimal prestanda utan UI-låsningar.

### 2. Domännivå (`sms_assistant`)
- **Att förändra**: Implementera `LogLevel` typ, `LogEntry` gränssnitt, `classifyLogLevel` samt `filterLogs` i `adminLogic.ts`. Uppdatera `AdminLogsArea.tsx` med sökfält, nivåknappar, rensningsknapp och visuell färgkodning.
- **Att vända**: Se till att `AdminConsole.tsx` inte överskrider 250 rader. Verifiera att `onClearLogs` skickas med från `AdminConsole.tsx` för att tömma tillståndet.
- **Att förlika**: Godkänn arkitekturplanen. Samtliga dokumentationsfiler i `doc/features/` ska låsas och uppdateras i detta steg innan några ändringar görs i källkoden.

## Bindande domstolsbeslut
BESLUT: GODKÄND
