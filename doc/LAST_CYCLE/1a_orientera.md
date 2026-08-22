# Steg 1a: Orientera (Harmonisk Startsida & Redaktionellt Citatkort)

## 1. Bakgrund och Mål
Denna cykel genomför en harmonisk och estetisk uppdatering av startsidans flöde, strikt avgränsad till domänen `inbjudningar` (`src/features/inbjudningar/`):

1. **Ingångskort (`StreamFilterStatus.tsx`)**:
   - Uppdatera rubriken i inaktivt läge (`!pushEnabled`) till `"Anpassa din tillgänglighet"`.
   - Ta bort skiljelinjen (`border-t`) ovanför klicktexten för ett renare, lugnare och mer integrerat uttryck.
   - Förenkla klicktexten till `"(Klicka för att anpassa)"`.

2. **Redaktionellt Citatkort (`StreamQuoteCard.tsx`)**:
   - Skapa en ny fristående komponent i `src/features/inbjudningar/components/StreamQuoteCard.tsx`.
   - Utforma kortet helt ramlöst, icke-klickbart och utan bakgrundsskugga.
   - Ge kortet en klassisk tidningskänsla (pull quote):
     - Citat: *”När ni är i era medmänniskors tjänst är ni endast i er Guds tjänst.”* i stor, mjuk, centrerad serif-kursiv med luftigt radavstånd.
     - Källhänvisning: *Mosiah 2:17* som en mindre, diskret och centrerad text under citatet.

3. **Flödesplacering (`ActiveStream.tsx`)**:
   - Placera `StreamQuoteCard` i flödet direkt under det första ingångskortet för att ge en varm, eftertänksam och tidlös känsla på startsidan.

```json
{
  "status": "ORIENTERING_KLAR",
  "current_domain": "inbjudningar",
  "next_step": "1b_kartlagga"
}
```
