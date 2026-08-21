# Steg 3c: Fil-operativ Källkodsspecifikation (Finjusterad Visuell Stil, Exakt Placering & Panelpåminnelse)

## 1. Appens Titel (`index.html`)
- **Titel**: `<title>` är satt till `"Andlighet, Vänskap och Stöd"`.

## 2. Fast Toppfält och Reglagebeteende (`src/components/AppHeader.tsx`)
- **Fast positionering**: Toppfältet är förankrat längst upp med `sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-ink/10 shadow-xs`.
- **Text & Reglagefäste**: Texten till vänster om switchen är `"Ta emot inbjudningar"`. Switchen fäster direkt intill med `gap-2.5`.
- **Gemensam klickyta**: Texten och switchen delar klickyta för direkt toggling (`onTogglePush`).
- **Inställningskugghjul**: Fäller ut/stänger anpassningspanelen (`onToggleSettings`).

## 3. Mjukare Stil på Tillståndskortet (`src/features/inbjudningar/components/StreamFilterStatus.tsx`)
- **Borttagen hård balk**: Den tjocka vänsterkanten (`border-l-4`) tas bort helt.
- **Mjuk varm ton & tunn ram**: Kortet får en mjuk, varm bakgrundston (`bg-brand-paper/90` eller liknande behaglig färgton) och en tunn, mjuk ram runt hela kortet (`border border-emerald-900/15 shadow-sm rounded-3xl`) så att det visuellt framträder som ett sobert, interaktivt papperskort utan hårda balkar.
- **När funktionen är AV (`pushEnabled === false`)**:
  - Döljer den grå taggen `"AVISERINGAR AV"`.
  - Rubrik: `"Välj att ta emot inbjudningar"`.
  - Brödtext: `"Du ser direkt när någon behöver ditt stöd. Du är helt anonym och ingen kan se dina val eller begränsningar. Du kan när som helst välja var du vill vara tillgänglig."`.
- **När funktionen är PÅ (`pushEnabled === true`)**:
  - **Standardläge**: Tagg `"Begränsa din tillgänglighet"`, Rubrik `"Tillgänglig i hela församlingens område"`, Brödtext `"Du tar emot inbjudningar från hela församlingsområdet. Klicka på kortet eller kugghjulet om du vill snäva av dina platser."`.
  - **Anpassat läge**: Tagg `"Anpassat urval"`, Rubrik `"Dina valda områden"`, Brödtext med valda områdeschips.

## 4. Exakt Tillståndsbaserad Kortplacering i Flödet (`src/features/inbjudningar/ActiveStream.tsx`)
- **När funktionen är AV (`pushEnabled === false`)**:
  - Kortet placeras allra överst i flödet på **Index 0 (Plats 1)** före alla inbjudningskort.
- **När funktionen är PÅ (`pushEnabled === true`)**:
  - Kortet infogas på **exakt Index 2 (som kort 3 i listan)** direkt efter de 2 första inbjudningskorten.
  - Om antalet inbjudningar $N < 2$, läggs kortet sist efter alla $N$ inbjudningskort.

## 5. Synlig Påminnelse i Inställningspanelen (`src/features/anpassa/OnboardingWizard.tsx`)
- **Påminnelsebox**: När funktionen är avstängd (`pushEnabled === false`) renderas en tydlig påminnelsebox längst upp i inställningspanelen:
  `"Slå på 'Ta emot inbjudningar' i toppfältet för att aktivera dina val."`
- **Panelrubrik**: `"Anpassa din tillgänglighet"`.
- **Slutknapp**: `"Spara val"`.

## 6. Berörda Filer för Steg 4
1. `src/features/inbjudningar/components/StreamFilterStatus.tsx`
2. `src/features/inbjudningar/ActiveStream.tsx`
3. `src/features/anpassa/OnboardingWizard.tsx`
4. `src/features/inbjudningar/components/__tests__/StreamFilterStatus.test.tsx`

BESLUT: GODKÄND
