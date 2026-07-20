# BLUEPRINT: UX-optimering, Områdesväljare och Admin-mall

## Arkitektoniska och UX-beslut
1. **Mobilanpassning (Enrads-layout för notiskort):**
   - Huvudkortet för notisinställningar i `App.tsx` ska rymmas på en enda rad på mobil för att spara vertikalt utrymme.
   - Kugghjulsikonen döljs (`hidden sm:inline`), padding och textstorlek skalas ner (`text-[10px] sm:text-xs`).

2. **Dubbletter av State-kontroller:**
   - Ikoner/Toggles som styr globalt state (`pushEnabled`) får inte existera på flera ställen samtidigt om de skapar otydlighet. Togglen i `OnboardingWizard.tsx` tas bort eftersom kortet i `App.tsx` redan uppfyller denna funktion.

3. **Visuell Validering (Kartväljare vs Select):**
   - För att välja "Primärt område" i `ActiveStream.tsx` är en traditionell `<select>` klumpig för många geografiska områden. Vi planerar att byta ut `<select>` mot en knapp som expanderar den befintliga visuella kartkomponenten (`Step1Geography`) inline, men som default fylls fältet automatiskt med `savedTags?.primaryArea`.

4. **Snabba Admin-kommandon (.mall):**
   - För att underlätta inmatning via SMS implementeras kommandot `.mall` som returnerar ett tomt, formaterat skelett för inbjudningar direkt till administratörens SMS-klient.

## Nya Domändata (Göteborgsområden)
- "Bergsjön & Gärdsås" adderas till den fasta domänstrukturen i `parser.ts` (STODDISTRIKT och GEOMAP) för fullt stöd.
