# Steg 1a: Orientering och Tillståndskontroll

- **Tillståndskontroll**: Processrevisor v8.8 är aktiverad med strikt domänisolering (max 1 domän per cykel).
- **Aktuell domän**: `skapa_inbjudan`
- **Avbrottsanalys och uppdrag**: Formuläret för att skapa inbjudningar behöver spara inbjudningar till datalagret på ett tillförlitligt sätt. Samtidigt ska alla identifierade avvikelser i domänen åtgärdas:
  1. Ersätta osäkra typbeskrivningar (`any`) med konkreta TypeScript-typer i `domain/types.ts`, `subhooks/useInvitationPublishing.ts` och `PostSubmissionStepper.tsx`.
  2. Åtgärda FSD-importavvikelser (t.ex. cross-domain-importer eller felaktiga relativa sökvägar) så att domänen förblir strikt inkapslad och följer arkitekturkraven.
  3. Säkerställa att asynkrona anrop och datalagring är separerade från UI-komponenter och orkestreras via domänens service-/hook-lager.

```json
{
  "status": "OK",
  "current_domain": "skapa_inbjudan",
  "next_step": "1b_kartlagga"
}
```
