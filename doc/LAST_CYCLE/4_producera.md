# Steg 4: Producera

- **Exekverade källkodsändringar (Domän: anpassa)**:
  1. `src/features/anpassa/hooks/__tests__/useOnboardingState.test.ts`: Enhetstester skapade och verifierade gröna före och efter integration.
  2. `src/features/anpassa/hooks/useOnboardingState.ts`: Extraherade och isolerade all tillstånds- och sidoeffektslogik från `OnboardingWizard`.
  3. `src/features/anpassa/OnboardingWizard.tsx`: Refaktoriserade till en ren presentationskomponent som konsumerar `useOnboardingState` (1 hook, uppfyller Habit-Hook `<= 3` krav).
  4. `src/features/anpassa/index.ts`: Exponerar `OnboardingWizard` och `useOnboardingState` i den publika domänbarriären.

- **Status**: Alla 4 enhetstester körda med 100 % passering i vitest.
