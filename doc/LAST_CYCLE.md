[DOMÄN: LiveCard, Efterflöde & Admin-moderering] | [STEG: Verkställa -> Godkänd] | [TESTSTATUS: Grön (15/15 tester passerade)] | [TUR: 1/1]

# Genomförd Cykel: Återställd Kortstruktur, PostSubmissionStepper & AdminModerering

## 1. Kortstruktur i PreviewCard.tsx
- Mörkgrön vikmärkesetikett i övre högra hörnet (`absolute top-0 right-0`) med texten "SKRIV INBJUDAN".
- Återställd inre fältstruktur:
  * Överst: Etikett "BESKRIV DIN INBJUDAN" i kapitäler ovanför huvudtexten ("Ingen aktivitet angiven än" / inskriven text).
  * Rad 1 (2 kolumner): "VÄLJ TID & DATUM" (vänster) och "VAR SES NI?" (höger).
  * Rad 2 (2 kolumner): "DELTAGARE HEMMA" (vänster) och "GRUPPER" (höger).
  * Rad 3: "VEM HÅLLER I DET?" (full bredd längst ned ovanför knapparna "Avbryt" / "Sänd").
- 3-kolumnslayouten ("Områden / Målgrupp / Arrangör") har helt tagits bort.

## 2. Sekventiella Steg EFTER Insändning (PostSubmissionStepper.tsx)
- Skapat `PostSubmissionStepper.tsx` som kör de fyra stegen linjärt:
  1. Steg 1: AI-rekonciliering.
  2. Steg 2: Integritetsbekräftelse för personuppgifter.
  3. Steg 3: SMS-länk, kopiera-knapp och QR-kod.
  4. Steg 4: SMS-returavstämning ("Fick du iväg meddelandet?"). Vid "Ja, skickat!" sparas inbjudan i `localStorage` och knappen "Lägg till i kalender" (`.ics`) visas och laddar ner kalenderfilen vid klick.

## 3. Admin-konsol & Moderering (AdminConsole.tsx & App.tsx)
- Aktiverat `?user=ADMIN` i `App.tsx` för direktåtkomst till `AdminConsole.tsx`.
- Alla inbjudningar med status "pending_review" eller "pending" hämtas och visas med fungerande modereringsknappar för "Godkänn" (sätter status "active") och "Avböj" (raderar/sätter status "rejected").

## 4. Verifiering
- `npx tsc --noEmit`: 0 fel.
- `npm test`: 15/15 tester passerade.
- `compile_applet`: Kompilering godkänd.
