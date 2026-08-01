# Business Rules for SMS Assistant

## Affärsregler
1. **Loggklassificering (`classifyLogLevel`)**:
   - Om logginlägget har en explicit `level` (`INFO`, `WARN`, `ERROR`), används den direkt.
   - Om texten innehåller nyckelord för varning (`varning`, `warn`, `obehörig`, `tips`), klassificeras den som `WARN`.
   - Om texten innehåller nyckelord för fel (`fel`, `error`, `ogiltig`, `misslyckas`, `403`, `404`, `500`), klassificeras den som `ERROR`.
   - Övriga meddelanden klassificeras som `INFO`.
2. **Loggfiltrering (`filterLogs`)**:
   - Filtrerar logginlägg baserat på vald `LogLevel` (`ALLA`, `INFO`, `WARN`, `ERROR`).
   - Matchar söksträng (skiftlägesokänslig) mot loggtext och tidsstämpel.
3. **Loggbuffertrensning**:
   - Tömning av loggbuffert återställer den aktiva logglistan i gränssnittet.
