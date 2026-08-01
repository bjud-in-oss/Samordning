# Steg 2: Att planera

- **Strategi & Arkitektur**:
  1. Utöka `src/features/sms_assistant/domain/adminLogic.ts` med:
     - `LogEntry` gränssnitt (`isUser`, `text`, `level?`, `timestamp?`).
     - `classifyLogLevel(entry: LogEntry)` för att automatisk härleda loggnivå (`INFO`, `WARN`, `ERROR`) baserat på textinnehåll eller explicit niva.
     - `filterLogs(logs: LogEntry[], query: string, levelFilter: string)` för snabb och typsäker filtrering.
  2. Utöka enhetstester i `src/features/sms_assistant/domain/__tests__/adminLogic.test.ts` med tester för loggnivåer och sök/filtreringslogik.
  3. Uppdatera `src/features/sms_assistant/components/AdminLogsArea.tsx`:
     - Sökfält i realtid med rensningsknapp.
     - Filternavigering för nivåer (`ALLA`, `INFO`, `WARN`, `ERROR`) med räknare per nivå.
     - Töm-knapp för att rensa loggbufferten.
     - Färgkodade loggkort med tydliga nivåbrickor (grön för user, blå/neutral för INFO, gul för WARN, röd för ERROR).
     - `useMemo` för prestandaoptimering vid större mängder loggar.
  4. Uppdatera `src/features/sms_assistant/components/AdminConsole.tsx` för att skicka med `onClearLogs` och hålla filstorleken strikt under 250 rader.
