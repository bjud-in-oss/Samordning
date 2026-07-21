[CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/2_Blueprint]

# Arkitekturspecifikation: Runda 1, 2 & Synkronisering

## Runda 1 ("Anpassa") - Permanenta beslut
1. **Skrotning av 4-stegs-steppern**: Stepper-navigation och kyrklig terminologi ersätts med en samlad, enkelsidig "Anpassa"-vy.
2. **Enkelsidig "Anpassa"-vy**: 4 symmetriska sektioner (Dina områden, Inbjudningar du vill se, Deltagandesätt, Språk).
3. **Reaktiv sparning**: Alla ändringar sparas automatiskt i `localStorage`.

---

## Runda 2 ("Bjud in andra") - Universell 5-raders mall
1. **Mallen**:
   - Tid (När)
   - Mötesplats (Hybrid: Fysisk adress eller digital länk/telefon)
   - Aktivitet (Vad ska vi göra?)
   - Bjud in från områden (Vilka områden)
   - Målgrupp (Förvalt till "Alla")

2. **Adaptiv hjälptext (`usage_count`)**:
   - `usage_count < 3` visar instruktionsparenteser.
   - Växlas manuellt med `.?`.
   - `usage_count` sparas och stegras reaktivt med +1 i `localStorage` vid varje skapad/analyserad inbjudan.

---

## Runda 3 (Synkronisering av Parser, Backend-texttvätt & QR-payload)
1. **Central Backend-texttvätt (`washAnnouncementText`)**:
   - Implementerad och exporterad i `src/features/mission_router/domain/parser.ts`.
   - Anropas automatiskt i `server.ts` på all inkommande text (#WEBB, direct SMS, WhatsApp, API) före Gemini-analys, lagring och push-sändning. Eliminering av alla instruktionsparenteser `(...)` och hjälptaggar.

2. **Symmetrisk SMS- & QR-Payload**:
   - Innehåller de 5 mallnycklarna: `Tid`, `Mötesplats`, `Aktivitet`, `Bjud in från områden`, `Målgrupp` (samt `Avsändare` och `Kategori`).
   - `#WEBB`-mottagaren i `server.ts` parsas flexibelt rad-för-rad för att extrahera dessa nycklar med fallbacks.

3. **SMS-hjälpsvar (`.?` & `.mall`)**:
   - `.?` returnerar 5-raders mallen med hjälpinstruktioner och lista över gällande SMS-kommandon.
   - `.mall` returnerar den rena 5-raders mallen för direktkopiering.
