# Domän: skapa_inbjudan

Domänen `skapa_inbjudan` äger hela flödet för att skapa, förhandsgranska och publicera nya lokala inbjudningar i Göteborg.

## Huvudkomponenter
1. `CreateInvitationForm.tsx`: Huvudformulär med fält för tid, plats, arrangör och målgrupp.
2. `useInvitationForm.ts`: Samordnar formulärets delhooks.
3. `PostSubmissionStepper.tsx`: Stegvis återkoppling efter inskickad inbjudan.
4. `dialogs/`: Modala valfönster för snabb inmatning.
