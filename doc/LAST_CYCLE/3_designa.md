# Steg 3: Att designa

## Taktisk Rådsdebatt & Ritningar

### 1. Helhetsnivå
- Rensa och säkra alla logikfunktioner i domänlagret.
- Verifiera att testdriven utveckling (TDD) följs strikt: alla enhetstester i `src/features/sms_assistant/domain/__tests__/adminLogic.test.ts` skapas/uppdateras FÖRST innan källkodsfilerna rörs.

### 2. Domännivå (`sms_assistant`)
- **`src/features/sms_assistant/domain/adminLogic.ts`**:
  - Definiera `LogLevel` typ (`"ALLA" | "INFO" | "WARN" | "ERROR"`).
  - Definiera `LogEntry` gränssnitt (`isUser?: boolean`, `text: string`, `level?: "INFO" | "WARN" | "ERROR"`, `timestamp?: string`).
  - Implementera `classifyLogLevel(entry: LogEntry): "INFO" | "WARN" | "ERROR"`.
  - Implementera `filterLogs(logs: LogEntry[], searchQuery: string, levelFilter: LogLevel): LogEntry[]`.
- **`src/features/sms_assistant/domain/__tests__/adminLogic.test.ts`**:
  - TDD-testfall för `classifyLogLevel` och `filterLogs`.
- **`src/features/sms_assistant/components/AdminLogsArea.tsx`**:
  - Använd `useMemo` för prestanda.
  - Sökfält i realtid, filterknappar och rensningsknapp.
- **`src/features/sms_assistant/components/AdminConsole.tsx`**:
  - Koppla `onClearLogs={() => setLogs([])}` till `AdminLogsArea`.

### 3. Operativ punktlista över källkodsfiler
1. `src/features/sms_assistant/domain/__tests__/adminLogic.test.ts` (TDD - Testfil sparad först)
2. `src/features/sms_assistant/domain/adminLogic.ts` (Källkodsfil sparad därefter)
3. `src/features/sms_assistant/components/AdminLogsArea.tsx` (Komponent sparad därefter)
4. `src/features/sms_assistant/components/AdminConsole.tsx` (Komponent sparad därefter)

## Bindande domstolsbeslut
BESLUT: GODKÄND
