[CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/3_Council_Impact]

# Council Impact Debate: UI-renovering ("Industrial Clarity")

## Dialektisk analys

### The Innovator (Att förändra)
Att introducera en flytande skaparknapp (FAB `+`) i nedre högra hörnet frigör värdefullt vertikalt utrymme i headern och städar bort dubblerade rubriker. En ren toppheader med "Inbjudan till dig" och en reaktiv "Anpassa"-toggle höjer den estetiska och funktionella precisionen avsevärt.

### The Reflector (Att vända)
Det är viktigt att tillbakapilen (`← Tillbaka`) i skaparvyn är tydlig och tillgänglig på alla skärmstorlekar så att användare aldrig fastnar i skaparvyn. Statuspricken i sidfoten måste behålla sin pulserande synkroniseringsanimation och färgas röd vid offlineläge.

### The Mediator (Att förlika)
Alla tre rådsmedlemmar enas om att förenklingen av layouten stämmer överens med "Industrial Clarity"-principen. Toppheadern förenklas, skaparflödet tillgängliggörs via FAB `+`, och statusindikatorn integreras snyggt i `Disclaimer.tsx`.

## Operativa filer som modifieras i 4_Produce
- `src/App.tsx`: Förenklar topp-header, lägger till FAB `+`, implementerar `Anpassa`-toggle och styr `activeTab`.
- `src/features/mission_router/components/Disclaimer.tsx`: Tar emot `isOnline` och `isSyncing` samt visar statuspricken bredvid Admin-länken.
- `src/features/mission_router/components/ActiveStream.tsx`: Tar emot `onBack` i `ActiveStreamProps` och visar en `← Tillbaka`-knapp i övre vänstra hörnet vid `inlineCreate`.

Rutning: Framåt till 4_Produce.
