# UI Workflows: `skapa_inbjudan`

## Användarflöde i dialoger
1. Öppna undermodal -> Kopierar huvudformulärets tillstånd till utkastbuffertar.
2. Redigera fält -> Uppdaterar endast utkastbuffertar.
3. Klicka "Ångra" / Stäng -> `closeDialog()` nollställer utkastbuffertar och stänger modalen.
4. Klicka "Klar" / Spara -> Skriver utkastet till huvudtillståndet och stänger modalen.
