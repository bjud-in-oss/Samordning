# Steg 1: Att kartlägga

- **Domän**: `exportering` (exporthantering för inställningar och inbjudningar).
- **Syfte**: Generera och spara ned laddningsbara filer (JSON samt iCalendar `.ics`) från applikationens tillstånd.
- **Befintligt tillstånd**:
  - Inga filer finns ännu för domänen i `src/features/exportering/` eller `doc/features/exportering/`.
  - Huvudvyn `src/components/MainViewContent.tsx` är den valda konsumtionspunkten för den nya exportknappen.
- **Gränssnittskrav**:
  - Ren FSD-struktur med publika exporter via `index.ts`.
  - Fraktal dokumentation i `doc/features/exportering/`.
  - Enhetstester för JSON- och ICS-genereringslogik i `domain/__tests__/exportUtils.test.ts`.
