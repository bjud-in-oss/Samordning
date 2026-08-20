# Steg 2c: Förändra Inåt (Tvingande Refaktorisering v8.8)

- **Inre arkitektur och sanering av domänen `skapa_inbjudan`**:
  - **Typdisciplin**:
    - Ersätta all användning av `any` i `domain/types.ts`, `hooks/subhooks/useInvitationPublishing.ts` och `components/PostSubmissionStepper.tsx` med strikta TypeScript-interface (`SavedUserTags`, `InvitationPublishPayload`, `SubmissionResult`).
  - **Asynkron isolering och Habit-Hooks**:
    - Flytta eventuell direkt datakommunikation i `PostSubmissionStepper.tsx` till domänens hook-/servicelager så att UI-komponenter förblir rena och reaktiva.
  - **FSD-importsanering**:
    - Säkerställa att alla importer till delade moduler sker via `@shared` eller `../../shared/` utan orena bakåtkliv, och att domäninterna importer använder renodlade lokala sökvägar.
  - **Datalagring och persistens**:
    - Validera och stärka logiken i `useInvitationPublishing.ts` för att säkerställa att den skapade inbjudan alltid sparas komplett i både lokal och synkroniserad lagring.
