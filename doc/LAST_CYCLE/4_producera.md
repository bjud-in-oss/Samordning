# Steg 4: Producera (Domäner: inbjudningar & skapa_inbjudan)

- **Exekverade källkodsändringar och domänisolering**:
  1. `src/components/AppHeader.tsx`:
     - Texten ändrad till `"Ta emot inbjudningar"`.
     - Switchen dockad direkt intill texten med en gemensam klickyta (`onTogglePush`) för direkt toggling.
     - Inställningskugghjulet behåller sin separata plats till höger för att öppna/stänga inställningar.
  2. `src/features/inbjudningar/components/StreamFilterStatus.tsx`:
     - Implementerat stöd för `pushEnabled: boolean`.
     - När funktionen är AV: Rubrik `"Välj att ta emot inbjudningar"` och brödtext `"Du ser direkt när någon behöver ditt stöd. Du är helt anonym och ingen kan se dina val eller begränsningar. Du kan när som helst välja var du vill vara tillgänglig."`.
     - När funktionen är PÅ:
       - Standardläge: Tagg `"Begränsa din tillgänglighet"`, Rubrik `"Tillgänglig i hela församlingens område"`, Brödtext `"Du tar emot inbjudningar från hela församlingsområdet. Klicka på kortet eller kugghjulet om du vill snäva av dina platser."`.
       - Anpassat läge: Tagg `"Anpassat urval"`, Rubrik `"Dina valda områden"`, Brödtext `"Du tar emot inbjudningar för dina valda platser i församlingsområdet."` med lista över valda områden.
  3. `src/features/inbjudningar/ActiveStream.tsx`:
     - Dynamisk placering: När `pushEnabled` är `true` infogas `StreamFilterStatus` på `min(4, filteredStream.length)` (position 5 vid $\ge 4$ inbjudningar).
     - När `pushEnabled` är `false` renderas den överst i flödet.
     - Uppdaterat statusbrickan på egna förslag till `"DIN INBJUDAN • FÖRBEREDS"` och undertexten till `"Förbereds för utskick i församlingsområdet"`.
  4. `src/features/skapa_inbjudan/components/PreviewCard.tsx`:
     - Uppdaterat knappen från `"Sänd"` / `"Publicera"` till `"Ge en inbjudan"`.

- **Verifiering**:
  - `npm run verify` och `compile_applet` exekveras för att säkerställa 100% felfri TypeScript- och arkitekturkompilering.
