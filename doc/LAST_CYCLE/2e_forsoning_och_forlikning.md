# Steg 2e: Försoning och Förlikning

- **Syntes mellan yttre krav och inre renhet**:
  - Yttre krav (dynamisk temastyrning för knappar och modaler) och inre krav (Habit-Hook-disciplin och FSD-isolering) möts i en tydlig arkitektur:
    1. CSS-variabler i `src/index.css` hanterar presentation och färgval.
    2. `ThemeSelectorSection.tsx` i `anpassa` tillhandahåller det interaktiva gränssnittet för att ändra `data-theme`.
    3. `useOnboardingState.ts` samlar guide- och inställningstillstånd.
    4. Domänfasaden `src/features/anpassa/index.ts` kapslar in implementationen.
