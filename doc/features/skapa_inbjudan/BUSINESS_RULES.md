# Business Rules for Skapa Inbjudan

## Publiceringsregler och validering
- Formuläret kräver giltig tid, plats, aktivitet, arrangör, målgrupp samt samtyckesbekräftelse innan publicering tillåts.

## Dialog- och utkastregler (Draft Reset)
- Alla undermodaler (`TimeDialog`, `LocationDialog`, `ActivityDialog`, `AreaDialog`, `AudienceDialog`, `OrganizerDialog`) kör mot temporära utkastbuffertar (`tempTime`, `tempLocation`, `tempActivity`, `tempAreas`, `tempAudience`, `tempOrg`, `tempPersonName`, `tempIsRecurring`, `tempHasReminder`, `tempReminderTime`).
- Vid stängning ("Ångra", avbrott eller stängning utan spara) anropas `closeDialog()` vilket nollställer samtliga utkastbuffertar till senast bekräftade formulärvärden.
- Endast vid explitit `onSave` godkänns utkastet och skrivs över till huvudtillståndet.
