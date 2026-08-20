# Steg 2c: Förändra Inåt (Tvingande Refaktorisering v8.7)

- **Inre arkitektur och Habit-Hooks i domänen `anpassa`**:
  - **Tillståndsseparering**: Bryta ut alla lokala tillstånd och lagringsoperationer från `OnboardingWizard.tsx` till en renodlad hook `src/features/anpassa/hooks/useOnboardingState.ts`. Detta sänker antalet hooks i UI-komponenten till exakt 1 hook, i full överensstämmelse med Habit-Hook-kravet (`<= 3` hooks).
  - **Fasad och gränssnitt**: Exponera uteslutande nödvändiga komponenter och hooks via domänens fasad `src/features/anpassa/index.ts`.
  - **Samlokaliserad domändokumentation**: Säkerställa att `src/features/anpassa/doc/` innehåller uppdaterade domänkontrakt, arkitekturbeskrivning och testspecifikationer.
