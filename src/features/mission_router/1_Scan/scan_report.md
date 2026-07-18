# 1_Scan

## Baseline-analys: SMS-inlämning & Nya Admin-kommandon

1. **SMS/QR Publicering i `ActiveStream.tsx`**:
   - `handleSubmitAnnouncement` och `/api/announcements` kan i princip ersättas.
   - När användaren vill publicera kollar vi skärmbredd (`window.innerWidth < 768`).
   - Mobil: Använd `href="sms:0736108997?body=..."`.
   - Desktop: Generera QR med `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=...` (urlencoded text).
   - Textformat: Vi behöver bygga en text som börjar med `#WEBB` och innehåller all formulärdata strukturerat (t.ex. `#WEBB [Område] [Tid] [Kategori] [Målgrupp] [Text]`).

2. **Kommando-förenkling i `server.ts`**:
   - Befintliga stränga kommandon: `#GODKÄNN`, `#AVVISA`, `#DEL`, `#PUBLICERA`, `#AVSÄNDARE`.
   - Nya regex: `/^[#\.]ja\s+(\d+)$/i` -> Godkänn.
   - `/^[#\.]nej\s+(\d+)$/i` -> Avvisa/radera (kombinerar AVVISA och DEL).
   - `/^[#\.]ja$/i` -> Publicera eget utkast.
   - `/^[#\.]ja\s+alla\s+(\d+)$/i` -> Godkänn och lägg till i vitlistan.
   - `/^[#\.]avsändare\s+(.+)$/i` -> Byt avsändare.
   - Rensning av teknisk jargong i alla `replyMessage` i `server.ts`.

3. **Statusrapport & Manual i `server.ts`**:
   - Om inkommande är `.` eller `#` enbart.
   - Sammanställ `activeAlerts` till en lista: "1. Grillkväll (Väntar)\n2. Fika (Aktiv)".
   - Lägg till manualen "Kommandon: .ja [nr], .nej [nr], .ja alla [nr], .avsändare [namn]".

4. **Vitlista (`trusted.json`) i `server.ts`**:
   - En array `trustedNumbers` laddas vid start (fil `data/trusted.json`).
   - Vid inkommande `#WEBB` (eller vanligt inbjudnings-SMS som skapar ett utkast), kolla om `sender` finns i `trustedNumbers` eller är Admin.
   - Om ja -> "active", om nej -> "pending" + meddela Admins.
   - Fixa parsing av inkommande `#WEBB`-meddelanden.
