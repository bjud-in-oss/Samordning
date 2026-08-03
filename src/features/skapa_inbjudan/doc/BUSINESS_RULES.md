# Business Rules: `skapa_inbjudan`

## Affärsregler för undermodaler
- Alla undermodaler (`TimeDialog`, `LocationDialog`, `ActivityDialog`, `AreaDialog`, `AudienceDialog`, `OrganizerDialog`) arbetar mot temporära utkastbuffertar.
- Avbryt eller stängning återställer alla utkast till senast godkända formulärvärden via `closeDialog()`.
- Endast vid explitit `onSave` sparas ändringarna till huvudtillståndet.
