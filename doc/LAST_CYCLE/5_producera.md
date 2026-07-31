# Steg 5: Att producera

- Skapat den nya domänen `src/features/exportering/` med:
  - Domänlogik: `domain/exportUtils.ts` (JSON & iCalendar RFC 5545 generatorer).
  - Enhetstester: `domain/__tests__/exportUtils.test.ts`.
  - UI-komponent: `components/ExportButton.tsx`.
  - Publikt index: `index.ts`.
- Skapat fraktal dokumentation under `doc/features/exportering/`:
  - `INDEX.md`, `BUSINESS_RULES.md`, `UI_WORKFLOWS.md`, `INTEGRATIONS.md`.
- Anslutit och konsumerat `ExportButton` i `src/components/MainViewContent.tsx`.
- Verifierat att testerna körs grönt och att arkitekturkontrollen godkänner ändringarna.
