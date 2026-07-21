[CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/3_Council_Impact]

# Council Impact Debate: Runda 1 & Runda 2

## Dialektisk analys för Runda 2 ("Bjud in andra")

### The Innovator (Att förändra)
Den universella 5-raders mallen standardiserar inbjudningsflödet dramatiskt. Genom att kombinera fysiska och digitala mötesplatser i ett enda hybridfält minskar vi friktionen för arrangören. Adaptiva hjälptexter (`.?` och `usage_count < 3`) stöttar nya användare utan att störa vana användare.

### The Reflector (Att vända)
Det är avgörande att texttvätten (`washAnnouncementText`) är 100% pålitlig så att inte interna instruktionstexter eller parenteser sipprar ut i publika push-notiser. Dessutom måste förvalda områden hämtas mjukt från `savedTags` utan att orsaka fel om `localStorage` saknar områdesdata.

### The Mediator (Att förlika)
Alla tre rådsmedlemmar enas om att 5-raders mallen tillsammans med automatisk texttvätt och adaptiv hjälp skapar en välbalanserad lösning. `usage_count` sparas i `localStorage` och räknas upp vid varje publicerad inbjudan.

## Operativa filer som modifieras i 4_Produce (Runda 2)
- `src/features/mission_router/types.ts`: Utökar typer med `usage_count` och fält för 5-raders mallen.
- `src/features/mission_router/translations.ts`: Lägger till översättningar för 5-raders mallen, hjälptexter och knappar.
- `src/features/mission_router/components/ActiveStream.tsx`: Implementerar den universella 5-raders mallen, adaptiv `.?`-hjälp, automatisk parentestvätt samt automatisk förifyllning av område från `localStorage`.

Rutning: Framåt till 4_Produce.
