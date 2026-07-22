// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/2_Blueprint]

# Arkitekturspecifikation: Etapp 1 - Dynamisk Header-ticker, Introskärm, Tomt-tillstånd och Skaparförenklingar

## 1. Mål och Funktionsöversikt
Etapp 1 uppgraderar hela gränssnittsflödet för inbjudningsplattformen med fokus på användarvänlighet, tydlighet och förenklad inbjudandeproduktion:

1. **Dynamisk Header-ticker (`App.tsx`)**:
   - Intill rubriken "Inbjudan till dig" visas ett interaktivt chip som mjukt animerar/växlar mellan användarens valda inställningar:
     * `i [Kortedala, Bergsjön]` (eller valt område / `Alla områden`)
     * `på [Svenska, ...]`
     * `för [Alla / Valda målgrupper]`
   - Klick på chipet öppnar reaktivt inställningsvyn ("Anpassa").

2. **Introskärm med två vägar (`App.tsx` & `translations.ts`)**:
   - Tydlig förklaring av hur aviseringar fungerar och var de aktiveras.
   - Ersätter den gamla enskilda knappen med två direkta alternativ:
     * `[ OK, uppfattat ]`: Går direkt till inbjudningsströmmen.
     * `[ ⚙️ Anpassa notiser ]`: Öppnar inställningsvyn "Anpassa" direkt.

3. **Dynamiskt Tomt-tillstånd (`ActiveStream.tsx`)**:
   - `ActiveStream` tar emot `pushEnabled: boolean`.
   - Om `pushEnabled === true`: *"Just nu finns inga aktiva inbjudningar i dina valda områden. Du får en avisering så fort en ny inbjudan läggs upp."*
   - Om `pushEnabled === false`: *"Just nu finns inga aktiva inbjudningar i dina valda områden. Du ser nya inbjudningar här så fort de läggs upp."*
   - Inkluderar mjuk handlingsuppmaning: *"Ska du ändå ta en fika, promenad eller fixa något i trädgården?"* med knappen `[ ➕ Skapa en snabb inbjudan för det du redan gör ]`.

4. **Collapsible djupa inställningar (`OnboardingWizard.tsx`)**:
   - Sektion 1 (Områden) och Sektion 2 (Målgrupper) är öppna från början.
   - Sektion 3 (Deltagandesätt) och Sektion 4 (Språk) döljs bakom knappen `⚙️ Visa fler inställningar` (och fälls ut vid klick).

5. **Förifyllning av områden & Skapar-FAB (`ActiveStream.tsx` / `Step1Geography.tsx`)**:
   - I skaparformuläret förifylls "Bjud in från områden" med alla valda områden i profilen (t.ex. "Bergsjön, Kortedala"), eller "Alla områden".
   - Flytande knapp (`+`) förankras inom den centrerade `max-w-xl`-containern nära flödet.
   - När formuläret fälls ut visas den tydliga rubriken "Bjud in andra" överst.
   - `Step1Geography.tsx` får en explicit snabbknapp för `Alla områden`.

6. **Total WhatsApp-sanering (`server.ts` & `parser.ts`)**:
   - Rensa samtliga texter, kommentarer, mockar och routar från ordet "WhatsApp". Tjänsten drivs uteslutande via SMS och Web Push / Android PWA.

---

## 2. Berörda Filer
- `src/App.tsx`
- `src/features/inbjudningar/ActiveStream.tsx`
- `src/features/anpassa/OnboardingWizard.tsx`
- `src/features/anpassa/Step1Geography.tsx`
- `src/features/mission_router/translations.ts`
- `server.ts`
- `src/features/mission_router/domain/parser.ts`
