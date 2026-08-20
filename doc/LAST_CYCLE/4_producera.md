# Steg 4: Producera (Domän: skapa_inbjudan)

- **Exekverade källkodsändringar och domänisolering**:
  1. `src/features/skapa_inbjudan/domain/types.ts`: Ersatte `any`-typer med konkreta datatyper och rena domänmodeller.
  2. `src/features/skapa_inbjudan/domain/publishService.ts`: Etablerade dedicerad servicemodul för publicering och förhandskontroller via Gemini/SMS utan direkta anrop i UI-vyerna.
  3. `src/features/skapa_inbjudan/domain/geocoder.ts` & `constants.ts`: Isolerade KML- och POI-matchning med FSD-rena fasadimporter.
  4. `src/features/skapa_inbjudan/hooks/useInvitationPublishing.ts`: Extraherade publiceringslogik och 4-stegsflöde.
  5. `src/features/skapa_inbjudan/hooks/useInvitationFavorites.ts`: Isolerade hantering av lokala favoritmallar.
  6. `src/features/skapa_inbjudan/hooks/useInvitationDialogs.ts`: Isolerade bufferttillstånd för alla formulärdialoger.
  7. `src/features/skapa_inbjudan/hooks/useInvitationForm.ts`: Sammanhållen fasadhook som orkestrerar dialoger, favoriter och publicering.
  8. `src/features/skapa_inbjudan/components/`: Flyttade och rensade dialogkomponenter (`AreaDialog`, `AudienceDialog`, `LocationDialog`, `OrganizerDialog`, `TimeDialog`, `ActivityDialog`), `PostSubmissionStepper`, `PreviewCard`, `FavoritesBar` och modaler med full FSD-efterlevnad.
  9. `src/features/skapa_inbjudan/CreateInvitationForm.tsx` & `index.ts`: Exponerar den fullt fungerande inbjudningsmotorn genom en strikt fasad.
  10. `src/features/skapa_inbjudan/hooks/useInvitationForm.test.ts` & `useInvitationPublishing.test.ts`: 100 % gröna enhetstester.

- **Status**: Bygget och samtliga 31 enhetstester passerar grönt.
