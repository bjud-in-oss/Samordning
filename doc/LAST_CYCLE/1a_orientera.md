# Steg 1a: Orientera (Harmonisering av Anpassa-panelen)

## 1. Bakgrund och Mål
Denna cykel genomför en förfinad och harmonisk uppdatering av inställningspanelen, strikt avgränsad till domänen `anpassa` (`src/features/anpassa/`):

1. **Huvudrubrik och underrubrik i toppsektionen (`OnboardingWizard.tsx`)**:
   - Huvudrubriken sätts till `"Anpassa din tillgänglighet"` utan stjärnikon (`Sparkles` tas bort från rubriken).
   - Underrubriken sätts direkt under till:
     *"Ställ in var och för vem du vill vara tillgänglig. Du är anonym och kan ändra dig eller ta en paus när du vill."*

2. **Aktiveringsknapp vid inaktivt läge (`!pushEnabled`)**:
   - Längst upp i panelen, när notiser/inbjudningar är inaktiverade (`!pushEnabled`), ska aktiveringsknappen finnas kvar högst upp:
     *"Slå på 'Ta emot inbjudningar'"* för att göra det enkelt och smidigt att aktivera mottagandet direkt via `onEnablePush`.

3. **Steg 1 – Områdesval (`OnboardingWizard.tsx` & `Step1Geography.tsx`)**:
   - Rubrik: `"1. Dina områden"`
   - Underrubrik: `"Vilka områden brukar du träffa andra i eller erbjuda stöd i?"`

```json
{
  "status": "ORIENTERING_KLAR",
  "current_domain": "anpassa",
  "next_step": "1b_kartlagga"
}
```
