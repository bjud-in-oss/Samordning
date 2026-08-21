# Steg 3a: Helhet, Orkestrering och Integration

## Dataflöde & Händelsekedja
1. **Header & Navigation**:
   - `AppHeader.tsx` håller switchen och texten `"Ta emot inbjudningar"` i ett gemensamt klickfält som triggar `onTogglePush`.
2. **Klick på Förklaringskort (AV)**:
   - Klick på kortet i `StreamFilterStatus.tsx` anropar en handler som anropar `onEnablePush()` och öppnar inställningspanelen.
3. **Flödesplacering**:
   - `ActiveStream.tsx` sorterar:
     - `!pushEnabled` $\rightarrow$ Förklaringskort (Index 0).
     - `pushEnabled` $\rightarrow$ 2 inbjudningar, Statuskort (Index 2), resterande inbjudningar.
4. **Inställningspanel**:
   - Om `!pushEnabled`, visar knappen `"Slå på 'Ta emot inbjudningar'"` som vid klick sätter `pushEnabled = true`.
5. **Skapa inbjudan & status**:
   - Formulärknapp: `"Ge en inbjudan"`.
   - Förberedelsebadge: `"DIN INBJUDAN • FÖRBEREDS"` och undertext `"Förbereds för utskick i församlingsområdet"`.
