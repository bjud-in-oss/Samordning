# 4_Produce: UI-renovering ("Industrial Clarity")

## Genomförda åtgärder
1. **Ren Header**:
   - Toppheadern förenklad med ren titel "Inbjudan till dig" och område.
   - Språkväljaren är placerad längst upp till höger.
   - Dubblerade flikrubriker och dubbla rubriktexter har tagits bort.

2. **Reaktiv Toggle på "Anpassa"**:
   - Klick på "Anpassa"-knappen växlar direkt mellan inställningsvyn och strömmen (`currentView === 'settings' ? 'stream' : 'settings'`).
   - När "Anpassa" visas döljs skaparknappen (FAB `+`) och flikrubriker.

3. **Flytande skaparknapp (FAB `+`)**:
   - Placerad längst ner till höger (`fixed bottom-6 right-6 z-40`) när man är i strömvyn.
   - Klick på `+` öppnar direkt "Bjud in andra"-formuläret.

4. **Tillbakapil (`← Tillbaka`)**:
   - Skaparvyn har en tydlig tillbakapil i övre vänstra hörnet som återgår till strömmen.

5. **Sidfots-statusprick i `Disclaimer.tsx`**:
   - Statuspricken för synkronisering och uppkoppling (`isOnline`/`isSyncing`) har flyttats från headern till sidfoten i `Disclaimer.tsx`, placerad diskret bredvid Admin-knappen.

6. **Fullständig kompilering verifierad utan några fel.**
