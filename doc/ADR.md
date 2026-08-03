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