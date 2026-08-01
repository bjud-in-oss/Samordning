# Steg 1: Att kartlägga

### Påverkade domäner
- `sms_assistant`

### Empirisk inventering
- **Mål**: Förbättra hanteringen av admin-loggar i `AdminLogsArea`.
- **Användarbehov & UX-krav**:
  1. Realtidssökning i loggtext via ett dedikerat sökfält.
  2. Nivåfiltrering för loggnivåer (`ALLA`, `INFO`, `WARN`, `ERROR`).
  3. Rensningsknapp/knappsats för att tömma den aktiva loggbufferten.
  4. Tydlig färgkodning och nivåbrickor baserat på loggnivå (grönt för användare, blått/neutralt för INFO, gult för WARN, rött för ERROR).
  5. Prestandaoptimering via `useMemo` för att förhindra tröghet eller låst UI vid stora mängder loggrader.
- **Källkodsfiler & Radantal**:
  - `src/features/sms_assistant/domain/adminLogic.ts` (86 rader) - Innehåller `normalizePhone`, `isValidPhone`, `isPhoneInList`, `addPhoneToList`, `removePhoneFromList`, `filterPendingAlerts`, `classifyLogLevel` (med `WARN` nyckelordskontroll före `ERROR`), `filterLogs` samt typerna `LogLevel` och `LogEntry`.
  - `src/features/sms_assistant/domain/__tests__/adminLogic.test.ts` (85 rader) - Innehåller 8 enhetstester för alla domänfunktioner.
  - `src/features/sms_assistant/components/AdminLogsArea.tsx` (208 rader) - Innehåller sökfält, nivåfilter, rensningsknapp och visualisering.
  - `src/features/sms_assistant/components/AdminConsole.tsx` (249 rader) - Huvudkonsol för SMS-assistenten, konsumerar `AdminLogsArea` med `onClearLogs`.
- **Fraktala dokumentationsfiler**:
  - `doc/features/sms_assistant/INDEX.md`
  - `doc/features/sms_assistant/BUSINESS_RULES.md`
  - `doc/features/sms_assistant/UI_WORKFLOWS.md`
  - `doc/features/sms_assistant/INTEGRATIONS.md`
- **Externa importer och konsumtion**:
  - `AdminLogsArea` konsumeras internt i `AdminConsole.tsx`.
  - `AdminConsole` exporteras via `src/features/sms_assistant/index.ts` och konsumeras externt i `src/App.tsx`.
