# Arkitekturbeslut (ADR) – Huvudlogg

## ADR-001: Feature-Sliced Design & Publika API-gränser
- **Status**: Godkänd & Tillämpas
- **Kontext**: För att eliminera stark sammankoppling och förhindra avvikelser i kontrakt mellan domäner organiseras all domänlogik och alla komponenter under `src/features/[domännamn]/`.
- **Beslut**: Varje domän MÅSTE exponera sina publika förmågor strikt via `src/features/[domännamn]/index.ts`. Direkt djupimport till en annan domäns undermappar är strikt förbjudet.
- **Skivor (Slices)**:
  1. Visuell/UI-skiva (`components/`)
  2. Domän/Logik-skiva (`hooks/`, `domain/`)
  3. Test-skiva (`__tests__/`)
  4. Integration/Gateway-skiva (`api/`, `pwaService.ts`)
  5. Innehåll/i18n-skiva (`translations.ts`, `constants.ts`)
  6. Dokumentationsskiva (`doc/*.md`)

## ADR-002: Tillståndslös exekvering & RAM-baserad minnesarkitektur
- **Status**: Godkänd & Tillämpas
- **Kontext**: Node.js-behållarens körtid fungerar i en isolerad och tillståndslös miljö.
- **Beslut**: Inga personuppgifter, sessions-tokens eller Puppeteer-autentiseringsfiler (`.wwebjs_auth`) får skrivas till disk. Allt körtidstillstånd förlitar sig uteslutande på RAM-minne eller säkra, permanenta Firestore-backends.

## ADR-003: Kontraktsdriven verifiering & Förkontroller
- **Status**: Godkänd & Tillämpas
- **Kontext**: Säkerställer 100 % typsäkerhet och hög testtillförlitlighet under byggfasen.
- **Beslut**: Typkontroll (`tsc --noEmit`) och linting måste gå igenom innan en utvecklingscykel slutförs. Alla domängränssnitt måste frysas i `domain/types.ts`.

## ADR-004: FSD-lagerseparering & Delad infrastruktur
- **Status**: Godkänd & Tillämpas
- **Kontext**: Icke-UI-infrastruktur, delad kartdata, i18n-ordböcker och rena Node-tjänster blandades tidigare inuti domänmappar.
- **Beslut**: Etablerat en strikt 3-skikts FSD-hierarki:
  1. `src/shared/`: Klientsäkra delade domäntyper, kartdata, i18n-ordböcker och PWA-verktyg bakom `src/shared/index.ts`.
  2. `src/main/services/`: Rena serverinfrastrukturtjänster (`pushService.ts`, `parser.ts`) inkapslade enbart för backend-exekvering.
  3. `src/features/`: Rena UI-domänskivor som exporterar sin funktion strikt via `index.ts`.

## ADR-005: Max 250 rader & Automatisk moduluppdelning
- **Status**: Godkänd & Tillämpas
- **Kontext**: Stora källkodsfiler leder till kognitiv överbelastning, försämrad läsbarhet och token-slöseri vid AI-redigering.
- **Beslut**: Ingen fil i `src/` får överskrida 250 rader kod. Om gränsen nås, eller om en komponent hanterar fler än 2 logikkrokar eller 3 dialoger, ska mappen automatiskt delas upp i sex standardiserade skikt: `components/`, `hooks/`, `__tests__/`, `api/`, `domain/` och `doc/`.

## ADR-006: Fysiskt processminne (`doc/LAST_CYCLE/`)
- **Status**: Godkänd & Tillämpas
- **Kontext**: När en språkmodell genererar hela sin analys i ett enda chattsvar "simulerar" den beslutsfattande i efterhand istället för att reellt utvärdera systemet.
- **Beslut**: All utveckling drivs som en sekventiell tillståndsmaskin via fysiska diskfiler under `doc/LAST_CYCLE/`. Redigering i `src/` är spärrad tills den taktiska designkedjan sparats på disk med godkänt beslut.

## ADR-007: Samlokaliserad domändokumentation & Mekanisk processvalidering
- **Status**: Godkänd & Tillämpas
- **Kontext**: Den tidigare strukturen med centraliserad fraktal dokumentation under `doc/features/[domän]/` skapade sökvägskomplexitet, förhöjd token-förbrukning och risk för spökdokumentation vid omdöpning av domäner. Samtidigt skapade manuella chattdebatter tokenspill utan garanterad källkodskvalitet.
- **Beslut**:
  1. **Samlokalisering av domändokumentation (Co-location):** All fraktal dokumentation flyttas från `doc/features/[domän]/` direkt in till domänens undermapp: `src/features/[domän]/doc/` (`INDEX.md`, `BUSINESS_RULES.md`, `UI_WORKFLOWS.md`, `INTEGRATIONS.md`).
  2. **Mekanisk sekvenskontroll:** Alla krav (250 rader, FSD-gränser, TDD-ordning, tidsstämplar $mtime$) lyfts ur Systeminstruktionen och upprätthålls mekaniskt via `scripts/verify-architecture.js`.
  3. **Dynamiskt strategiskt nätverk:** Steg 2 drivs som en sekventiell tillståndsmaskin på disken (`2a` till `2f`) med explicita beslutsstämplar.
