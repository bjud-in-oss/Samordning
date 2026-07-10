# 2_Blueprint: Arkitektur & Datamodell för "Inbjudan till dig"

## 1. Datamodell (`types.ts`)
Vi utökar `ActiveAlert` till att representera öppna inbjudningar med stöd för kategorier och fullbokningsstatus:

```typescript
export interface ActiveAlert {
  id: string; // Slumpmässigt unikt ID
  type: "missionary_alert" | "leader_invitation";
  rawText: string;
  scrubbedText: string;
  area: string; // Område i Göteborg
  locationName: string; // Plats
  time: string; // Klockslag
  category: "Måltid & Gemenskap" | "Lektion & Samtal" | "Tjänande" | string;
  isFull?: boolean; // Flagga för fullbokat/stängt
  responsibleParty: string; // Arrangör/Titel
  contactValue: string; // Telefonnummer till arrangören (döljs bakom djuplänk)
  expiryTimestamp: number; // TTL (Klockslag för aktiviteten + 2 timmar)
}
```

## 2. SMS-Gateway (`server.ts` & `/api/incoming-sms`)
Mottagare av JSON-payload: `{ sender: string, text: string }`.

### A. Administrativa Kommandon
* **`DEL <ID>`**: Raderar kortet helt från RAM.
* **`FULL <ID>`**: Sätter `isFull: true` på kortet.
* *Behörighetskontroll*: Endast om `sender === contactValue` (arrangören) eller om numret finns i `ADMIN_NUMBERS`.

### B. Ny inbjudan via SMS-mall
Eftersom vi skrotar Gemini bygger vi en robust och förutsägbar mall-parser (regex-fallback) i `parser.ts` som läser inkommande SMS i följande format:
> `[KORTEDALA] [18:00] [Måltid & Gemenskap] [Middag hos familjen Andersson. Välkomna!] [Hjälpföreningen] [0701234567]`
* Om texten inte matchar formatet skapas ändå en inbjudan med standardvärden där hela texten bevaras i `scrubbedText` för att undvika dataförlust.

## 3. Expireringsmotor (TTL)
En loop körs varje minut i `server.ts`:
```typescript
setInterval(() => {
  const now = Date.now();
  for (const [id, alert] of Object.entries(activeAlerts)) {
    if (alert.expiryTimestamp < now) {
      delete activeAlerts[id];
      console.log(`[TTL] Inbjudan ${id} har passerat sin sluttid med >2 timmar och raderats.`);
    }
  }
}, 60000);
```

## 4. Frontend-ändringar (`AlertDetail.tsx`)
* **Badge**: Visar `alert.category` tydligt högst upp.
* **Fullbokad status**: Om `alert.isFull === true` döljs OSA-knappen helt och texten *"Denna aktivitet är nu fullbokad. Välkommen nästa gång!"* visas.
* **SMS-djuplänk**:
  - `href="sms:<contactValue>?body=Hej! Jag vill gärna tacka ja till inbjudan: [Titel] i [Område] kl [Tid]."`
* **Ansvarsfriskrivning (§ 33.8)**: Ny, exakt juridiskt ren text i botten av kortet.
