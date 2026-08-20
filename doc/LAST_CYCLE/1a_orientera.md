# Steg 1a: Orientering och Tillståndskontroll

- **Tillståndskontroll**: Processrevisor v8.8 är aktiverad med fokus på inbjudningsflödet och aviseringslayout.
- **Aktuell domän**: `inbjudningar`
- **Avbrottsanalys och uppdrag**: Användaren efterfrågar 3 specifika UI- och logikjusteringar i inbjudnings- och aviseringsflödet:
  1. **Toppfältet (AppHeader)**: Flytta reglaget för att slå på/av aviseringar så att det visuellt dockar an mot texten "Se dina inbjudningar" på vänster sida om reglaget, istället för mot inställningskugghjulet på höger sida. Inga andra element på raden ska flyttas.
  2. **Förklaringsvy vid avstängda aviseringar**: När aviseringar är AV ska ett tydligt förklarande kort visas överst i strömmen som förklarar att användaren behöver aktivera aviseringar för att inte missa inbjudningar, samt att man kan avgränsa områden och grupper via inställningar. Den detaljerade sammanställningen av standardinställningar döljs medan aviseringar är av.
  3. **Aktiva inställningar och placering vid aktiva aviseringar**: När aviseringar slås PÅ växlar kortet till att visa aktiva inställningar och flyttas ner 2–3 steg i listan så att inbjudningskorten får högre prioritet. Om alla områden är markerade (standardläget) ersätts den långa områdeslistan med "Alla områden aktiva".

```json
{
  "status": "OK",
  "current_domain": "inbjudningar",
  "next_step": "1b_kartlagga"
}
```
