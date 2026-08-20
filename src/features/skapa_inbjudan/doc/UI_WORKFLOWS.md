# UI Arbetsflöden: skapa_inbjudan

1. **Formulärinmatning**:
   - Användaren klickar på "Skapa inbjudan".
   - Väljer tid, plats, målgrupp och organisation via modala dialoger eller direkt inmatning.
   - Kan spara eller hämta förinställda val via favoritfältet.
2. **Publicering och persistens**:
   - Användaren granskar förhandsgranskningen i `PreviewCard`.
   - Klickar på "Publicera inbjudan".
   - Inbjudan sparas till datalagret.
3. **Efterpublicering**:
   - `PostSubmissionStepper` visar bekräftelse, integritetsgranskning och SMS-delningsknappar.
