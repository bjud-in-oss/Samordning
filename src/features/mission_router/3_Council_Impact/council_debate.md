// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/3_Council_Impact]

# Rådslagsdebatt & Synkroniserings-/Konsekvensanalys (Etapp 3)

## Rådslagsdebatt (Dialektisk analys)

### The Innovator (Att förändra)
> "Vi måste säkerställa att ingen missar en inbjudan eller gemenskap på grund av språksållning. Språkval i profilen ska representera användarens unika resurskapacitet (tolkning/översättning), inte ett exkluderande filter. Genom att ta bort språkspärren i `pushService.ts` och istället låta alla prenumeranter i området få notiser oavsett språk skapar vi en helt öppen och inkluderande matchningsmotor! Dessutom möjliggör vi Kaskadnotiser (Nivå 3 - Digitalt/Telefon) för brådskande behov."

### The Reflector (Att vända)
> "Vår struktur kräver strikt efterlevnad av kontrakt och FSD-gränser. När vi tar bort språkfiltret måste vi se till att vi inte skapar onödigt spammiga aviseringar, utan att områdes- och målgruppsmatchningen hålls knivskarp. Admin-konsolen måste verifieras så att inga gamla sökvägar eller brutna mallar ligger kvar. Alla ändringar i `server.ts` och `pushService.ts` ska vara bakåtkompatibla och rena."

### The Mediator (Att förlika)
> "Inskränkningar i språket skadar gemenskapen och strider mot principen om resursspegling. Vi tar definitivt bort språksållningen i `pushService.ts` så att alla volontärer i angivet område får avisering. Profilens språkval sparas som resursdata. För kaskadnotiser stödjer vi `allowDigital` och nivå 3 för brådskande utskick. Samtidigt uppdaterar vi `AdminConsole.tsx` och `server.ts` för fullständig symmetri med FSD-arkitekturen."

---

## Architectural Synchronization & Impact Analysis

### Operativa filer att modifiera i `4_Produce`:
1. `src/features/mission_router/domain/pushService.ts`:
   - Ta bort exkluderande språkfilter vid `triggerPushAlert`. Alla prenumeranter i matchande område får aviseringen oavsett språk.
   - Stödja eskalering/kaskadnotis (Nivå 3 / `allowDigital`) för brådskande förfrågningar.
2. `server.ts`:
   - Verifiera att `triggerPushAlert` och alla routes (`/api/incoming-sms`, `/api/subscription`, `/api/wash`) stämmer överens med den nya språkliga matchningsprincipen och 5-radersmallar.
3. `src/features/sms_assistant/components/AdminConsole.tsx`:
   - Uppdatera med snabbknappar och mallar för 5-raders inbjudningsformat och verifiera SMS-simuleringen.

### Beslut:
- **Route Forward**: Steg till `4_Produce` godkänt.
