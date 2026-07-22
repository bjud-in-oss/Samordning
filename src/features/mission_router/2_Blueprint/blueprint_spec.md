// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/2_Blueprint]

# Arkitekturspecifikation: Etapp 2 - Perfekt FSD Domänuppdelning och Slutgiltig Städning

## 1. FSD Domänstruktur och Arkitektur
För att säkerställa en strikt feature-sliced design (FSD) organisera vi hela källkoden under 5 renodlade domäner i `src/features/`:

1. **`src/features/inbjudningar/`**:
   - Ansvarar för visning av anslagstavlan, aktiva inbjudningar och anslagsdetaljer.
   - Filer: `ActiveStream.tsx`, `AlertDetail.tsx`, `Disclaimer.tsx`.

2. **`src/features/skapa_inbjudan/`**:
   - Ansvarar för skapande av nya inbjudningar, 5-raders mall och AI-tvätt / anonymisering.
   - Filer: `CreateInvitationForm.tsx`, `index.ts`.

3. **`src/features/anpassa/`**:
   - Ansvarar för profiler, geografiska områden, språk och målgruppsinställningar.
   - Filer: `OnboardingWizard.tsx`, `Step1Geography.tsx`, `Step2Language.tsx`, `Step3Organizations.tsx`, `Step4Formats.tsx`, `mapData.ts`.

4. **`src/features/sms_assistant/`**:
   - Ansvarar för SMS-mottagning, moderering och administratörskonsol.
   - Filer: `components/AdminConsole.tsx`, `domain/...`.

5. **`src/features/android_app/`**:
   - Ansvarar för PWA-tjänst och service worker-integration för Android/webb.
   - Filer: `pwaService.ts`.

---

## 2. Städning och Sanering
- Hela den gamla skräpmappen `src/features/mission_router/components/` (inklusive `onboarding/`) tas bort helt så att inga dubblerade eller föråldrade komponenter ligger kvar.
- Samtliga importer i `App.tsx`, `server.ts` samt interna komponenter justeras till de nya exakta domänvägarna.

---

## 3. Verifieringskontrakt
- Inga `import`-satser får referera till `src/features/mission_router/components/`.
- `tsc --noEmit` och `npm run lint` ska passera utan några kompilerings- eller typfel.
