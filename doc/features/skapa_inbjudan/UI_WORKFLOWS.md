# UI Workflows for Skapa Inbjudan

## Användarflöden
1. **Redigering i undermodaler**: När användaren öppnar en undermodal kopieras huvudtillståndet till temporära buffertar i `useInvitationDialogs`.
2. **Avbrott / Avbryt**: Klick på "Ångra" eller stängning triggar `closeDialog()` i `useInvitationDialogs` som återställer buffertarna och stänger dialogen utan att påverka huvudformuläret.
3. **Klar / Spara**: Klick på "Klar" eller "Spara" godkänner temporära värden och uppdaterar huvudformulärets tillstånd.
