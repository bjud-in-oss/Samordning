# Steg 1b: Kartlägga (Befintlig Kodbas och Beroenden)

## 1. Nulägesanalys av berörda filer i domänen `inbjudningar`

### A. `src/features/inbjudningar/components/StreamFilterStatus.tsx`
- **Nuläge**:
  - Vid `!pushEnabled` har komponenten rubriken `"Välj att ta emot inbjudningar"`.
  - Botten har en skiljelinje `border-t border-brand-ink/5 pt-2` och texten `"(Klicka för att anpassa områden och inställningar)"`.
- **Mål**:
  - Rubrik ändras till `"Anpassa din tillgänglighet"`.
  - Skiljelinje `border-t` tas bort från klicktexten.
  - Klicktexten förenklas till `"(Klicka för att anpassa)"`.

### B. `src/features/inbjudningar/components/StreamQuoteCard.tsx` (Ny komponent)
- **Krav**:
  - Fristående komponent under `src/features/inbjudningar/components/StreamQuoteCard.tsx`.
  - Helt ramlös (`border-0` / ingen kantlinje), icke-klickbar (`cursor-default` / utan hover-effekt) och utan bakgrundsskugga (`shadow-none` / transparent eller diskret pappersyta utan skuggor).
  - Citat: *”När ni är i era medmänniskors tjänst är ni endast i er Guds tjänst.”* med `font-serif italic text-lg sm:text-xl md:text-2xl text-center leading-relaxed text-brand-ink/90`.
  - Källa: *Mosiah 2:17* som `font-mono text-xs sm:text-sm text-brand-ink/50 text-center mt-2 tracking-wide`.

### C. `src/features/inbjudningar/ActiveStream.tsx`
- **Nuläge**:
  - Vid `!pushEnabled` renderas `<StreamFilterStatus />` först i huvudvyn.
  - Därefter kommer förfrågningar och aktiva anslag.
- **Mål**:
  - Importera `StreamQuoteCard` och placera den direkt under det översta ingångskortet.

### D. Tester & Gränssnitt
- `src/features/inbjudningar/components/__tests__/StreamFilterStatus.test.tsx` uppdateras för den nya rubriken och texten.
- `src/features/inbjudningar/components/__tests__/StreamQuoteCard.test.tsx` skapas för att verifiera det redaktionella citatkortet.
