[DOMÄN: LiveCard, Flöde & Moderering] | [STEG: Verkställa -> Godkänd] | [TESTSTATUS: Grön (15/15 tester passerade)] | [TUR: 1/1]

# Genomförd UI- & Flödesuppdatering (doc/UI_WORKFLOWS.md)

## 1. Tre Huvudkategorier
- Kategori "Få näring av Guds ord" har döpts om till "Läsa skrifterna" i parser, server, gränssnitt och tester.
- Alla inbjudningar sorteras under de tre pelarna: "Vara en vän", "Läsa skrifterna", "Hjälpa andra".

## 2. Topprad & Navigering (App.tsx)
- Fasta toppraden samlar hela styrpanelen: "Se dina inbjudningar", notisreglage (Web Push), diskret ⚙️-kugghjul, samt knappen "Bjud in" längst till höger.
- Svävande knappar, språkväljarikon och sticky positioning har tagits bort så att toppraden följer med naturligt vid skrollning.

## 3. "Om ditt flöde" (ActiveStream.tsx)
- Ny status-tile högst upp i flödet med mörkgrön vikmärkesetikett "AKTIVT FILTER".
- Visar exakt valda områden, kategorier, språk och organisationer (eller text om alla inbjudningar visas).
- Klickbar tile som leder direkt till inställningarna.

## 4. LiveCard & Skriv Inbjudan (PreviewCard.tsx & CreateInvitationForm.tsx)
- Vikbar etikett med mörkgrön bakgrund högst upp till höger på varje kort ("SKRIV INBJUDAN", "Ditt förslag • Väntar på granskning", "VARA EN VÄN", etc.).
- 2-kolumnsnät på alla skärmstorlekar för "VÄLJ TID & DATUM" och "VAR SES NI?".
- Yttre ramar kring "Skapa Inbjudan" borttagna, med "Avbryt" och "Sänd" placerade i nedre hörn inuti tilen.
- Avskalade kort utan redundant text ("Inbjudan • ", "BESKRIVNING").
- Skarp fokusredigering som tonar ned kortet vid öppen redigeringsdialog.

## 5. Inlämningsflöde (1-2-3-4) & Kalender
- Automatisk AI-rekonciliering via `AiReviewModal`.
- Mjuk bekräftelse för personuppgifter utan samtycke.
- SMS-länk, kopiaknapp och QR-kod via `GatewayQrModal`.
- `icsGenerator.ts` genererar och laddar ner .ics-kalenderfiler enbart vid aktivt klick.

## 6. Verifiering & Teststatus
- `npm test`: 15/15 tester godkända.
- `compile_applet`: Applet byggd utan fel.
