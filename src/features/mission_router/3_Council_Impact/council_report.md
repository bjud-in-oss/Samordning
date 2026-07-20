[CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/3_Council_Impact]

# 1_Scan
- Kontrollerade `src/features/mission_router/components/Disclaimer.tsx`. Den innehåller en lång `DISCLAIMERS`-dictionary.
- Kontrollerade `src/App.tsx`. Där skickas enbart prop `uiLanguage={uiLanguage || "sv"}` till `<Disclaimer />`.

# 2_Blueprint
- Komponent `Disclaimer` utökas med ny prop `onShowIntro: () => void`.
- Texterna i `DISCLAIMERS` kortas ner till den korta frasen "Detta är en fristående, inofficiell tjänst...".
- Ny dictionary `READ_MORE` läggs till för knappen "Läs mer om integritet" / "Read more about privacy".
- Rendera knappen direkt under p-taggen i `Disclaimer.tsx` med `<button onClick={onShowIntro} className="underline opacity-70 hover:opacity-100 transition-opacity">...`.
- I `App.tsx` (rad 529), skicka in `onShowIntro={() => setHasAcceptedIntro(false)}` till `<Disclaimer />`. Denna state-förändring kommer trigga att introskärmen visas istället för huvudvyn (tack vare uppdateringen i den föregående cykeln).

# 3_Council_Impact
- **Innovator (Att förändra)**: Att återanvända introskärmen är ett fantastiskt UX-mönster. Det minskar visuell skräp i sidfoten och maximerar det centrala gränssnittet. Knappen ska vara extremt diskret, gärna `font-serif` eller `font-mono` med låg opacitet, så att vi inte skapar brus.
- **Reflector (Att vända)**: Se till att vi inte krossar andra vyer, men i detta fall är `hasAcceptedIntro` en global spärr för hela DOM-visningen (rad 304). Om vi sätter `false` döljs App.tsx huvudflöde, vilket är exakt det vi vill. Se till att vi har översättningarna för de 5 språken på plats!
- **Mediator (Att förlika)**: Vi är helt synkade. 
  Filer att redigera: 
  - `src/features/mission_router/components/Disclaimer.tsx`: Lägg till prop, korta ned text, lägg till knapp.
  - `src/App.tsx`: Lägg till `onShowIntro` på komponenten.

Blueprint är därmed fastställd och granskad.

VÄLJ EN PROCESSÅTGÄRD:
- Godkänn och fortsätt till 4_Produce.
- Kör ULTRATHINK.
