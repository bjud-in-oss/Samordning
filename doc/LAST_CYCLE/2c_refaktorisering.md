# Steg 2c: Refaktorisering och Rensning

## 1. Rensa Passiva Element
- Ta bort all passiv påminnelsetext i `OnboardingWizard.tsx`.
- Ersätt stjärnikonen (`Sparkles`) framför rubriken med ren typografi.
- Implementera en tydlig primärknapp `Slå på 'Ta emot inbjudningar'` som direkt sätter `pushEnabled = true`.

## 2. Rensa Hårda Designbalkar
- Se till att alla statuskort använder mjuka pappersramar (`border-brand-accent/25 shadow-sm rounded-3xl`) och att inga hårdkodade otillåtna färger (t.ex. raw hex eller otillåtna namn) bryter mot CSS-temats regressionsvakt.
