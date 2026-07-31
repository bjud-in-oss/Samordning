# Steg 3: Att vända

- **Strukturell Rannsakning & Arkitekturförenkling**:
  - Håll alla komponenter korta och modulära (<250 rader kod per fil).
  - Skapa typsäkra hjälpfunktioner i `src/features/sms_assistant/domain/adminLogic.ts` för medlemshantering och moderering.
  - Skriv täckande enhetstester i `src/features/sms_assistant/domain/__tests__/adminLogic.test.ts` med minst 80 % testtäckning.
  - Säkerställ att FSD-reglerna följs (alla externa importer via `src/features/sms_assistant/index.ts`).
  - Ingen tillståndslagring på disk i Node RAM förutom beständig JSON i data/ (följer tillståndslös arkitektur i körtid).
