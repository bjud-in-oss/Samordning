# Steg 2b: Förändra Inåt - Arkitektur och Komponentansvar

## Arkitektur & Dataflöde
- `OnboardingWizardProps`:
  - `pushEnabled: boolean` – Indikerar om inbjudningar för närvarande är aktiverade.
  - `onEnablePush?: () => void` – Callback för att aktivera funktionen inifrån panelen.
  - `onSave: (tags: OnboardingTags) => void` – Callback för att spara gjorda områdesval.
  - `onClose: () => void` – Stänger panelen.
  - `initialTags?: OnboardingTags | null` – Initiala värden för områden och kategorier.

- `MainViewContent.tsx`:
  - Skickar med `onEnablePush` till `OnboardingWizard` så att switchen slås på sömlöst.
