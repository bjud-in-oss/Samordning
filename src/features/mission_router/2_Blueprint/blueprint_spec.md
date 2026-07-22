// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/anpassa/2_Blueprint]

# Arkitekturspecifikation: Ultrakort Språktext och En-i-Taget-Rotering i SettingsTicker

## 1. Ultrakort Språktext (`src/features/anpassa/SettingsTicker.tsx`)
- Ändra textprefixet för språksteg från `• översätta till [Språk]` till det ultrakorta `• översätta [Språk]`.
- Exempel:
  - `• översätta [Svenska]`
  - `• översätta [Engelska]`

## 2. En-i-Taget Rotering för Områden & Språk
- Om användaren har valt flera områden (i `limitedAreas`) eller flera språk (i `languages`), roteras ett enskilt element i taget per rondering för att garantera att hela textraden ryms på en enda rad i mobila vyportar utan radbrytning eller klumpiga piller/tiles.
- Rotationslogiken hålls ren och tidsstyrd (3,5 sekunders intervall) via intern tillståndshantering (`subIndex`).
- Texten är helt ramlös (`bg-transparent`, `border-0`, `shadow-none`, `p-0`) och fungerar som en direkt klickbar länk till inställningar.
