// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/3_Council_Impact]

# Council Impact Debate: Etapp 1 - Dynamisk Header-ticker, Introskärm, Tomt-tillstånd och Skaparförenklingar

## Dialektisk Analys

### The Innovator (Att förändra)
Genom att införa den dynamiska inställningstickern i headern och erbjuda två direkta vägar på introskärmen får användaren direkt visuell återkoppling om sina aktiva filter. Att förifylla samtliga profilerade områden i skaparformuläret samt göra djupa inställningar ihopfällbara minskar kognitiv belastning och ökar sannolikheten att medlemmar skapar inbjudningar spontant.

### The Reflector (Att vända)
Vid sanering av WhatsApp-referenser i `server.ts` och `parser.ts` måste vi säkerställa att inga endpoints som klienten eller externa system anropar bryts eller lämnas hängande. Dessutom måste det dynamiska tomt-tillståndet i `ActiveStream` reagera sömlöst på `pushEnabled`-tillståndet från `App.tsx`.

### The Mediator (Att förlika)
Rådet godkänner specifikationen för Etapp 1. Alla gränssnittsändringar genomförs med bevarande av gällande layout och färgschema, och WhatsApp-routarna fasas ut till förmån för rena SMS/Web Push-flöden.

---

## Architectural Synchronization & Impact Analysis

### Operativa filer som uppdateras i 4_Produce:
1. **`src/App.tsx`**:
   - Ticker-chip i headern med mjuk växling av profildata (område, språk, målgrupp).
   - Introskärm uppdaterad med två vägval ([ OK, uppfattat ] & [ ⚙️ Anpassa notiser ]).
   - Passar `pushEnabled` till `ActiveStream`.

2. **`src/features/inbjudningar/ActiveStream.tsx`**:
   - Dynamiskt tomt-tillstånd anpassat efter `pushEnabled`.
   - Mjuk uppmaning med knapp att skapa snabb inbjudan.
   - Förifyller fältet "Bjud in från områden" med användarens valda områden (kommaseparerat) eller "Alla områden".
   - FAB (+)-knapp förankrad vid `max-w-xl`-containern med rubriken "Bjud in andra" i formuläret.

3. **`src/features/anpassa/OnboardingWizard.tsx`**:
   - Ihopfällbara djupa inställningar (Sektion 3 & 4 bakom "⚙️ Visa fler inställningar").

4. **`src/features/anpassa/Step1Geography.tsx`**:
   - Tydlig knapp för "Alla områden".

5. **`src/features/mission_router/translations.ts`**:
   - Nya översättningsnycklar för intro-knappar och ticker-etiketter.

6. **`server.ts` & `src/features/mission_router/domain/parser.ts`**:
   - Total sanering av alla WhatsApp-referenser, koder och routar.

Rutning: Framåt till 4_Produce.
