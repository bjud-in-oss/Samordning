# Steg 1: Att kartlägga

- **Tillstånd**: Dokumentation låg tidigare i `src/features/[domän]/doc/` samt samlad i en enskild `doc/LAST_CYCLE.md`.
- **Systemkrav**: 
  - `doc/` i roten äger all dokumentation. `src/` är reserverat enbart för källkod och tester.
  - Lokal fraktal dokumentation ska ligga i `doc/features/[domän]/` med fyra obligatoriska filer (`INDEX.md`, `BUSINESS_RULES.md`, `UI_WORKFLOWS.md`, `INTEGRATIONS.md`).
  - Processloggar i `doc/LAST_CYCLE/` ska delas upp i fem separata filer (`1_kartlagga.md`, `2_forandra.md`, `3_vanda.md`, `4_forlika.md`, `5_producera.md`).
- **Inventerade domäner**: `anpassa`, `healthcheck`, `inbjudningar`, `mission_router`, `mobile_pwa_app`, `skapa_inbjudan`, `sms_assistant`.
