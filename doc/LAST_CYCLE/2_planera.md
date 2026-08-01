# Steg 2: Att planera

> [NÖDBROMS - KOPIERAS VID YTLIG ELLER INKOMPLETT DEBATT]:
> BESLUT: OMSTART. Rådsdebatten var teater, saknade konkreta kodreferenser eller hoppade över berörda domäner/filer. Börja om från 1_kartlagga.md.

## Den dialektiska rådsdebatten (Strategisk nivå)

### Att förändra (Tes / Kreativ fas)
Vi måste garantera fullständig tillståndsrenhet i applikationen. När användaren redigerar en undermodal skapas ett temporärt utkast. Om användaren avbryter genom att klicka på "Ångra" eller krysset måste alla utkastfält omedelbart och garanterat återställas till de godkända formulärvärdena. Vi utökar `useInvitationDialogs` med en explitit `closeDialog()` och `resetDialogBuffers()` metod som återställer alla temporära buffertar (`tempLocation`, `tempAreas`, `tempAudience`, `tempOrg`, `tempActivity`, `tempTime`, `tempPersonName`, `tempIsRecurring`, `tempHasReminder`, `tempReminderTime`) samt nollställer `activeDialog`.

### Att vända (Antites / Anpassande fas)
I nuläget anropar `CreateInvitationForm.tsx` (raderna 107, 121, 133, 145, 157, 173) direkt `setActiveDialog(null)` när `onClose` triggas. Dessutom skickas primära tillståndssättare som `setOrganizerPersonName`, `setIsRecurring`, `setHasReminder` och `setReminderTime` direkt in i `OrganizerDialog.tsx` och `TimeDialog.tsx`. Detta gör att ändringar i dessa fält slår igenom omedelbart i huvudtillståndet innan användaren ens tryckt på "Klar" eller "Spara"! För att lösa detta måste samtliga temporära tillstånd buffras i `useInvitationDialogs.ts` (67 rader) och endast överföras till formulärets huvudtillstånd vid explicita sparningsåtgärder (`onSave`).

### Att förlika (Syntes / Systemdomare)
Vi centraliserar all buffert- och återställningslogik till `useInvitationDialogs.ts`. Underkroken tar emot godkända formulärvärden och tillhandahåller `closeDialog()` som både återställer alla `temp*`-värden till de senaste godkända parametrarna och sätter `activeDialog` till `null`. Alla dialoger ansluts till `closeDialog()` för `onClose`. Enhetstester i `useInvitationDialogs.test.ts` ska skrivas TDD-först för att verifiera att avbrott nollställer alla temporära tillstånd.

## Bindande domstolsbeslut
BESLUT: GODKÄND
Motivering: Den strategiska planen säkerställer isolerad logik, komplett återställning vid avbrott och godkänd testtäckning enligt alla FSD- och processregler.
