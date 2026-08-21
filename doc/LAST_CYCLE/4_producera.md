# Steg 4: Producera (Domäner: inbjudningar, anpassa)

- **Exekverade källkodsändringar och domänisolering**:
  1. `index.html`:
     - Uppdaterat `<title>` till `"Andlighet, Vänskap och Stöd"`.
  2. `src/components/AppHeader.tsx`:
     - Förankrat toppraden som fast (`sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-ink/10 shadow-xs`) så att den alltid är synlig vid scroll.
     - Texten `"Ta emot inbjudningar"` och switchen delar gemensam klickyta för smidig toggling.
  3. `src/features/inbjudningar/components/StreamFilterStatus.tsx`:
     - Visuell differentiering: Mjukt tonad bakgrund (`bg-brand-paper/90`) med vänsteraccentkant (`border-l-4 border-l-brand-accent rounded-3xl border border-brand-accent/25 shadow-xs`) för att tydligt skilja statuskortet från vanliga inbjudningskort.
     - När funktionen är AV: Döljer taggen `"AVISERINGAR AV"`, visar rubriken `"Välj att ta emot inbjudningar"` och förklarande text om anonymitet och tillgänglighet.
     - När funktionen är PÅ: Visar standardläge ("Tillgänglig i hela församlingens område") eller anpassat läge ("Dina valda områden") med synliga tags.
  4. `src/features/inbjudningar/ActiveStream.tsx`:
     - När funktionen är AV: Placerar förklaringskortet allra överst i flödet (Plats 1).
     - När funktionen är PÅ: Placerar statuskortet som kort 3 i listan (direkt efter de 2 första inbjudningskorten, index 2).
  5. `src/features/anpassa/OnboardingWizard.tsx`:
     - Panelrubrik satt till `"Anpassa din tillgänglighet"`.
     - Slutknapp uppdaterad till `"Spara val"`.
     - Visar en översta påminnelsebox när funktionen är avstängd: `"Slå på 'Ta emot inbjudningar' i toppfältet för att aktivera dina val."`.
  6. `src/features/inbjudningar/components/__tests__/StreamFilterStatus.test.tsx`:
     - Tester uppdaterade och verifierade mot nya layoutregler och borttagen tagg.

- **Verifiering**:
  - `compile_applet` och `npx vitest run` exekveras för att säkerställa 100% felfri TypeScript- och komponentkompilering.
