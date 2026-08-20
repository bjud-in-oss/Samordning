# Steg 3b: Domänkontrakt och Fraktal Dokumentation

- **Samlokaliserad domändokumentation (`src/features/skapa_inbjudan/doc/`)**:
  - `INDEX.md`: Översikt över domänen och dess huvudkomponenter.
  - `BUSINESS_RULES.md`: Regler för obligatoriska fält, datalagring och typdisciplin.
  - `INTEGRATIONS.md`: API- och lagringsintegrationer mot backend och shared.
  - `UI_WORKFLOWS.md`: Flödesbeskrivning från formulärinmatning till publicering och delning.

- **Fasadkontrakt (`src/features/skapa_inbjudan/index.ts`)**:
  - Exporterar `CreateInvitationForm`, `useInvitationForm` samt relevanta TypeScript-typer.