- **Konsekvenser**:
  - **Modularitet:** Varje domän i `src/features/[domän]/` blir en fristående och portabel enhet (kod, tester, dokumentation och publika gränssnitt i samma mapp).
  - **Kontextskärning:** AI Studio behöver endast läsa domänens egen mapp för full kontextinsikt.
  - **Deterministisk kvalitet:** Källkodskvaliteten säkras av diskens tidsstämplar och terminalskriptet.

  ## ADR-008: Automatiserad verifieringsspärr (CI/CD-Gate)
- **Status**: Godkänd & Tillämpas
- **Kontext**: Manuella kontroller av filstämplar, TDD-ordning, FSD-gränser och radantal skapar mänskliga fel och tillåter avvikelser över tid.
- **Beslut**: Alla process- och kodregler godkänns exklusivt via deterministisk exekvering av `scripts/verify-architecture.js`. Inga källkodsändringar anses slutförda utan att skriptet returnerar felkod 0 i terminalen.
- **Konsekvenser**:
  - **Mekanisk spärr:** AI Studio kan inte slutföra Steg 4 utan grön status i skriptet.
  - **Relativ typsäkerhet:** FSD-överskridanden via både absoluta och relativa sökvägar (`../../`) stoppas automatiskt.
  - **Framtidssäkrad pipeline:** Skriptet kan köras direkt i lokal git-pre-commit hook eller GitHub Actions CI/CD.

## ADR-009: Renodlade `index.ts`-fasader (Ingen affärslogik i API-ytan)
- **Status**: Godkänd & Tillämpas
- **Kontext**: Domänens publika gränssnitt (`src/features/[domän]/index.ts`) riskerar att bli en slasktratt där komponenter eller tillståndskrokar skrivs direkt i exportfilen.
- **Beslut**: `index.ts` får uteslutande innehålla re-export-satser (`export * from ...` eller `export { ... }`). All faktisk kod, hooks och komponenter ska bo i sina respektive undermappar (`components/`, `hooks/`, `domain/`).

## ADR-010: Maskinläsbar tillståndssynkronisering i `1a_orientera.md`
- **Status**: Godkänd & Tillämpas
- **Kontext**: Vid avbrutna körningar eller ny chattsession behöver systemet omedelbart identifiera var i sekvensen processen stannade utan fri texttolkning.
- **Beslut**: `1a_orientera.md` ska alltid avslutas med ett validerat JSON-block som anger nycklarna `status`, `current_domain` och `next_step`.

## ADR-011: Lättviktiga mönstersökningar för gränssnittsskydd (Prop- och Fasadskydd)
- **Status**: Godkänd & Tillämpas (v9.1)
- **Kontext**: Fullständiga externa AST-kompilatorer eller tunga analysverktyg i sandlådemiljön medför risk för långsamma byggtider, externa beroendekonflikter och potentiella krascher. Samtidigt finns en reell risk att valfria egenskaper (`props`) eller fasadmetoder oavsiktligt försvinner när en komponent skrivs om.
- **Beslut**: Gränssnittsskyddet implementeras via snabba, deterministiska mönstersökningar i `scripts/drivers/ts.js` mot sparade ögonblicksbilder i `doc/LAST_CYCLE/snapshots/pre_step4/`. Om en källkodsfil förlorar props i `*Props`-interfacet utan att nyckelordet `BORTTAGEN_PROP` eller `REFAKTORISERAD_PROP` uttryckligen deklarerats i Steg 3c stoppas bygget automatiskt.
- **Konsekvenser**:
  - **Blixtsnabb verifiering:** Kontrollen exekverar på under 10 millisekunder utan att belasta containern.
  - **Noll externa beroenden:** Ingen risk för versionskrockar eller trasiga verktygskedjor.
  - **Starkt regressionsskydd:** Skyddar befintliga anropare och förhindrar tyst gränssnittsförvanskning.

## ADR-012: Strikt modularisering av vyer (Max 120 rader för huvudvyer)
- **Status**: Godkänd & Tillämpas (v9.1)
- **Kontext**: När huvudvyer (filer direkt under en funktionsmapp, t.ex. `ActiveStream.tsx` eller `OnboardingWizard.tsx`) växer och blir för långa blandas övergripande sidlayout med detaljerad panel- och dialoglogik. Detta ökar risken för att AI-modellen oavsiktligt klipper bort värdefulla inställningar eller vyer under kodgenerering.
- **Beslut**: Huvudvyer i gränssnittet (`.tsx`-filer utanför undermappen `components/`) begränsas till maximalt 120 rader kod. De ska fungera som rena orkestrerare. Alla visuella sektioner, dialoger, filter och större delkomponenter måste brytas ut till självständiga underkomponenter i `components/`.
- **Konsekvenser**:
  - **Tydlig ansvarsfördelning:** Huvudvyn förblir kort, överskådlig och lätt att granska.
  - **Trygg AI-redigering:** Ändringar i en panel eller ett kort sker i en isolerad fil utan att påverka resten av skärmen.
  - **Hög återanvändbarhet:** Underkomponenter kan enkelt testas och återanvändas.

