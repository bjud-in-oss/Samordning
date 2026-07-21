# 1_Scan
- `AdminConsole.tsx`: Behöver WhatsApp-liknande layout. Fixerad botten för input, meddelanden i en flex-1 container som scrollar. Ny exit-knapp.
- `server.ts`:
  - `isTrustedOrAdmin` auto-publicering måste bort i slutet av inkommande-sms. Alla ska sparas som utkast och få previewMessage (även admins).
  - Skapa hanterare för `^[\.#]ta\s*bort\s+(\d+)$/i`.
  - Skapa hanterare för `.?` (Hjälp).
  - Uppdatera texten i `.mall`.
- `Step1Geography.tsx`: Uppdatera `<p>`-taggens copy.

# 2_Blueprint
**AdminConsole.tsx**
- Ändra layouten till en flex-container med `h-screen` (eller liknande) så den fyller fönstret men inte scrollar hela sidan, utan bara chatt-arean.
- Lägg in `<button onClick={() => window.location.href = "/"}>Tillbaka till webbappen</button>`.
- Inmatningsfältet `fixed bottom-0` eller `sticky bottom-0`. Meddelandelistan: `flex-1 overflow-y-auto flex flex-col-reverse` (med `[...prev]` -> `[nytt, ...prev]`) så senaste ligger nederst, ELLER `flex-col` men då måste vi auto-scrolla ner. Vi väljer `flex-col-reverse` för det är enklast.

**server.ts**
- Radera: `if (isTrustedOrAdmin) { ... }` (rad 500-525).
- Lägg till: `const taBortMatch = trimmedText.match(/^[\.#]ta\s*bort\s+(\d+)$/i);`
- Om `taBortMatch`: Hitta id, delete `activeAlerts[id]`, anropa `await broadcastCancelPush(id)`, anropa `saveActiveAlerts()`, returnera `success: true`.
- Om `trimmedText.startsWith('.?')`: Returnera enkel guide: `"Kommandon: .ja [id] (publicera), .nej [id] (avvisa), .ta bort [id] (radera aktiv), .status (lista), .mall (mall för sms)."`

**Step1Geography.tsx**
- Byt ut brödtexten för den svenska och engelska varianten.

# 3_Council_Impact
- **Innovator**: Att bygga ut SMS-protokollet med radering `.ta bort` och hjälpguider gör systemet komplett för administratörer. WhatsApp-layouten är mycket mer användarvänlig på mobila enheter, vilket admins använder ute på fältet.
- **Reflector**: Att vi tar bort `isTrustedOrAdmin`-bypassen säkerställer att ingen oavsiktligt publicerar utan att ha sett utkastet. Det förhindrar formateringsfel.
- **Mediator**: Vi exekverar detta direkt eftersom direktivet kräver det. Blueprint fastställd.
