# Exportering Feature Index

Denna domän tillhandahåller exportfunktionalitet för användarens sparade inställningar och inbjudningar.

## Publika gränssnitt
- `ExportButton`: React-komponent för val och nedladdning av data som JSON eller ICS.
- `generateJsonExport`: Hjälpfunktion för att strukturerat serialisera data.
- `generateIcsExport`: Hjälpfunktion för att generera iCalendar (.ics)-filer från händelser.
