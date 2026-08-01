# Steg 3: Att designa

> [NÖDBROMS - KOPIERAS VID YTLIG ELLER INKOMPLETT DEBATT]:
> BESLUT: OMSTART. Rådsdebatten var teater, saknade konkreta kodreferenser eller hoppade över berörda domäner/filer. Börja om från 1_kartlagga.md.

## Den dialektiska rådsdebatten (Taktisk & Filnivå)

### Att förändra (Tes / Taktisk fas)
Vi behöver säkerställa att inga temporära ändringar någonsin ligger kvar när användaren stänger en dialog utan att spara. I `src/features/skapa_inbjudan/hooks/subhooks/useInvitationDialogs.ts` skapar vi en central funktion `closeDialog()` som omedelbart nollställer samtliga `temp*`-buffertar (`tempLocation`, `tempAreas`, `tempAudience`, `tempOrg`, `tempActivity`, `tempTime`, `tempPersonName`, `tempIsRecurring`, `tempHasReminder`, `tempReminderTime`) tillbaka till de bekräftade parametrarna samt sätter `activeDialog` till `null`. Samtidigt utökar vi enhetstesterna i `useInvitationDialogs.test.ts` med TDD för att testa avbrott och återställning av alla fält.

### Att vända (Antites / Anpassande fas)
I `CreateInvitationForm.tsx` (rad 107, 121, 133, 145, 157, 173) anropar alla dialoger för närvarande `onClose={() => form.setActiveDialog(null)}`. Detta innebär att om användaren öppnar `LocationDialog` eller `TimeDialog`, ändrar texten och sedan trycker på "Ångra", så nollställdes aldrig `tempLocation` eller `tempTime`. Dessutom skickades `setOrganizerPersonName`, `setIsRecurring`, `setHasReminder` och `setReminderTime` direkt in från `useInvitationForm.ts` till dialogkomponenterna, vilket muterade formulärets primära tillstånd omedelbart! Vi måste koppla dessa till `temp*`-buffertar i `useInvitationDialogs.ts` och ersätta `onClose={() => form.setActiveDialog(null)}` med `onClose={form.closeDialog}`.

### Att förlika (Syntes / Systemdomare)
Vi implementerar den isolerade återställningslogiken helt i `useInvitationDialogs.ts`. Alla utkastvärden hanteras som temporära buffertar. När `openDialog` anropas synkroniseras buffertarna med senast godkända värden. När `closeDialog` anropas rensas alla utkast och `activeDialog` sätts till `null`. Vid `onSave` godkänns buffertarna och skrivs till formulärets primära tillstånd.

## Operativ filaktionslista (src/)
1. `src/features/skapa_inbjudan/hooks/__tests__/useInvitationDialogs.test.ts` (28 rader)
   - *Åtgärd*: Utöka med TDD enhetstester som simulerar redigering av temporära buffertar (`tempLocation`, `tempTime`, `tempOrg`, `tempPersonName`, `tempIsRecurring` etc.) och bekräftar att anrop till `closeDialog()` återställer alla fält till ursprungliga godkända värden.
2. `src/features/skapa_inbjudan/hooks/subhooks/useInvitationDialogs.ts` (67 rader)
   - *Åtgärd*: Lägg till alla saknade temporära buffertar (`tempPersonName`, `tempIsRecurring`, `tempHasReminder`, `tempReminderTime`). Implementera `resetDialogBuffers()` och `closeDialog()`.
3. `src/features/skapa_inbjudan/hooks/useInvitationForm.ts` (185 rader)
   - *Åtgärd*: Passera de nya parametrarna (`organizerPersonName`, `isRecurring`, `hasReminder`, `reminderTime`) till `useInvitationDialogs` och exponera `closeDialog` samt temporära buffertar.
4. `src/features/skapa_inbjudan/CreateInvitationForm.tsx` (226 rader)
   - *Åtgärd*: Ändra `onClose` för alla dialoger att anropa `form.closeDialog()`. Passera `tempPersonName`, `tempIsRecurring`, `tempHasReminder`, `tempReminderTime` till `OrganizerDialog` och `TimeDialog` så att primärtillståndet inte muteras vid avbrott.
5. `src/features/skapa_inbjudan/components/dialogs/TimeDialog.tsx` (134 rader) & `OrganizerDialog.tsx` (106 rader)
   - *Åtgärd*: Ändra props till att ta emot temporära tillståndssättare för att garantera isolering vid avbrott.

## Bindande domstolsbeslut
BESLUT: GODKÄND
Motivering: Den taktiska ritningen täcker alla filer i kedjan, isolerar logiken i underkrokar och säkerställer strikt TDD-exekvering.
