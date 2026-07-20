[CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/3_Council_Impact]

# 1_Scan
- **Vit skärm (React-krasch)**: Linter-utdata visar `error TS2304: Cannot find name 'isInline'` i `src/features/mission_router/components/onboarding/Step1Geography.tsx`. Felet beror på att prop:en `isInline` deklarerades i interfacet men glömdes bort i destruktureringen av funktionens argument, vilket orsakade ett ReferenceError vid rendering. Detta ledde i sin tur till vit skärm då hela komponentträdet kraschar.
- **Notis-switch (`App.tsx`)**: Texten förminskades till `text-[10px] sm:text-xs` i tidigare cykel. `Anpassa`-knappens kugghjul har redan `hidden sm:inline`. Vi kommer att återställa textstorleken till `text-[15px] sm:text-base` och justera layouten för att passa mobilen.
- **Global Admin-ikon (`App.tsx`)**: Sidhuvudet har en sektion för "HÖGER SIDA" där språkväljaren finns. Det är en perfekt plats för en diskret admin-sköld (`Shield`).

# 2_Blueprint
- **`Step1Geography.tsx`**: Lägg till `isInline` i komponentens destrukturering: `function Step1Geography({ ..., isInline }: Step1GeographyProps)`.
- **`App.tsx`**:
  - `const [isAdmin, setIsAdmin] = useState<boolean>(() => localStorage.getItem('isAdmin') === 'true');`
  - I sidhuvudet, bredvid språkväljaren, placera en `<button>` med en `<Shield size={18} />`. Vid klick visas `prompt("Ange admin-lösenord:")`. Om inmatningen är "utby2026", sätts state och localStorage till `true`.
  - Återställ storleken på texten för notis-switchen till `text-[15px] sm:text-base` och minska paddingen på mobila enheter. Vi döljer istället anpassa-kugghjulet/knappen helt på de minsta mobilskärmarna om platsen blir för trång (vi ser till att det löses enbart genom spacing och dölja ikoner).
  - Skicka med `isAdmin={isAdmin}` till `<ActiveStream />`.
- **`ActiveStream.tsx`**:
  - Lägg till `isAdmin?: boolean;` i `ActiveStreamProps`.

# 3_Council_Impact
- **Innovator**: Admin-ikonen är ett klassiskt "Power User"-mönster som håller gränssnittet rent för vanliga användare. Att fixa kraschen är såklart prioritet 1, men att smidigt skicka `isAdmin` ner i trädet möjliggör framtida adminverktyg per inbjudan.
- **Reflector**: Glömd destrukturering var exakt felet. Vi måste vara rigorösa med Typescript-kompilering. Att ändra tillbaka fontstorleken på switchen är helt rätt; på mobil måste tryckytor och text vara lättlästa. 
- **Mediator**: Vi har en exakt och avgränsad plan. Kraschen är isolerad och enkel att åtgärda. Admin-knappen integreras smidigt.

Blueprint fastställd och granskad.

VÄLJ EN PROCESSÅTGÄRD:
- Godkänn och fortsätt till 4_Produce.
- Kör ULTRATHINK.
