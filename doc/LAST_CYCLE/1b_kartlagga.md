# Steg 1b: Kartlägga (Komponenter och Dataflöde för Anpassningspanelen)

## 1. Kartläggning av Källkodsfiler
1. `src/features/anpassa/OnboardingWizard.tsx`:
   - Panelkomponenten för val av geografiska områden, kategorier och språk/format.
   - Ändringar:
     - Header: Byt rubrik till `"Välj var du vill ta emot inbjudningar"`. Ta bort ikonen `<Sparkles ... />`.
     - Passiv påminnelse: Radera den gamla passiva rutan med texten `"Slå på 'Ta emot inbjudningar' i toppfältet för att aktivera dina val."`.
     - Aktiv aktiveringsknapp: Om `pushEnabled === false`, rendera en tydlig interaktiv knapp längst upp (`"Slå på 'Ta emot inbjudningar'"`) som triggar `onEnablePush()`.
     - Interface: Tillhandahåll `onEnablePush?: () => void` i `OnboardingWizardProps`.

2. `src/components/MainViewContent.tsx`:
   - Ansvarar för att rendera `OnboardingWizard` vid aktiv inställningsvy.
   - Koppling: Skickar med `onEnablePush` så att funktionen aktiveras direkt i förälderns tillstånd.

3. `src/features/anpassa/__tests__/OnboardingWizard.test.tsx`:
   - UI-interaktionstest som verifierar att knappen visas när funktionen är av, anropar callback vid klick, och döljs när funktionen är igång.
