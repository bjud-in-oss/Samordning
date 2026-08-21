# Steg 4: Producera (Domäner: inbjudningar, anpassa)

- **Exekverade källkodsändringar och domänisolering**:
  1. `src/features/inbjudningar/components/StreamFilterStatus.tsx`:
     - Borttagen hård vänsterbalk (`border-l-4`).
     - Tillståndskortet försett med mjuk varm papperston (`bg-brand-paper/90`) och en tunn, mjuk ram runt hela kortet (`border border-emerald-900/15 shadow-sm rounded-3xl`).
     - När funktionen är AV: Döljer taggen `"AVISERINGAR AV"`, visar rubriken `"Välj att ta emot inbjudningar"` samt förklarande text.
     - När funktionen är PÅ: Visar standardläge ("Tillgänglig i hela församlingens område") eller anpassat läge ("Dina valda områden") med synliga tags.
  2. `src/features/inbjudningar/ActiveStream.tsx`:
     - När funktionen är AV: Placerar förklaringskortet allra överst i flödet (Index 0 / Plats 1).
     - När funktionen är PÅ: Infogar statuskortet på exakt Index 2 (som kort 3 i listan, direkt efter de 2 första inbjudningskorten). Om antalet inbjudningar $N < 2$, läggs kortet sist efter alla inbjudningar.
  3. `src/features/anpassa/OnboardingWizard.tsx`:
     - Renderar överst en tydlig, harmonisk påminnelsebox när funktionen är avstängd (`pushEnabled === false`):
       `"Slå på 'Ta emot inbjudningar' i toppfältet för att aktivera dina val."` med mjuk ram (`border-emerald-900/15`).
     - Panelrubrik är `"Anpassa din tillgänglighet"` och slutknapp är `"Spara val"`.
  4. `src/features/inbjudningar/components/__tests__/StreamFilterStatus.test.tsx`:
     - Verifierat och grönt för alla tillstånd.

- **Verifiering**:
  - `npx vitest run` & `compile_applet` exekveras för komplett kvalitetssäkring.
