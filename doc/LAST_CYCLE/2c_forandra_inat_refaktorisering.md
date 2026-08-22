# Steg 2c: Förändra Inåt - Refaktorisering

## Refaktorisering och Arkitekturkontroll

1. **Modularisering & Återanvändbarhet**:
   - `StreamQuoteCard.tsx` skapas som en ren, presentationsstyrd komponent i `src/features/inbjudningar/components/`.
   - Den är fri från sidoeffekter, state och externa nätverksanrop, vilket gör den snabb och lätthanterlig.

2. **Inga onödiga gränssnittsförändringar**:
   - `StreamFilterStatusProps` förblir oförändrad, vilket garanterar full bakåtkompatibilitet.
   - `ActiveStream.tsx` behåller all befintlig strömnings- och modereringslogik.

3. **Strikt FSD-isolering**:
   - Alla förändringar och nya komponenter stannar inom domänen `src/features/inbjudningar/`.
