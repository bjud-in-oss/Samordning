// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/3_Council_Impact]

# Rådslagsdebatt & Synkroniserings-/Konsekvensanalys (PWA-Formulär, Introtext, Områdesväljare & Moderering)

## Rådslagsdebatt (Dialektisk analys)

### The Innovator (Att förändra)
> "Att föra in moderering av väntande inbjudningar (`status === 'pending'`) direkt i det ordinarie flödet för administratörer gör arbetsflödet otroligt smidigt. Admin ser direkt vad som inkommit och kan godkänna eller kontakta avsändaren via SMS/samtal med ett klick. Dessutom ger de personliga favoriterna i PWA-formuläret användare möjlighet att återanvända sina vanliga inbjudningar på en sekund!"

### The Reflector (Att vända)
> "Vi måste säkerställa att vanliga användare aldrig råkar se `pending`-poster i flödet. Endast `active` ska synas för allmänheten. Vidare var 'Alla/Ingen'-knapparna i `Step1Geography.tsx` tidigare låsta som separata tillstånd; omvandlingen till rena snabbåtgärder ('Markera alla' / 'Rensa alla') löser detta helt. Android textjusteringen i `index.css` förhindrar också att PWA-texten blir extremt liten på vissa Android-skärmar."

### The Mediator (Att förlika)
> "Syntesen är tydlig och stark. Vi genomför följande i `4_Produce`:
> 1. Uppdaterar `ActiveStream.tsx` med ny rubrik ('Inbjudan till dig'), expanderbar introtext, ansvarsfriskrivning under funktionsknapparna samt modereringssektion för admins med direkta godkännande-, avvisnings- och kontaktknappar.
> 2. Bygger om `CreateInvitationForm.tsx` med flexibla reglage, modaler för tid/plats/område/målgrupp och sparande av personliga favoriter i `localStorage`.
> 3. Korrigerar `Step1Geography.tsx` så att 'Alla' och 'Ingen' fungerar som rena snabbknappar.
> 4. Lägger till `-webkit-text-size-adjust: 100%; text-size-adjust: 100%;` i `src/index.css`.
> 5. Uppdaterar `server.ts` för godkännande/avslag och korrekt `status: 'pending'` tilldelning vid nya inbjudningar."

---

## Architectural Synchronization & Impact Analysis

### Operativa filer att modifiera i `4_Produce`:
1. `src/features/inbjudningar/ActiveStream.tsx`:
   - Rubrik "Inbjudan till dig" & expanderbar ingress med "...läs mer".
   - Ansvarsfriskrivning placeras under funktionsknapparna.
   - Moderingspanel överst i flödet för admin (`status === 'pending'`) med Godkänn/Avvisa och Ring/SMS.
   - Filtrerar bort `pending` för icke-admins.

2. `src/features/skapa_inbjudan/CreateInvitationForm.tsx`:
   - Flexibelt PWA-formulär med öppet textfält och modalval.
   - Spara/Ladda personliga favoriter via `localStorage`.

3. `src/features/anpassa/Step1Geography.tsx`:
   - Snabbåtgärder för "Alla områden" (markera alla) och "Inget område" (rensa alla).

4. `src/features/sms_assistant/components/AdminConsole.tsx`:
   - Lista och godkänn/avvisa `pending`-poster.

5. `src/features/mission_router/translations.ts`:
   - Nya översättningsnycklar för introtext, "...läs mer", favoriter m.m.

6. `src/index.css`:
   - Textstorleksjustering för Android PWA (`text-size-adjust: 100%`).

7. `server.ts`:
   - API endpoints för att uppdatera alert status (`/api/alerts/:id/status`) och tilldela `status: 'pending'` för okända avsändare.

### Beslut:
- **Route Forward**: Steg till `4_Produce` godkänt.


