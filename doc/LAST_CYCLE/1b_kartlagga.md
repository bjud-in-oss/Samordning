# Steg 1b: Kartlägga

- **Kartläggning av berörda filer och komponenter**:
  1. `src/components/AppHeader.tsx`:
     - Nuvarande struktur har titeln på vänster sida och ett samlat flex-block på höger sida innehållande push-switchen, kugghjulet och "Bjud in"-knappen.
     - Justering: Flytta switchen så att den placeras direkt intill titeln "Se dina inbjudningar" på vänster sida.
  2. `src/features/inbjudningar/components/StreamFilterStatus.tsx`:
     - Behöver ta emot `pushEnabled: boolean`.
     - När `pushEnabled` är `false`: Visa det förklarande avstängd-avisering-kortet och dölj den detaljerade sammanställningen av standardinställningar.
     - När `pushEnabled` är `true`: Visa aktiva inställningar. Vid standardläge (alla områden valda eller inget specifikt begränsat urval) visas "Alla områden aktiva" istället för att rada upp alla 10–20 områdesnamn.
  3. `src/features/inbjudningar/ActiveStream.tsx`:
     - Styr placeringen av `StreamFilterStatus`:
       - Om `pushEnabled === false`: Kortet renderas överst i flödet.
       - Om `pushEnabled === true`: Kortet flyttas ner 2–3 steg bland de filtrerade inbjudningarna (t.ex. efter index 2 eller 3 i `filteredStream`-listan), så att de första inbjudningskorten får högsta visuella prioritet.
     - Isolerar datamodeller och typer (`ActiveAlert`, `StreamFilterStatusProps`) och lyfter datahämtning till ren domänservice vid behov.
