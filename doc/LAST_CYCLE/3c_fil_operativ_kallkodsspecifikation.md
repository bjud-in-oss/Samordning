# Steg 3c: Fil-operativ Källkodsspecifikation

## Fullständig fillista för Steg 4 (Domän: anpassa)

1. **Enhetstest (TDD-fas före produktionskod)**:
   - `src/features/anpassa/hooks/__tests__/useOnboardingState.test.ts`: Verifierar stegnavigering, temaval, målgruppsurval och återställningslogik.

2. **Produktionskod (Domänlogik och Hooks)**:
   - `src/features/anpassa/hooks/useOnboardingState.ts`: Extraherar och hanterar guide- och inställningstillstånd (max 1 hook i UI).

3. **Produktionskod (UI och Fasad)**:
   - `src/features/anpassa/OnboardingWizard.tsx`: Refaktoriserad komponent som konsumerar `useOnboardingState`.
   - `src/features/anpassa/index.ts`: Exponerar `OnboardingWizard` och relevanta typer via domänfasaden.

BESLUT: GODKÄND
