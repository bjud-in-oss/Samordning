# Steg 3a: Helhet, Orkestrering och Integration

## Dataflöde & Komposition

1. **Rendering i `ActiveStream.tsx`**:
   - Ingångskortet `<StreamFilterStatus />` renderas överst vid inaktivt läge (`!pushEnabled`).
   - Direkt under ingångskortet renderas det nya redaktionella citatkortet `<StreamQuoteCard />`.
   - Därefter renderas eventuella förberedda inbjudningar och det aktiva flödet av inbjudningar.

2. **Ingångskortet (`StreamFilterStatus.tsx`)**:
   - I inaktivt läge visas rubriken `"Anpassa din tillgänglighet"`.
   - Bottenraden renderas utan `border-t` med den enkla texten `"(Klicka för att anpassa)"`.

3. **Citatkortet (`StreamQuoteCard.tsx`)**:
   - Rent redaktionellt element med centrerad typografi.
   - Helt ramlöst och utan skuggor eller interaktiva hovringsstilar.
