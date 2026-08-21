# Steg 4: Producera (Källkod och Tester för domänerna inbjudningar, anpassa, skapa_inbjudan)

- **Genomförda källkodsändringar**:
  1. `index.html`:
     - `<title>` är satt till `"Andlighet, Vänskap och Stöd"`.
  2. `src/components/AppHeader.tsx`:
     - Fast förankring längst upp med `sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-ink/10 shadow-xs`.
     - Texten `"Ta emot inbjudningar"` och switchen delar gemensam klickyta för direkt toggling.
  3. `src/features/inbjudningar/components/StreamFilterStatus.tsx`:
     - Mjuk pappersbakgrund (`bg-brand-paper/90 rounded-3xl p-6 border border-emerald-900/15 shadow-sm hover:border-emerald-900/30 hover:bg-brand-paper transition-all cursor-pointer`) utan hårda balkar.
     - Döljer den grå taggen `"AVISERINGAR AV"`.
     - Klick på kortet när inaktivt aktiverar automatiskt switchen till PÅ (`pushEnabled = true`) och fäller ut anpassningspanelen.
     - När aktivt: Presenterar församlingsöversikt eller anpassat val med områdesbrickor på exakt samma mjuka papperskort.
  4. `src/features/inbjudningar/ActiveStream.tsx`:
     - När funktionen är AV: Placerar förklaringskortet på Index 0 (Plats 1) i flödet.
     - När funktionen är PÅ: Placerar statuskortet på Index 2 (som kort 3 i listan, direkt efter de 2 första inbjudningskorten).
     - Skickar med `onEnablePush` så klick på kortet aktiverar läget.
  5. `src/features/anpassa/OnboardingWizard.tsx`:
     - Rubrik satt till `"Välj var du vill ta emot inbjudningar"` i elegant serif kursiv, utan stjärnikon.
     - Visar en aktiv aktiveringsknapp längst upp när switchen är avstängd: `"Slå på 'Ta emot inbjudningar'"` som omedelbart slår på funktionen via `onEnablePush`.
     - Gammal passiv påminnelsetext borttagen.
  6. `src/features/skapa_inbjudan/components/PreviewCard.tsx`:
     - Sista knappen ändrad från `"Publicera"` till `"Ge en inbjudan"`.
  7. `src/features/inbjudningar/ActiveStream.tsx` (Statusbadge):
     - Statusbricka satt till `"DIN INBJUDAN • FÖRBEREDS"` och undertext till `"Förbereds för utskick i församlingsområdet"`.
  8. `src/components/MainViewContent.tsx`:
     - Binder samman `handleEnablePush` med `ActiveStream` och `OnboardingWizard`.

- **Verifiering**:
  - `npm run verify` exekverat med 100% grönt resultat.
