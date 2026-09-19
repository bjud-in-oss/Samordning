# Begränsningar och Affärsregler: anpassa (CONSTRAINTS.md)

- **Preferenspersistens**: Användarens valda geografiska områden, språk, format och organisationer sparas lokalt i webbläsaren.
- **Zod-scheman som kontrakt**: Scheman i `domain/schema.ts` validerar onboarding-data och filtertaggar deterministiskt.
- **Standardinställningar**: Alla filter initieras med säkra defaults om sparade taggar saknas.
- **Komponentisolering**: Guider (`OnboardingWizard`) och inställningspaneler kommunicerar endast via `useOnboardingState`.
- **Fasadspärr**: Ingen extern komponent får göra djupimport; all åtkomst sker via namngivna exporter i `index.ts`.
