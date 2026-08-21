# Steg 3c: Fil-operativ Källkodsspecifikation (Uppdaterad med Användaranpassad Logik och Terminologi)

## 1. Toppfält och Reglagebeteende (`src/components/AppHeader.tsx`)
- **Text & Reglagefäste**: Texten till vänster om switchen sätts till `"Ta emot inbjudningar"`. Switchen fäster direkt intill denna text med tight spacing (`gap-2.5`).
- **Gemensam klickyta**: Texten och switchen delar en gemensam klickyta så att ett tryck på själva texten slår på/av funktionen direkt (anropar `onTogglePush`).
- **Inställningskugghjul**: Klick på kugghjulet anropar `onToggleSettings` för att fälla ut respektive stänga inställningspanelen direkt i flödet. Knappen `+ Bjud in` förblir intakt på höger sida.

## 2. Förklaringskort när funktionen är AV (`src/features/inbjudningar/components/StreamFilterStatus.tsx`)
- **Placering**: Visas överst i flödet när `pushEnabled` är `false`.
- **Innehåll & Texter**:
  - **Rubrik**: `"Välj att ta emot inbjudningar"`
  - **Brödtext**: `"Du ser direkt när någon behöver ditt stöd. Du är helt anonym och ingen kan se dina val eller begränsningar. Du kan när som helst välja var du vill vara tillgänglig."`
  - **Interaktivitet**: Möjlighet att aktivera direkt via kortet eller öppna inställningspanelen.

## 3. Kortets beteende och texter när funktionen är PÅ (`StreamFilterStatus.tsx` & `ActiveStream.tsx`)
- **Placeringsdynamik i flödet (`ActiveStream.tsx`)**:
  - När `pushEnabled` är `true` ligger kortet kvar i flödet och knuffas nedåt av nya inbjudningar, men **bromsas upp så att det aldrig hamnar längre ned än direkt efter den 4:e inbjudan (plats 5)**.
  - Exakt indexplacering: Om inbjudningslistan har $N \ge 4$ kort, infogas kortet på index 4 (efter 4 inbjudningskort). Om $N < 4$, läggs kortet sist efter alla $N$ inbjudningskort.
- **Innehåll och lägen (`StreamFilterStatus.tsx`)**:
  - **Standardläge (alla områden valda / ingen områdesbegränsning)**:
    - **Tagg**: `"Begränsa din tillgänglighet"`
    - **Rubrik**: `"Tillgänglig i hela församlingens område"`
    - **Brödtext**: `"Du tar emot inbjudningar från hela församlingsområdet. Klicka på kortet eller kugghjulet om du vill snäva av dina platser."`
  - **Anpassat läge (vissa områden valda)**:
    - **Tagg**: `"Anpassat urval"`
    - **Rubrik**: `"Dina valda områden"`
    - **Brödtext**: `"Du tar emot inbjudningar för dina valda platser i församlingsområdet."` (med synliga badges/chips för de valda områdena).
  - **Interaktivitet**: Klick på kortet eller kugghjulet öppnar inställningspanelen direkt.

## 4. Uppdatering av Terminologi för Skapande och Status

### Skapandeflödet (`src/features/skapa_inbjudan/CreateInvitationForm.tsx`)
- **Slutknapp för inskickning**: Byt ut texten på den sista knappen från `"Publicera"` / `"Publicera inbjudan"` till `"Ge en inbjudan"`.

### Kort- och Statusvisning (`src/features/inbjudningar/ActiveStream.tsx` & `src/features/skapa_inbjudan/components/PreviewCard.tsx`)
- **Statusbricka / Badge**: Byt ut `"DITT FÖRSLAG • VÄNTAR PÅ GRANSKNING"` till `"DIN INBJUDAN • FÖRBEREDS"`.
- **Undertext / Förklarande text**: Byt ut `"GRANSKAS AV ANSVARIGA LEDARE"` till `"Förbereds för utskick i församlingsområdet"`.

## 5. Berörda Filer för Steg 4
1. `src/components/AppHeader.tsx`
2. `src/features/inbjudningar/components/StreamFilterStatus.tsx`
3. `src/features/inbjudningar/ActiveStream.tsx`
4. `src/features/skapa_inbjudan/CreateInvitationForm.tsx`
5. `src/features/skapa_inbjudan/components/PreviewCard.tsx`
6. Tester och assertions för de nya texterna

BESLUT: GODKÄND
