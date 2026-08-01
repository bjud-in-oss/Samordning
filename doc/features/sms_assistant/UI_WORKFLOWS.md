# UI Workflows for SMS Assistant

## Gränssnittsflöden
1. **AdminConsole**:
   - Består av `AdminConsoleHeader`, `AdminMembersPanel`, `PendingAlertsQueue` och `AdminLogsArea`.
   - Tillhandahåller inmatning för simulerade SMS och hanterar loggar i lokalt tillstånd.
2. **AdminLogsArea**:
   - **Sökfält**: Filtrerar loggar i realtid mot text och tidsstämpel.
   - **Nivåfilter**: Knappar för `ALLA`, `INFO`, `WARN` och `ERROR` med visning av antal loggar per nivå.
   - **Knappsats**: "Rensa loggar"-knapp för att tömma aktiva loggar.
   - **Färgkodade loggkort**:
     - Grön bakgrund för användarskickade meddelanden (`#D9FDD3`).
     - Ljusblå/neutral bakgrund för `INFO`.
     - Ljusgul bakgrund för `WARN`.
     - Ljusröd bakgrund för `ERROR`.
