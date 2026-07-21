[CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/2_Blueprint]

# Arkitekturspecifikation: Runda 1 ("Anpassa")

## Permanenta beslut
1. **Skrotning av 4-stegs-steppern**: 
   - Stepper-navigationen (Steg 1-4 med framåt/bakåt-knappar och numrerade cirklar/steg) och all kyrklig terminologi i användargränssnittet tas bort helt.
   - OnboardingWizard ersätts med en samlad, enkelsidig "Anpassa"-vy.

2. **Enkelsidig "Anpassa"-vy med 4 symmetriska sektioner**:
   - **Sektion 1: Dina områden**: Geografiskt val och begränsning av bevakningsområde via den befintliga kart- och områdeskomponenten.
   - **Sektion 2: Inbjudningar du vill se**: Filtrering på målgrupper (Alla, Barn & Familj, Ungdom 12–17, Unga Vuxna 18–35, Kvinnor, Män).
   - **Sektion 3: Deltagandesätt**: Tillgänglighets-switches och format (Fysiskt på plats, Via telefon/digitalt/distans för Kaskadnotiser Nivå 3, samt Andliga tankar).
   - **Sektion 4: Språk**: Lokaliseringsval för aviseringar (Svenska, Engelska, Spanska, Swahili, Vietnamesiska).

3. **Reaktiv sparning (SSOT)**:
   - Alla ändringar sparas reaktivt direkt i `localStorage` och triggar `onSave` via `useEffect` utan behov av extra "Spara"- eller "Nästa"-knappar.

4. **Typdefinitioner och Översättningar**:
   - `src/features/mission_router/types.ts` uppdateras för att inkludera profilfälten `areasOfInterest`, `targetGroups`, `allowDigital`, och `languages`.
   - `src/features/mission_router/translations.ts` utökas med de nya nycklarna för målgrupper och anpassningsvyer.
