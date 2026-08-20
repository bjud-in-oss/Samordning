# Steg 3a: Helhet, Orkestrering och Integration

- **Orkestrering och gränssnitt för domänen `skapa_inbjudan`**:
  - `CreateInvitationForm.tsx` utgör huvudvyn för att samla in uppgifter om ny inbjudan (tid, plats, område, målgrupp, aktivitet, arrangör).
  - Formuläret delegerar tillståndshantering till `useInvitationForm.ts` som i sin tur orkestrerar delhooks för dialoger, favoriter och publicering.
  - Publiceringslogiken i `useInvitationPublishing.ts` sparar den nya inbjudan till backend (`/api/alerts`) och synkroniserar med lokal tillståndshantering.
  - Efter slutförd publicering visas `PostSubmissionStepper.tsx` med AI-granskning, integritetsinformation, QR-kod och SMS-delningslänkar.
  - Integrationen mot omvärlden sker uteslutande via domänfasaden `src/features/skapa_inbjudan/index.ts`.
