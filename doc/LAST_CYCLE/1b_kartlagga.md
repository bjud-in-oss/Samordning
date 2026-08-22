# Steg 1b: Kartlägga (Befintlig Kodbas och Beroenden)

## 1. Nulägesanalys av berörda filer i domänen `anpassa`

### A. `src/features/anpassa/OnboardingWizard.tsx`
- **Nuläge**:
  - Vid `!pushEnabled` visas en gulaktig informationsruta med enbart text. Ingen direkt klickbar knapp för att slå på funktionen (`onEnablePush`).
  - Huvudrubriken har en `<Sparkles size={22} className="text-brand-accent shrink-0" />`-ikon och texten `"Anpassa din tillgänglighet"`.
  - Underrubriken är `"Välj vilka inbjudningar och notiser du vill ta del av. Alla ändringar sparas automatiskt."`.
  - Steg 1 har underrubriken `"Vilka områden brukar du träffa andra i?"`.
- **Mål**:
  - Översta sektionen vid `!pushEnabled`: Visa en tydlig, användarvänlig aktiveringsknapp med texten `"Slå på 'Ta emot inbjudningar'"` kopplad till `onEnablePush`.
  - Huvudrubrik: `"Anpassa din tillgänglighet"` utan stjärnikon (`Sparkles`).
  - Underrubrik: `"Ställ in var och för vem du vill vara tillgänglig. Du är anonym och kan ändra dig eller ta en paus när du vill."`.
  - Steg 1: Rubrik `"1. Dina områden"` och underrubrik `"Vilka områden brukar du träffa andra i eller erbjuda stöd i?"`.

### B. `src/features/anpassa/Step1Geography.tsx`
- **Nuläge**:
  - Vid icke-inline visning finns underrubriken `"Vilka områden brukar du träffa andra i?"`.
- **Mål**:
  - Uppdatera svensk text till `"Vilka områden brukar du träffa andra i eller erbjuda stöd i?"`.

### C. Tester och gränssnittsverifiering
- Skapa/uppdatera tester under `src/features/anpassa/components/__tests__/` och `src/features/anpassa/hooks/__tests__/` för att säkerställa att rubriker, knappar och texter renderas korrekt och kan klickas.