## ADR-013: Deterministisk tidsstämpelhantering och kvitto-nollställning vid omstarter
- **Status**: Godkänd & Tillämpas (v9.1)
- **Kontext**: I en molnbaserad utvecklingsmiljö kan containern startas om eller filer beröras i olika ordning. Gamla godkännandekvitton (`APPROVAL.md`) riskerar att ligga kvar och av misstag låsa upp källkodsredigering i en helt ny cykel innan användaren hunnit granska den nya specifikationen.
- **Beslut**: Revisionsskriptet `scripts/verify-architecture.js` kontrollerar filernas tidsstämplar ($mtime$) och raderar automatiskt `APPROVAL.md` om filen är äldre än `1a_orientera.md` eller om `3c_fil_operativ_kallkodsspecifikation.md` har sparats om. Dessutom krävs minst 2 sekunders betänketid mellan skapandet av Steg 3c och godkännandet för att säkerställa mänsklig granskning.
- **Konsekvenser**:
  - **Garanterad granskningsordning:** Inga gamla kvitton kan återanvändas av misstag.
  - **Tidsresiliens:** Systemet fungerar stabilt oavsett när eller hur containerns arbetsyta startas om.

## ADR-014: Trygg återställning via obrutet helhetssteg vid verifieringslarm
- **Status**: Godkänd & Tillämpas (v9.1)
- **Kontext**: Om terminalens arkitekturkontroll larmar vid källkodsändringar (t.ex. på grund av brutet FSD-lager, saknad fil i specifikationen eller trasiga tester) leder punktvisa snabblagningar ofta till att dokumentationen och koden hamnar i osynk.
- **Beslut**: Vid minsta verifieringsfel i terminalen görs alltid ett nytt heltäckande, obrutet svep från Steg 1a till Steg 3c. Specifikationen uppdateras för att återspegla den nödvändiga korrigeringen, och användaren presenteras en ny sammanfattning i chatten för godkännande innan koden modifieras.
- **Konsekvenser**:
  - **Fullständig transparens:** Användaren som arkitekt är alltid medveten om varför en ändring behövdes.
  - **Synkat processminne:** Dokumentationskedjan i `doc/LAST_CYCLE/` förblir 100 % sanningsenlig och representativ för koden.

## ADR-015: Automatiska fil-snapshots före Steg 4 (`pre_step4`)
- **Status**: Godkänd & Tillämpas (v9.1)
- **Kontext**: Innan källkodsfiler modifieras i Steg 4 behövs en pålitlig och omedelbar ögonblicksbild av det tidigare tillståndet, både för att kunna utföra mekaniska gränssnittsjämförelser och för att kunna återställa filer vid behov utan externa beroenden.
- **Beslut**: När ett giltigt godkännande (`APPROVAL.md`) registreras skapar `verify-architecture.js` automatiskt säkerhetskopior av alla påverkade källkodsfiler i mappen `doc/LAST_CYCLE/snapshots/pre_step4/`.
- **Konsekvenser**:
  - **Säker återställningspunkt:** Filerna finns alltid tillgängliga i oförvanskat skick.
  - **Möjliggör prop-skydd:** Drivrutinen kan enkelt jämföra gränssnittet före och efter Steg 4.

## ADR-016: Beteendedrivna UI-tester med interaktionskrav
- **Status**: Godkänd & Tillämpas (v9.1)
- **Kontext**: Tester som enbart monterar en vy i minnet utan att simulera klick, formulärinmatning eller händelseanrop ger en falsk känsla av säkerhet och kan släppa igenom trasiga gränssnitt.
- **Beslut**: Alla `.test.tsx`-filer under domänerna måste innehålla aktiva interaktionspåståenden (t.ex. `fireEvent`, `userEvent`, `toHaveBeenCalled`, `getByRole` eller `getByText`). Dessutom måste samtliga testfiler innehålla minst ett reellt `expect()`-påstående.
- **Konsekvenser**:
  - **Verklig funktionsverifiering:** Användarflöden och klickbara knappar testas på riktigt.
  - **Skydd mot tomma testskal:** Förhindrar att tester passerar utan reell verifiering.

## ADR-017: Tidsåtskild granskning vid Steg 3c
- **Status**: Godkänd & Tillämpas (v9.1)
- **Kontext**: För att säkerställa att användaren som arkitekt hinner läsa och godkänna den operativa specifikationen delas varje cykel upp i två separata chatt-turer.
- **Beslut**: I Chatt-tur 1 skapas filerna 1a till 3c på disken, varpå AI Studio presenterar sin Användarsammanfattning i chatten och inväntar användarens klartecken. I Chatt-tur 2 skapas APPROVAL.md på disken och Steg 4 exekveras.
- **Konsekvenser**: Skriptet verify-architecture.js kräver att APPROVAL.md finns på disken innan källkoden verifieras i Steg 4, vilket garanterar att varje källkodsändring föregås av en tidsåtskild granskning.