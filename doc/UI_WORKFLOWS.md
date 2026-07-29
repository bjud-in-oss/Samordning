# Produkt- & Användarspecifikation: LiveCard & Moderering

## 1. Tre Huvudkategorier (AI-kategorisering)
Alla inbjudningar ska automatiskt kategoriseras utifrån tre pelare utan att besvära användaren:
- **Vara en vän** (Samvaro, samtal, gemenskap, relationer)
- **Läsa skrifterna** (Guds ord, standardverken, Mormons bok, fördjupning)
- **Hjälpa andra** (Praktisk hjälp, stöd, tjänande, omtanke)

## 2. Det Fokuserade LiveCard-flödet (Skapa inbjudan)
- **Startläge**: Vyn visar enbart LiveCardet med rubriken "SKRIV INBJUDAN".
- **Fokuseditering**: När användaren klickar på ett fält (t.ex. Tid, Plats, Beskrivning) tonas kortet ned och enbart det valda fältet redigeras i fokus.
- **Mjuk uppdatering**: När fältet fyllts i stängs editeringen och LiveCardet uppdateras direkt på skärmen.
- **Kategorisering i bakgrunden**: AI analyserar texten i bakgrunden och sätter rätt pelare ("Vara en vän", "Läsa skrifterna" eller "Hjälpa andra").

## 3. Steg EFTER Insändning (Sekventiella kort)
När användaren klickar på "Skicka inbjudan" visas dessa steg i linjär följd:
1. **AI-Rekonciliering ("Vad du inte tänkt på")**: Analyserar texten och påpekar saknade fält eller varningar innan SMS skapas.
2. **Integritet**: Mjuk bekräftelse: "Jag bekräftar att jag inte delar andras personuppgifter utan medgivande."
3. **SMS & Delning**: Möjlighet att skicka via enhetens SMS-app eller kopiera direktlänk.
4. **SMS-Retur & Kalender**: Fråga ("Fick du iväg meddelandet?"). Om användaren väljer "Ja" sparas händelsen i enhetens `localStorage` under "Mina anmälningar", och en knapp visas för "Lägg till i kalender" (.ics / Google Calendar).

## 4. Moderering & Avsändaridentitet (Säkerhetsfixar)
- **Granskningsstatus (pending_review)**: Ingen inbjudan publiceras direkt i det allmänna flödet. Nya inbjudningar får statusen "Väntar på granskning".
- **Avsändaridentitet**: Varje skapat förslag/inbjudan stämplas med skaparens namn/session i `localStorage` så att skaparen kan se sina egna väntande förslag.
- **Admin-godkännande**: I Admin-konsolen visas en lista över alla väntande förslag med knappar: Godkänn (publicerar till flödet) och Avböj (tar bort).
