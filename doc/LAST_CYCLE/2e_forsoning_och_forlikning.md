# Steg 2e: Försoning och förlikning (Syntes för TCK-012)

## Jämkning och syntes

Vi väljer syntesen från Gren B:
1. Vi harmoniserar `PreviewCard.tsx` med den solida klassen `bg-brand-accent hover:bg-brand-accent/90 text-white` vid aktivt tillstånd (`consentConfirmed === true`).
2. Vi bevarar dämpad stil (`bg-brand-ink/30 cursor-not-allowed opacity-60 text-white`) när villkoren inte är uppfyllda.
3. Den visuella presentationen förblir kristallklar för såväl admin som vanliga medlemmar.

**MÄTTNAD: JA**
