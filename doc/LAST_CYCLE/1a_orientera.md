# Steg 1a: Orientera (Förenkling och Förbättring av Anpassningspanelen)

## 1. Bakgrund och Mål
Denna cykel etablerar en renare, varmare och mer intuitiv anpassningspanel (`OnboardingWizard.tsx`) inom domänen `anpassa`:
1. **Ny och ren rubrik**: Ändra panelens huvudrubrik till `"Välj var du vill ta emot inbjudningar"` i klassisk serif, och ta bort stjärnikonen (`Sparkles`) framför rubriken för ett lugnt och harmoniskt typografiskt uttryck.
2. **Rensa passiva påminnelser**: Ta bort den gamla passiva rutan med instruktionstext om att slå på inbjudningar i toppfältet.
3. **Aktiv knapp i panelen**: Om panelen öppnas medan inbjudningsfunktionen är avstängd (`!pushEnabled`), visa en tydlig och inbjudande knapp längst upp: `"Slå på 'Ta emot inbjudningar'"` som omedelbart aktiverar mottagandet direkt inifrån panelen.

```json
{
  "status": "ORIENTERING_KLAR",
  "current_domain": "anpassa",
  "next_step": "1b_kartlagga"
}
```
