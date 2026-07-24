# Blueprint Specification - ETAPP 4 Organisatörer, QR Gateway, Sekretess & OSA via annan enhet

## 1. Overview & Architecture
This specification updates the invitation submission workflow and RSVP interactions to enhance privacy compliance, multi-device accessibility, and pending proposal tracking.

## 2. Updated Organizations Array
Exact allowed values:
`["Enskild/Familj", "Missionärer", "Primärföreningen (barn)", "Hjälpföreningen (kvinnor)", "Äldstekvorum (män)", "Unga Män", "Unga Kvinnor", "Aktivitetskommitten (alla)"]`

## 3. QR / Gateway Publishing Button
- Button text: "Publicera på anslagstavlan via annan enhet".
- Button state: Disabled until all mandatory form fields are completed (`isFormValid`).
- Expands QR code and SMS instructions with 3 exact instruction lines.

## 4. Privacy Consent Checkbox
Exact label wording:
"Jag bekräftar att jag inte delar andras personuppgifter (som namn, kontaktinfo, etc) i inbjudan utan deras uttryckliga godkännande. Jag förstår att min inbjudan granskas innan publicering."

## 5. Automatic Navigation & Pending Proposals Feed
- On successful publish, save the proposal to `my_pending_proposals` in `localStorage`.
- Automatically navigate back to "Inbjudan till dig" (ActiveStream).
- Display user's own pending proposals at top of ActiveStream with badge: "Ditt förslag • Väntar på granskning".

## 6. RSVP / Tacka Ja via Annan Enhet (QR Code)
- In `AlertDetail.tsx`, add clickable button/link: "Tacka Ja via annan enhet".
- Displays expanded QR code with `sms:0736108997` link prefilled with "JA på inbjudan #[ID]".

