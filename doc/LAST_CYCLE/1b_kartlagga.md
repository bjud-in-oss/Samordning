# Steg 1b: Kartlägga (Komponenter och Berörda Källkodsfiler)

## 1. Kartläggning av Källkodsfiler
1. `index.html`:
   - Ansvarar för webbläsartiteln och meta-taggar.
   - Ändring: `<title>` ändras från tidigare värden till `"Andlighet, Vänskap och Stöd"`.

2. `src/components/AppHeader.tsx`:
   - Ansvarar för appens fasta toppnavigering, switch och snabbknappar.
   - Ändring: Fast positionering `sticky top-0 z-50 bg-white/95 backdrop-blur-sm`, gemensam klickyta för texten `"Ta emot inbjudningar"` och switchen.

3. `src/features/inbjudningar/components/StreamFilterStatus.tsx`:
   - Ansvarar för tillstånds- och förklaringskortet.
   - Ändring: Mjuk pappersram (`border border-emerald-900/15 shadow-sm rounded-3xl` / `border border-brand-accent/25`) utan hård balk.
   - När AV: Döljer taggen `"AVISERINGAR AV"`. Vid klick anropas callback som både slår på switchen (`onEnablePush`) och öppnar anpassningspanelen (`onOpenSettings`).
   - När PÅ: Visar standardläge eller anpassat läge med områdesbrickor.

4. `src/features/inbjudningar/ActiveStream.tsx`:
   - Ansvarar för placeringen av inbjudningskort och statuskort i flödet.
   - Ändring:
     - När AV: Kortet placeras allra överst på Index 0 (Plats 1).
     - När PÅ: Kortet infogas på exakt Index 2 (som kort 3 i listan). Vid $< 2$ kort infogas det sist.

5. `src/features/anpassa/OnboardingWizard.tsx`:
   - Ansvarar för inställnings- och anpassningspanelen.
   - Ändring:
     - Rubrik: `"Välj var du vill ta emot inbjudningar"` utan stjärnikon (`Sparkles`).
     - Aktiv aktiveringsknapp: Om `pushEnabled === false` visas en framträdande klickbar knapp som slår på funktionen direkt via `onEnablePush`. Passiv påminnelsetext avlägsnas.

6. `src/features/skapa_inbjudan/components/CreateInvitationForm.tsx` & `src/features/skapa_inbjudan/components/QuickTemplateGrid.tsx`:
   - Ansvarar för formuläret för att skapa inbjudan.
   - Ändring: Sista knappen ändras från `"Publicera"` till `"Ge en inbjudan"`.

7. `src/features/inbjudningar/components/StreamCard.tsx` / `src/features/skapa_inbjudan/components/DraftBanner.tsx` / `src/features/inbjudningar/ActiveStream.tsx`:
   - Ansvarar för presentation av status på egna skapade inbjudningar.
   - Ändring: Statusbricka `"DIN INBJUDAN • FÖRBEREDS"`, undertext `"Förbereds för utskick i församlingsområdet"`.
