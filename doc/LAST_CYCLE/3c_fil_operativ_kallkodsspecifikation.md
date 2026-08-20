# Steg 3c: Fil-operativ Källkodsspecifikation

## Fullständig fillista för Steg 4 (Domän: inbjudningar & toppfält)

1. `src/components/AppHeader.tsx`:
   - Justera layouten så att på/av-reglaget dockar an direkt intill "Se dina inbjudningar" på vänster sida.
   - Inställningsknappen och "Bjud in"-knappen bibehåller sin exakta position på höger sida.

2. `src/features/inbjudningar/components/StreamFilterStatus.tsx`:
   - Stöd för `pushEnabled: boolean`.
   - När `!pushEnabled`: Visa förklaringskort med uppmaning att aktivera aviseringar och anpassa preferenser.
   - När `pushEnabled`: Visa aktivt filter med förenklad områdestext ("Alla områden aktiva").

3. `src/features/inbjudningar/ActiveStream.tsx`:
   - Placera `StreamFilterStatus` överst när `!pushEnabled`.
   - Placera `StreamFilterStatus` nedsänkt (efter kort 2 eller 3) när `pushEnabled` är sant.

4. `src/features/inbjudningar/components/__tests__/StreamFilterStatus.test.tsx` (eller hook/render-test):
   - Säkerställ testtäckning för visningslägen och textförenkling.

BESLUT: GODKÄND
