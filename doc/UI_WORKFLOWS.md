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
- Mörkgrön märkesskylt: BEHÅLL det mörkgröna vikmärket i övre högra hörnet (absolute top-0 right-0) med texten "SKRIV INBJUDAN".
- Återställd inre fältstruktur:
  * Överst: Etiketten "BESKRIV DIN INBJUDAN" i kapitäler ovanför huvudtexten ("Ingen aktivitet angiven än" / inskriven text).
  * Rad 1 (2 kolumner): "VÄLJ TID & DATUM" (vänster) och "VAR SES NI?" (höger).
  * Rad 2 (2 kolumner): "DELTAGARE HEMMA" (vänster) och "GRUPPER" (höger).
  * Rad 3: "VEM HÅLLER I DET?" (full bredd längst ned ovanför knapparna "Avbryt" / "Sänd").
- Ta bort 3-kolumnslayouten ("Områden / Målgrupp / Arrangör").
- Rent Skriv Inbjudan-läge: Radera den yttre containerramen helt. Placera knappen "Avbryt" i nedre vänstra hörnet och "Sänd" i nedre högra hörnet DIREKT INUTI Tilen.

## 5. Sekventiella Steg EFTER Insändning (PostSubmissionStepper.tsx)
När användaren klickar på "Sänd" körs fyra steg i linjär följd:
1. Steg 1: AI-rekonciliering ("Vad du inte tänkt på"): Analyserar texten och påpekar saknade fält eller varningar innan SMS skapas.
2. Steg 2: Integritetsbekräftelse (personuppgifter utan medgivande).
3. Steg 3: SMS & Delning: SMS-länk (öppna SMS-app), kopiera-knapp och QR-kod.
4. Steg 4: SMS-returavstämning ("Fick du iväg meddelandet?"). Om användaren väljer "Ja, skickat!" sparas inbjudan i localStorage och knappen "Lägg till i kalender" (.ics) visas. .ics-filen laddas BARA ner vid aktivt klick.

## 6. Moderering & Avsändaridentitet (AdminConsole.tsx)
- Alla inbjudningar med status "pending_review" eller "pending" ska visas under https://utby.netlify.app/?user=ADMIN med fungerande knappar för "Godkänn" (publicerar till flödet med status "active") och "Avböj" (tar bort).
- Skaparens vy: Skaparen ser sitt eget förslag mörkt/märkt med grön status "DITT FÖRSLAG • VÄNTAR PÅ GRANSKNING" i sitt eget flöde.

## 7. PWA & Cachning (public/sw.js & pwaService.ts)
- Sätt Network-First-strategi för Service Worker och automatisk rensning av gamla cacher vid activate samt reg.update() vid registrering.
