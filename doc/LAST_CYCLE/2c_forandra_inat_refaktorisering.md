# Steg 2c: Förändra Inåt - Refaktorisering

- **Strukturell refaktorisering**:
  1. `AppHeader.tsx`:
     - Omgruppera flex-behållaren: Vänster sida innehåller titeln och reglaget grupperade tillsammans med tight spacing (`gap-3`), medan höger sida behåller `Settings`-knappen och `+ Bjud in`-knappen.
  2. `StreamFilterStatus.tsx`:
     - Utöka interfacet `StreamFilterStatusProps` med `pushEnabled: boolean`.
     - Skapa två distinkta renderingsgrenar:
       - När `!pushEnabled`: Ett pedagogiskt kort ("Slå på aviseringar") som förklarar fördelen med notiser samt länk/knapp till inställningar för att filtrera områden/grupper.
       - När `pushEnabled`: Det aktiva filterkortet, med förenklad områdestext ("Alla områden aktiva") om alla Göteborgs områden är aktiverade eller om inget begränsat urval gjorts.
  3. `ActiveStream.tsx`:
     - Skicka med `pushEnabled` till `StreamFilterStatus`.
     - När `!pushEnabled`: Rendera `StreamFilterStatus` överst före inbjudningslistan.
     - När `pushEnabled`: Rendera `StreamFilterStatus` inskjutet efter 2 (eller 3) inbjudningskort, eller överst om det finns färre än 2 inbjudningar.
