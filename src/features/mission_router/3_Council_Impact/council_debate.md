[CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/3_Council_Impact]

# Council Impact Debate: Synkronisering & Backend-texttvätt

## Dialektisk analys

### The Innovator (Att förändra)
Genom att placera den centrala texttvättfunktionen (`washAnnouncementText`) i backend säkras alla inkommande kanaler (Webb-GUI, QR-SMS, WhatsApp och API). Alla hjälpinstrutioner skalas bort oavsett källa. `usage_count` hålls i sync i klientens `localStorage` och räknas upp vid varje tillfälle som en användare skapar en inbjudan.

### The Reflector (Att vända)
Det är ytterst viktigt att regex-parsing av `#WEBB` i `server.ts` inte bryts om användaren modifierar ordningsföljden på raderna eller skickar med extra blankrader. Rad-för-rad nyckel-värde extraction gör parsningen skottsäker.

### The Mediator (Att förlika)
Alla tre rådsmedlemmar godkänner arkitektursynkroniseringen. Systemet är nu helt symmetriskt mellan klient och backend.

## Operativa filer som modifieras i 4_Produce
- `src/features/mission_router/domain/parser.ts`: Exporterar `washAnnouncementText` och integrerar tvättning i `runGeminiWash` och `runFallbackWash`.
- `server.ts`: Importerar `washAnnouncementText`, uppdaterar `#WEBB`-mottagaren, `.mall` och `.?`-kommandona.
- `src/features/mission_router/components/ActiveStream.tsx`: Säkerställer att `smsPayload` och QR-kod har alla 5 mallnycklarna, samt att `usage_count` stegras i `localStorage`.

Rutning: Framåt till 4_Produce.
