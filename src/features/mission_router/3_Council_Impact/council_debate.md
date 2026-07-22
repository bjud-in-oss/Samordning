[CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/3_Council_Impact]

# Council Impact Debate: FSD Domänuppdelning i 5 Moduler

## Dialektisk analys

### The Innovator (Att förändra)
Genom att dela upp monoliten i 5 isolerade domäner (`inbjudningar`, `skapa_inbjudan`, `anpassa`, `sms_assistant`, `android_app`) skapar vi en extremt modulariserad och lättunderhållen arkitektur. Varje domän ansvarar helt för sin egen logik, sina egna komponenter och sine lokala hjälpfunktioner.

### The Reflector (Att vända)
Vid flytt av komponenter och hjälpfiler måste vi noggrant uppdatera alla relativsökvägar för importer i `App.tsx`, `server.ts` och de flyttade filerna själva så att varken klient- eller serverbyggen bryts.

### The Mediator (Att förlika)
Rådet godkänner uppdelningen. Vi behåller re-exporter i `mission_router` där det behövs för bakåtkompatibilitet samtidigt som vi direkt importerar de nya sökvägarna i `App.tsx` och `server.ts`.

---

## Architectural Synchronization & Impact Analysis

### Operativa filer och mappar som skapas/modifieras i 4_Produce:
1. **Nyskapade domänmappar**:
   - `src/features/inbjudningar/`
   - `src/features/skapa_inbjudan/`
   - `src/features/anpassa/`
   - `src/features/android_app/`
2. **Flyttade / strukturerade komponenter**:
   - `src/features/inbjudningar/ActiveStream.tsx`
   - `src/features/inbjudningar/AlertDetail.tsx`
   - `src/features/inbjudningar/Disclaimer.tsx`
   - `src/features/anpassa/OnboardingWizard.tsx`
   - `src/features/anpassa/Step1Geography.tsx`
   - `src/features/anpassa/Step2Language.tsx`
   - `src/features/anpassa/Step3Organizations.tsx`
   - `src/features/anpassa/Step4Formats.tsx`
   - `src/features/anpassa/mapData.ts`
   - `src/features/android_app/pwaConfig.ts`
3. **Uppdaterade huvudfiler**:
   - `src/App.tsx` (Uppdaterade importer från nya domäner)
   - `server.ts` (Uppdaterade importer för parser/push/supportAgent)

Rutning: Framåt till 4_Produce.
