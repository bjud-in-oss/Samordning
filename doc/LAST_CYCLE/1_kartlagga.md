# Steg 1: Att kartlägga

### Påverkade domäner
- `skapa_inbjudan`

### Empirisk inventering
- **Mål**: Fullständig tillståndsåterställning i alla undermodaler (`LocationDialog`, `AreaDialog`, `TimeDialog`, `ActivityDialog`, `AudienceDialog`, `OrganizerDialog`) när användaren avbryter eller stänger utan att spara.
- **Användarbehov & UX-krav**:
  1. När en undermodal stängs via "Ångra", kryssknapp eller avbrott ska alla temporära fält/tillstånd nollställas till senast godkända värden.
  2. Om användaren öppnar samma eller en annan dialog igen ska inga osprade utkast (drafts) finnas kvar.
  3. Tillståndshanteringen för återställning ska ligga isolerad i underkroken `useInvitationDialogs.ts` utan att skräpa ner UI-komponenter.
- **Källkodsfiler & Radantal**:
  - `src/features/skapa_inbjudan/hooks/subhooks/useInvitationDialogs.ts` (67 rader) - Tillståndskrok för dialoger och buffertar.
  - `src/features/skapa_inbjudan/hooks/__tests__/useInvitationDialogs.test.ts` (28 rader) - Enhetstester för dialogkrok.
  - `src/features/skapa_inbjudan/hooks/useInvitationForm.ts` (185 rader) - Facadekrok för formuläret.
  - `src/features/skapa_inbjudan/CreateInvitationForm.tsx` (226 rader) - Formulärkomponent och dialogstängare.
  - `src/features/skapa_inbjudan/components/dialogs/TimeDialog.tsx` (134 rader)
  - `src/features/skapa_inbjudan/components/dialogs/LocationDialog.tsx` (104 rader)
  - `src/features/skapa_inbjudan/components/dialogs/OrganizerDialog.tsx` (106 rader)
  - `src/features/skapa_inbjudan/components/dialogs/ActivityDialog.tsx` (76 rader)
  - `src/features/skapa_inbjudan/components/dialogs/AreaDialog.tsx` (82 rader)
  - `src/features/skapa_inbjudan/components/dialogs/AudienceDialog.tsx` (84 rader)
- **Fraktala dokumentationsfiler**:
  - `doc/features/skapa_inbjudan/INDEX.md`
  - `doc/features/skapa_inbjudan/BUSINESS_RULES.md`
  - `doc/features/skapa_inbjudan/UI_WORKFLOWS.md`
  - `doc/features/skapa_inbjudan/INTEGRATIONS.md`
