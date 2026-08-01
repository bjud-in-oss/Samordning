# Steg 3: Att designa

## Taktisk Rådsdebatt & Ritningar

### 1. Helhetsnivå
- **Att förändra (Tes)**: Implementeringen genomförs med strikt TDD. Först säkerställer vi att testfilen `src/features/sms_assistant/domain/__tests__/adminLogic.test.ts` innehåller alla testfall för `classifyLogLevel` och `filterLogs`.
- **Att vända (Antites)**: Granska tidsstämplar och ordning. Testfilen i `__tests__` MÅSTE skapas/uppdateras på disk FÖRE någon ändring i produktionskoden i `src/features/sms_assistant/domain/adminLogic.ts`, `AdminLogsArea.tsx` eller `AdminConsole.tsx` för att uppfylla TDD-spärren i `scripts/verify-architecture.js`.
- **Att förlika (Syntes)**: Vi spikar TDD-ordningen:
  1. Uppdatera `src/features/sms_assistant/domain/__tests__/adminLogic.test.ts` (85 rader) med röd/grön verifiering.
  2. Uppdatera `src/features/sms_assistant/domain/adminLogic.ts` (86 rader) med typsäker `LogLevel`, `LogEntry`, `classifyLogLevel` och `filterLogs`.
  3. Uppdatera `src/features/sms_assistant/components/AdminLogsArea.tsx` (208 rader) med sökfält, nivåfilter, rensningsknapp och `useMemo`.
  4. Uppdatera `src/features/sms_assistant/components/AdminConsole.tsx` (249 rader) med `onClearLogs`.

### 2. Domännivå (`sms_assistant`)
- **`src/features/sms_assistant/domain/adminLogic.ts`**:
  - `LogLevel`: `"ALLA" | "INFO" | "WARN" | "ERROR"`
  - `LogEntry`: `{ isUser?: boolean; text: string; level?: "INFO" | "WARN" | "ERROR"; timestamp?: string }`
  - `classifyLogLevel(entry: LogEntry)`: Håller reda på `WARN` nyckelord (`varning`, `warn`, `obehörig`, `tips`) före `ERROR` nyckelord (`fel`, `error`, `ogiltig`, `misslyckas`, `403`, `404`, `500`).
  - `filterLogs(logs, searchQuery, levelFilter)`: Fritext- och nivåfilter utan mutationer.
- **`src/features/sms_assistant/components/AdminLogsArea.tsx`**:
  - Sökfält i realtid med ikon och rensningsknapp (`X`).
  - Nivåknappar med dynamiska antalsräknare per nivå.
  - "Rensa loggar"-knapp med papperskorgsikon.
  - Tydlig färgkodning per loggnivå (`#D9FDD3` för användare, rose för ERROR, amber för WARN, slate för INFO).
- **`src/features/sms_assistant/components/AdminConsole.tsx`**:
  - Ansluter `onClearLogs={() => setLogs([])}` och säkerställer <250 rader.

### 3. Operativ punktlista över källkodsfiler
1. `src/features/sms_assistant/domain/__tests__/adminLogic.test.ts` (85 rader) - TDD: Skapas/uppdateras först för att testa loggklassificering och filtrering.
2. `src/features/sms_assistant/domain/adminLogic.ts` (86 rader) - Innehåller rena funktioner för loggnivåer och filtrering.
3. `src/features/sms_assistant/components/AdminLogsArea.tsx` (208 rader) - UI-komponent med sökfält, nivåknappar, rensning och `useMemo`.
4. `src/features/sms_assistant/components/AdminConsole.tsx` (249 rader) - Huvudkonsol som skickar med `onClearLogs` och håller sig under 250 rader.

## Bindande domstolsbeslut
BESLUT: GODKÄND
