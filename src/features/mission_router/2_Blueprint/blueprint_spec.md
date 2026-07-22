// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/anpassa/2_Blueprint]

# Arkitekturspecifikation: Återställning av Osynlig Ticker, Fällbara Inställningar och Resursspråktext

## 1. Osynlig Header-Ticker (`src/features/anpassa/SettingsTicker.tsx` & `App.tsx`)
- Skapa komponenten `SettingsTicker.tsx` under `src/features/anpassa/`.
- Tickern ska vara HELT OSYNLIG utan bakgrundskort, tiles, piller eller kanter (`bg-transparent border-0 p-0`, ren text).
- Skiftar mjukt var 3,5:e sekund bredvid rubriken H1 "Inbjudan till dig":
  1. `• i [Kortedala, Bergsjön]` (eller valt primärområde / alla områden)
  2. `• på [Svenska]` (eller valda språk)
  3. `• för [Alla]` (eller valda målgrupper)
- Klick på den rena osynliga texten navigerar användaren direkt till "Anpassa" (`setCurrentView('settings')`).

## 2. Fällbara Djupa Inställningar (`src/features/anpassa/OnboardingWizard.tsx`)
- Sektion 1 (Dina områden) och Sektion 2 (Inbjudningar du vill se) visas alltid öppna.
- Sektion 3 (Deltagandesätt) och Sektion 4 (Språk) döljs bakom den fällbara knappen `"⚙️ Visa fler inställningar"`.

## 3. Språktext-tvätt (`translations.ts` & `OnboardingWizard.tsx`)
- Uppdatera hjälptexten under Sektion 4 (Språk) i `OnboardingWizard.tsx` samt `step2Subtitle` i `translations.ts` till resurstanken:
  `"Vilka språk förstår du eller kan hjälpa till att översätta på?"`

## 4. Vardagstext vid Tomt Tillstånd (`src/features/inbjudningar/ActiveStream.tsx`)
- Säkerställ att det tomma flödestillståndet visar vardagstexten och snabbknappen:
  `"Ska du ändå ta en fika, promenad eller fixa något i trädgården?"`
  `"[ ➕ Skapa en snabb inbjudan för det du redan gör ]"`
