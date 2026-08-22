# Steg 2c: Förändra Inåt - Refaktorisering

## Refaktorisering och Arkitekturkontroll

1. **Inga onödiga gränssnittsförändringar**:
   - `OnboardingWizardProps` och `Step1GeographyProps` bibehåller alla nödvändiga callbacks (`onEnablePush`, `onDisablePush`, `onSave`, `onClose`).
   - Inga props tas bort eller ändras.

2. **Strikt FSD-isolering**:
   - Samtliga ändringar är strikt avgränsade till domänen `src/features/anpassa/`.
