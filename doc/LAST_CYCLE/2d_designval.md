# Steg 2d: Designval och Visuella Kontrakt

1. **Typografi**:
   - Rubrik: `<h1 className="text-2xl sm:text-3xl font-serif italic text-brand-ink font-normal">Välj var du vill ta emot inbjudningar</h1>`.
   - Underrubrik: `text-brand-ink/70 font-sans text-xs sm:text-sm leading-relaxed`.
2. **Aktiveringsknapp (`!pushEnabled`)**:
   - Text: `"Slå på 'Ta emot inbjudningar'"`
   - Handlingsindikation: `"Aktivera nu →"` med ikon `ArrowRight`.
   - Stil: Varm accentfärg (`bg-brand-accent`) med vit text, rundade hörn (`rounded-2xl`) och god klickyta för touch och muspekare.
3. **Färgregler**:
   - Alla färger använder `brand-*` för full överensstämmelse med `theme-consistency.test.ts`.
