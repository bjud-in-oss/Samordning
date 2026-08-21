# Steg 3c: Fil-operativ Källkodsspecifikation (App-titel, Visuell Differentiering, Layout & Flödesdynamik)

## 1. Appens Titel (`index.html`)
- **Titel**: Ändra `<title>` från `"Samordna stöd — Inbjudningar"` till `"Andlighet, Vänskap och Stöd"`.

## 2. Fast Toppfält och Reglagebeteende (`src/components/AppHeader.tsx`)
- **Fast positionering**: Toppfältet förankras längst upp på skärmen med `sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-ink/10 shadow-xs`.
- **Text & Reglagefäste**: Texten till vänster om switchen är `"Ta emot inbjudningar"`. Switchen fäster direkt intill denna text med tight spacing (`gap-2.5`).
- **Gemensam klickyta**: Texten och switchen delar en gemensam klickyta så att ett klick på texten eller reglaget slår på/av funktionen direkt (anropar `onTogglePush`).
- **Inställningskugghjul**: Klick på kugghjulet anropar `onToggleSettings` för att fälla ut respektive stänga anpassningspanelen direkt i flödet. Knappen `+ Bjud in` förblir intakt på höger sida.

## 3. Visuell Differentiering av Tillståndskortet (`src/features/inbjudningar/components/StreamFilterStatus.tsx`)
- **Färgkombination och yta**:
  - Kortet får en mjukt tonad bakgrund i behaglig nyans ur samma färgskala (t.ex. varm salvia/paper-ton `bg-brand-paper/85` eller mjuk skuggton) istället för samma rena vita ton som inbjudningskorten.
- **Accent och inramning**:
  - Subtil accentmarkering på vänstersidan (t.ex. `border-l-4 border-l-brand-accent`) kombinerat med mjukt rundad ram (`rounded-3xl border border-brand-accent/25 shadow-xs`), så att kortet visuellt tydligt särskiljer sig som ett interaktivt status- och inställningskort.
- **När funktionen är AV (`pushEnabled === false`)**:
  - **Tag-synlighet**: Den grå taggen `"AVISERINGAR AV"` döljs helt för en renare och lugnare yta.
  - **Rubrik**: `"Välj att ta emot inbjudningar"`.
  - **Brödtext**: `"Du ser direkt när någon behöver ditt stöd. Du är helt anonym och ingen kan se dina val eller begränsningar. Du kan när som helst välja var du vill vara tillgänglig."`.
- **När funktionen är PÅ (`pushEnabled === true`)**:
  - **Standardläge (alla områden valda)**:
    - **Tagg**: `"Begränsa din tillgänglighet"`
    - **Rubrik**: `"Tillgänglig i hela församlingens område"`
    - **Brödtext**: `"Du tar emot inbjudningar från hela församlingsområdet. Klicka på kortet eller kugghjulet om du vill snäva av dina platser."`
  - **Anpassat läge (vissa områden valda)**:
    - **Tagg**: `"Anpassat urval"`
    - **Rubrik**: `"Dina valda områden"`
    - **Brödtext**: `"Du tar emot inbjudningar för dina valda platser i församlingsområdet."` (med synliga badges/chips för de valda områdena).

## 4. Tillståndsbaserad Kortplacering i Flödet (`src/features/inbjudningar/ActiveStream.tsx`)
- **När 'Ta emot inbjudningar' är AV (`pushEnabled === false`)**:
  - Placera förklaringskortet allra överst i flödet (Plats 1, före alla inbjudningskort).
- **När 'Ta emot inbjudningar' är PÅ (`pushEnabled === true`)**:
  - Placera statuskortet som **kort 3 i listan (direkt efter de 2 första inbjudningskorten, index 2)**. Om antalet inbjudningar $N < 2$, placeras kortet sist efter alla $N$ inbjudningskort.

## 5. Anpassningspanelens Texter & Påminnelse (`src/features/anpassa/OnboardingWizard.tsx`)
- **Panelrubrik**: Sätts till `"Anpassa din tillgänglighet"`.
- **Slutknapp**: Sätts till `"Spara val"`.
- **Översta påminnelse vid inaktiverad funktion (`pushEnabled === false`)**:
  - Visar en tydlig påminnelsebox överst i panelen: `"Slå på 'Ta emot inbjudningar' i toppfältet för att aktivera dina val."`

## 6. Berörda Filer för Steg 4
1. `index.html`
2. `src/components/AppHeader.tsx`
3. `src/features/inbjudningar/components/StreamFilterStatus.tsx`
4. `src/features/inbjudningar/ActiveStream.tsx`
5. `src/features/anpassa/OnboardingWizard.tsx`
6. `src/features/inbjudningar/components/__tests__/StreamFilterStatus.test.tsx`

BESLUT: GODKÄND
