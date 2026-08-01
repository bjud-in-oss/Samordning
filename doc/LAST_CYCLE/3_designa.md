# Steg 3: Att designa

- **Taktisk utformning & Fillista**:
  1. `src/features/sms_assistant/domain/adminLogic.ts`:
     - Lägg till typen `LogLevel` (`'ALLA' | 'INFO' | 'WARN' | 'ERROR'`).
     - Lägg till gränssnittet `LogEntry`.
     - Implementera `classifyLogLevel(entry: LogEntry): 'INFO' | 'WARN' | 'ERROR'`.
     - Implementera `filterLogs(logs: LogEntry[], query: string, levelFilter: LogLevel): LogEntry[]`.
  2. `src/features/sms_assistant/domain/__tests__/adminLogic.test.ts`:
     - Verifiera automatisk klassificering av `INFO`, `WARN` och `ERROR`.
     - Verifiera fritextsökning och nivåfiltrering.
  3. `src/features/sms_assistant/components/AdminLogsArea.tsx`:
     - Implementera sök- och filtreringsverktyg.
     - Implementera rensningsfunktion för loggbuffert.
     - Applicera responsive Tailwind-färgkodning och ikoner från `lucide-react`.
  4. `src/features/sms_assistant/components/AdminConsole.tsx`:
     - Koppla ihop loggbufferten med `onClearLogs`.

## Bindande domstolsbeslut
BESLUT: GODKÄND
