# Steg 3a: Helhet, Orkestrering och Integration

## Dataflöde & Händelsekedja
1. **Öppning av panelen**: Användaren öppnar anpassningspanelen från förklaringskortet, snabblänken eller menyvalet.
2. **Rendering av panelen**:
   - Visar rubriken `"Välj var du vill ta emot inbjudningar"`.
   - Om `!pushEnabled`: Visar den aktiva knappen `"Slå på 'Ta emot inbjudningar'"` längst upp.
   - Om `pushEnabled`: Visar direkt områdesväljaren och kategorierna.
3. **Klick på aktiveringsknappen**:
   - Anropar `onEnablePush()` som sätter `pushEnabled = true`.
   - Vyn uppdateras direkt så att switchen i toppfältet och panelen visar aktivt läge.
4. **Spara**: Användaren klickar på `"Spara val"` och panelen stängs.
