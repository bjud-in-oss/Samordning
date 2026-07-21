[CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/3_Council_Impact]

# Council Impact Debate: Total sanering av sikt & begränsningar

## Dialektisk analys

### The Innovator (Att förändra)
Genom att kasta ut föråldrade begrepp som "primärt bevakningsområde" och "begränsa övriga notiser" skapar vi ett extremt rent och opretentiöst gränssnitt. Frågan "Vilka områden brukar du träffa andra i?" är varm, inkluderande och intuitiv för alla användare.

### The Reflector (Att vända)
Vi måste garantera att befintliga `localStorage`-datastrukturer inte kraschar när `limitAreas`-togglen tas bort. När användaren väljer sina områden bör listan synkas direkt till `areas` och `limitedAreas` i bakgrunden så att äldre parsers eller backend-filter fortfarande fungerar friktionsfritt.

### The Mediator (Att förlika)
Rådet enas om att rensa bort all exkluderande terminologi och förenkla Sektion 1 till en ren och direkt valyta.

---

## Architectural Synchronization & Impact Analysis

### Operativa filer som modifieras i 4_Produce:
- `src/features/mission_router/components/onboarding/OnboardingWizard.tsx`:
  - Uppdaterar Sektion 1 rubrik och beskrivning till:
    - Rubrik: `1. Dina områden`
    - Fråga: `Vilka områden brukar du träffa andra i?`
  - Tar bort gamla beskrivningstexter om primära/begränsade områden.
- `src/features/mission_router/components/onboarding/Step1Geography.tsx`:
  - Tar bort kryssrutan "Begränsa övriga notiser" och separata dolda underrutor.
  - Gör alla områdeskort till direkt klickbara flerval/flera val.
  - Rensar bort ord som "primärt", "bevakning" och "begränsade områden".
- `src/features/mission_router/translations.ts`:
  - Städar bort föråldrade nycklar och uppdaterar svenska och engelska etiketter för områdesval.

Rutning: Framåt till 4_Produce.
