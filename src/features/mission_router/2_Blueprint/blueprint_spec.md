[CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/2_Blueprint]

# Arkitekturspecifikation: Runda 1, 2, 3 & UI-renovering ("Industrial Clarity")

## Runda 1 ("Anpassa") - Permanenta beslut
1. **Skrotning av 4-stegs-steppern**: Stepper-navigation och kyrklig terminologi ersätts med en samlad, enkelsidig "Anpassa"-vy.
2. **Enkelsidig "Anpassa"-vy**: 4 symmetriska sektioner (Dina områden, Inbjudningar du vill se, Deltagandesätt, Språk).
3. **Reaktiv sparning**: Alla ändringar sparas automatiskt i `localStorage`.

---

## Runda 2 ("Bjud in andra") - Universell 5-raders mall
1. **Mallen**: Tid, Mötesplats (hybrid), Aktivitet, Bjud in från områden, Målgrupp ("Alla").
2. **Adaptiv hjälptext (`usage_count`)**: `usage_count < 3` eller tryck på `.?` visar hjälp parenteser.

---

## Runda 3 (Synkronisering & Backend-texttvätt)
1. **Central Backend-texttvätt**: Skalar bort instruktionsparenteser och hjälptaggar i backend.
2. **Symmetrisk SMS/QR Payload**: Innehåller de 5 mallfälten.

---

## UI-renovering ("Industrial Clarity" Layout, Toggle & FAB)
1. **Ren Header utan dubbla rubriker**:
   - Rubriken "Inbjudan till dig" överst.
   - Språkväljaren placeras längst upp i övre högra hörnet.
   - Ingen statusprick i toppheadern längre.

2. **Reaktiv Toggle för "Anpassa"**:
   - Klick på "Anpassa"-knappen togglar inställningspanelen reaktivt (`currentView === 'settings' ? 'stream' : 'settings'`).
   - När "Anpassa" är aktivt döljs flikrubriker och FAB.

3. **Flytande skaparknapp (FAB `+`)**:
   - Placerad i nedre högra hörnet (`fixed bottom-6 right-6 z-40`) i strömvy (`currentView === 'stream'` och `activeTab === 'stream'`).
   - Ett klick på `+` öppnar skaparvyn ("Bjud in andra").

4. **Tillbakapil (`← Tillbaka`)**:
   - Placerad i övre vänstra hörnet när man befinner sig i skaparvyn (`activeTab === 'create'`).
   - Klick på tillbakapilen återgår enkelt till strömvyn.

5. **Sidfots-statusprick i `Disclaimer.tsx`**:
   - Statuspricken (`isOnline`/`isSyncing`) flyttas från toppheadern ner till sidfoten i `Disclaimer.tsx`, placerad diskret intill Admin-knappen.
