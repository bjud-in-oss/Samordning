# Steg 2: Att förändra

- **Design av ny domän `exportering`**:
  1. Skapa domänlogik i `src/features/exportering/domain/exportUtils.ts`:
     - `generateJsonExport(data: unknown): string`
     - `generateIcsExport(events: Array<{ title: string; date?: string; description?: string }>): string`
     - `downloadFile(content: string, filename: string, mimeType: string): void`
  2. Skapa enhetstester i `src/features/exportering/domain/__tests__/exportUtils.test.ts` med täckning för JSON- och ICS-format.
  3. Skapa UI-komponenten `src/features/exportering/components/ExportButton.tsx` som erbjuder en dropdown/knapp för export.
  4. Exportera publika gränssnittet i `src/features/exportering/index.ts`.
  5. Skapa lokal fraktal dokumentation i `doc/features/exportering/`:
     - `INDEX.md`
     - `BUSINESS_RULES.md`
     - `UI_WORKFLOWS.md`
     - `INTEGRATIONS.md`
  6. Ansluta och konsumera `ExportButton` i `src/components/MainViewContent.tsx`.
