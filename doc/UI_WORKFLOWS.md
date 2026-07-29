# Produkt- & Användarspecifikation: LiveCard, Flöde & Moderering

## 1. Tre Huvudkategorier (AI-kategorisering)
Alla inbjudningar ska automatiskt kategoriseras utifrån tre pelare utan att besvära användaren:
- Vara en vän (Samvaro, samtal, gemenskap, relationer)
- Läsa skrifterna (Guds ord, standardverken, Mormons bok, fördjupning)
- Hjälpa andra (Praktisk hjälp, stöd, tjänande, omtanke)

## 2. Topprad & Navigering (App.tsx)
- Fasta toppraden ska samla hela styrpanelen: Texten "Se dina inbjudningar", notisreglage, ett diskret ⚙️-kugghjul direkt intill reglaget, samt knappen "Bjud in" längst till höger.
- Ta bort fristående/svävande knappar och språkväljarikonen. Klick på kugghjulet eller raden öppnar Anpassa.
- Ta bort sticky-positionering (sticky top-0 z-50) så att toppraden följer med naturally vid skrollning utan att skära igenom korten.

## 3. Flöde & Status-Tile (ActiveStream.tsx)
- "Om ditt flöde"-tile: Högst upp i flödet visas en status-tile med mörkgrön skylt i övre högra hörnet ("AKTIVT FILTER"). Den visar valda filter samt texten "(Endast synligt för dig)". Klick på tilen öppnar Anpassa.
- Skaparkort i flödet: Klick på "Bjud in" tänds skaparkortet direkt högst upp i flödet framför övriga kort.

## 4. Enhetlig Tile-Design & Rent LiveCard (PreviewCard.tsx & CreateInvitationForm.tsx)
- Mörkgrön märkesskylt: Alla kort i flödet återanvänder samma Tile-anatomi med en mörkgrön vikta skylt i övre högra hörnet ("SKRIV INBJUDAN" på skaparkortet, kategori eller "VÄNTAR PÅ GRANSKNING" på publicerade kort).
- Fältlayout: Fälten "VÄLJ TID & DATUM" och "VAR SES NI?" ska ligga sida vid sida i ett 2-kolumnsgrid (grid-cols-2).
- Rent Skriv Inbjudan-läge: Radera den yttre containerramen helt. Placera knappen "Avbryt" i nedre vänstra hörnet och "Sänd" i nedre högra hörnet DIRECT INUTI Tilen.
- Kortstädning: Ta bort ordet "Inbjudan • ", rubriken "BESKRIVNING" och dubblerade kategorietiketter från samtliga kort.
- Fokuseditering: Vid klick på ett fält döljs/tonas kortet ned medan det valda fältets dialog redigeras i skarpt fokus.

## 5. Sekventiella Steg EFTER Insändning (4 steg)
När användaren klickar på "Sänd" körs fyra steg i linjär följd:
1. AI-Rekonciliering ("Vad du inte tänkt på"): Analyserar texten och påpekar saknade fält eller varningar innan SMS skapas.
2. Integritet: Mjuk bekräftelse gällande personuppgifter utan medgivande.
3. SMS & Delning: Knappar för enhetens SMS-app, kopiera direktlänk och QR-kod.
4. SMS-Retur & Kalender: Fråga ("Fick du iväg meddelandet?"). Vid "Ja" sparas händelsen i localStorage under "Mina anmälningar" och knappen "Lägg till i kalender" (.ics / Google Calendar) visas. .ics-filen laddas BARA ner vid aktivt klick.

## 6. Moderering & Avsändaridentitet
- Status (pending_review): Nya inbjudningar får status "Väntar på granskning".
- Skaparens vy: Skaparen ser sitt eget förslag mörkt/märkt med grön status "Ditt förslag • Väntar på granskning" i sitt eget flöde.
- Admin-godkännande: Inkomna förslag visas i Admin-konsolen med knappar för Godkänn och Avböj.

## 7. PWA & Cachning (public/sw.js & pwaService.ts)
- Sätt Network-First-strategi för Service Worker och automatisk rensning av gamla cacher vid activate samt reg.update() vid registrering.
