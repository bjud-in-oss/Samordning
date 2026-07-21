[CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/2_Blueprint]

# Arkitekturspecifikation: Runda 1 ("Anpassa") & Runda 2 ("Bjud in andra")

## Runda 1 ("Anpassa") - Permanenta beslut
1. **Skrotning av 4-stegs-steppern**: 
   - Stepper-navigationen och all kyrklig terminologi i användargränssnittet tas bort helt.
   - OnboardingWizard ersätts med en samlad, enkelsidig "Anpassa"-vy.

2. **Enkelsidig "Anpassa"-vy med 4 symmetriska sektioner**:
   - **Sektion 1: Dina områden**: Geografiskt val och begränsning av bevakningsområde.
   - **Sektion 2: Inbjudningar du vill se**: Målgrupper (Alla, Barn & Familj, Ungdom 12–17, Unga Vuxna 18–35, Kvinnor, Män).
   - **Sektion 3: Deltagandesätt**: Fysiskt på plats, telefon/digitalt/distans (Kaskadnotiser Nivå 3), Andliga tankar.
   - **Sektion 4: Språk**: Lokaliseringsval (Svenska, Engelska, Spanska, Swahili, Vietnamesiska).

3. **Reaktiv sparning (SSOT)**:
   - Ändringar sparas reaktivt direkt i `localStorage`.

---

## Runda 2 ("Bjud in andra") - Permanenta beslut (Universell 5-raders mall)
1. **Universell 5-raders mall**:
   Skapandet av inbjudningar bygger på den strukturerade 5-raders mallen:
   - **Tid**: När ses vi? (t.ex. "Idag kl 18:00")
   - **Mötesplats**: Var ses vi? (Hybrid: stöder både fysisk adress/plats och digital länk/telefonnummer i samma fält)
   - **Aktivitet**: Vad ska vi göra? (Kort beskrivning av samvaro eller stöd)
   - **Bjud in från områden**: Vilka områden ska få inbjudan? (Förvalt från användarens valda områden i `localStorage`)
   - **Målgrupp**: Vilka får inbjudan? (Förvalt till "Alla")

2. **Adaptiv hjälptext (`usage_count`)**:
   - För nya användare (`usage_count < 3`) visas förklarande parenteser med instruktioner i formuläret.
   - Hjälptext fälls ut eller döljs vid tryck/inmatning av `.?`.
   - `usage_count` sparas och räknas upp i `localStorage` varje gång en inbjudan publiceras.

3. **Texttvätt vid utskick (`washAnnouncementText`)**:
   - Innan inbjudan publiceras rensas alla instruktioner inom parentes `(...)` samt hjälptaggar bort via en automatisk tvättfunktion så att endast den rena texten skickas ut i notisen.

4. **Förvalda områden**:
   - Förvalt område hämtas automatiskt från användarens sparade områden i `localStorage` (t.ex. `savedTags.primaryArea` eller `savedTags.limitedAreas`).
