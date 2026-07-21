# 4_Produce: Runda 2 ("Bjud in andra")

## Genomförda åtgärder
1. **Universell 5-raders mall**:
   - Implementerade den strukturerade 5-raders mallen för skapandet av inbjudningar i `ActiveStream.tsx`:
     1. Tid
     2. Mötesplats (Hybrid: stöder både fysisk plats och digital länk/telefon)
     3. Aktivitet
     4. Bjud in från områden (Hämtar automatiskt förvalda områden från användarens inställningar i `localStorage`)
     5. Målgrupp (Förvalt till "Alla")

2. **Adaptiv hjälptext (`usage_count`) & `.?` toggle**:
   - Nya användare (`usage_count < 3`) samt användare som aktiverar `.?` ser förklarande instruktionstexter inom parentes `(...)`.
   - Knappen `Visa hjälp ( .? )` / `Dölj hjälp ( .? )` tillåter manuell växling.
   - `usage_count` hålls uppdaterat och sparas i `localStorage` vid skapande av inbjudningar.

3. **Texttvätt vid utskick (`washAnnouncementText`)**:
   - Skapade helper-funktionen `washAnnouncementText` som automatiskt rensar ut alla parentes-instruktioner `(...)` och hjälptaggar före analys/publicering.

4. **Koden kompilera helt grönt utan byggfel.**
