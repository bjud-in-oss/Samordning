# Steg 2e: Identifiera Risker och Gränsfall

1. **Gränssnittsskydd mot förlorade props (ADR-011)**:
   - Alla existerande props i `OnboardingWizardProps` bibehålls intakta.
   - Nytt valfritt prop `onEnablePush?: () => void` läggs till utan att bryta existerande anrop.
2. **Klick när funktionen redan är aktiv**:
   - Knappen renderas endast villkorligt när `!pushEnabled`. När användaren klickar slås funktionen på och knappen fasas mjukt ut.
3. **Beteendedrivna tester (ADR-016)**:
   - Enhetstestet `OnboardingWizard.test.tsx` testar aktivt klick på knappen och att `onEnablePush` anropas.
