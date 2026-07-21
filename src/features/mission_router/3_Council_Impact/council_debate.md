[CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/3_Council_Impact]

# Council Impact Debate: Runda 1 ("Anpassa")

## Dialektisk analys

### The Innovator (Att förändra)
Att ersätta den tidigare linjära 4-stegsguiden med en samlad, enkelsidig "Anpassa"-vy reducerar kognitiv friktion markant. Användaren får omedelbar överblick över sina inställningar och kan justera val i valfri ordning. Reaktiv sparning gör att ändringar träder i kraft direkt utan extra bekräftelsesteg.

### The Reflector (Att vända)
Det är avgörande att behålla bakåtkompatibilitet för befintliga `savedTags` i `localStorage` så att användare inte förlorar sina valda geografiska områden eller språk vid uppdateringen. De nya fälten (`areasOfInterest`, `targetGroups`, `allowDigital`, `languages`) måste ha robusta fallbacks.

### The Mediator (Att förlika)
Alla tre rådsmedlemmar enas om att den enkelsidiga "Anpassa"-vyn ger en renare och mer lättillgänglig upplevelse. De 4 sektionerna struktureras symmetriskt i välavgränsade kort-element med tydlig typografi och reaktiv tillstånds-hantering.

## Operativa filer som modifieras i 4_Produce
- `src/features/mission_router/types.ts`: Lägger till de nya fälten `areasOfInterest`, `targetGroups`, `allowDigital` i `SubscriptionRecord['tags']`.
- `src/features/mission_router/translations.ts`: Lägger till översättningsnycklar för målgrupper och inställningssektioner.
- `src/features/mission_router/components/onboarding/OnboardingWizard.tsx`: Bygger om till den samlade enkelsidiga "Anpassa"-vyn.

Rutning: Framåt till 4_Produce.
