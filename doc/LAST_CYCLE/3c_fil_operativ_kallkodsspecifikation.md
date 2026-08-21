# Steg 3c: Fil-operativ Källkodsspecifikation (Flöde, Layout och Varmare Terminologi)

## 1. Appens Titel (`index.html`)
- **Titel**: `<title>` sätts till `"Andlighet, Vänskap och Stöd"`.

## 2. Fast Toppfält och Reglagebeteende (`src/components/AppHeader.tsx`)
- **Positionering**: `sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-ink/10 shadow-xs`.
- **Text & Reglage**: Texten är `"Ta emot inbjudningar"`. Texten och switchen delar klickyta för smidig växling (`onTogglePush`).

## 3. Förklaringskort när funktionen är AV (`src/features/inbjudningar/components/StreamFilterStatus.tsx` & `src/features/inbjudningar/ActiveStream.tsx`)
- **Placering**: Överst på Index 0 (Plats 1) i flödet.
- **Innehåll**:
  - Rubrik: `"Välj att ta emot inbjudningar"`.
  - Brödtext: `"Du ser direkt när någon behöver ditt stöd. Du är helt anonym och ingen kan se dina val eller begränsningar. Du kan när som helst välja var du vill vara tillgänglig."`.
- **Styling**: Ingen grå tagg (`AVISERINGAR AV`). Mjuk, varm pappersbakgrund med en tunn rundad ram (`bg-brand-paper/90 rounded-3xl p-6 border border-brand-accent/25 shadow-sm hover:border-brand-accent/40 hover:bg-brand-paper transition-all cursor-pointer`).
- **Interaktion**: Ett klick på kortet sätter automatiskt `pushEnabled` till PÅ (`true`) och fäller samtidigt ut anpassningspanelen.

## 4. Statuskort när funktionen är PÅ (`src/features/inbjudningar/components/StreamFilterStatus.tsx` & `src/features/inbjudningar/ActiveStream.tsx`)
- **Placering**: Exakt Index 2 (som kort 3 i listan), direkt efter de 2 första inbjudningskorten. (Om färre än 2 inbjudningar finns läggs det sist).
- **Styling**: Mjuk pappersram (`border border-brand-accent/25 shadow-sm rounded-3xl`).
- **Texter**:
  - *Standardläge (alla områden)*: Tagg `"Begränsa din tillgänglighet"`, Rubrik `"Tillgänglig i hela församlingens område"`, Brödtext `"Du tar emot inbjudningar från hela församlingsområdet. Klicka på kortet eller kugghjulet om du vill snäva av dina platser."`.
  - *Anpassat urval*: Tagg `"Anpassat urval"`, Rubrik `"Dina valda områden"`, Brödtext `"Du tar emot inbjudningar för dina valda platser i församlingsområdet."`.

## 5. Anpassningspanelen (`src/features/anpassa/OnboardingWizard.tsx`)
- **Rubrik**: `"Välj var du vill ta emot inbjudningar"` (stjärnikonen framför tas bort).
- **Aktiv aktiveringsknapp**: Om panelen öppnas medan switchen är avstängd (`!pushEnabled`), visas en aktiv knapp längst upp: `"Slå på 'Ta emot inbjudningar'"` som aktiverar switchen direkt inifrån panelen.
- **Rensning**: Passiv påminnelsetext tas bort helt.

## 6. Varmare Terminologi för Skapande och Status (`src/features/skapa_inbjudan/components/CreateInvitationForm.tsx` m.fl.)
- **Skapandeflöde**: Sista knappen ändras från `"Publicera"` till `"Ge en inbjudan"`.
- **Kort- och statusvisning**: Statusbrickan ändras till `"DIN INBJUDAN • FÖRBEREDS"` och undertexten till `"Förbereds för utskick i församlingsområdet"`.

## 7. Berörda Filer för Steg 4
1. `index.html`
2. `src/components/AppHeader.tsx`
3. `src/features/inbjudningar/components/StreamFilterStatus.tsx`
4. `src/features/inbjudningar/ActiveStream.tsx`
5. `src/features/anpassa/OnboardingWizard.tsx`
6. `src/features/skapa_inbjudan/components/CreateInvitationForm.tsx`
7. `src/features/skapa_inbjudan/components/DraftBanner.tsx`
8. `src/features/inbjudningar/components/__tests__/StreamFilterStatus.test.tsx`

BESLUT: GODKÄND
