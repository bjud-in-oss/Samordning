# Steg 2e: Identifiera Risker och Gränsfall

1. **Tomt eller få inbjudningar ($N < 2$)**:
   - Om användaren har 0 eller 1 inbjudning ska statuskortet ändå placeras snyggt sist utan att orsaka indexfel eller trasiga listor.
2. **Klick på kortet när AV**:
   - Måste både aktivera `pushEnabled = true` och fälla ut inställningspanelen så att användaren direkt ser sina valda områden.
3. **Design- och CSS-regler**:
   - Alla färger ska strikt följa `brand-*` för att klara `theme-consistency.test.ts`.
