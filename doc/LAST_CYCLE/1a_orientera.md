# Steg 1a: Orientering och Tillståndskontroll

- **Tillståndskontroll**: Processrevisor v8.7 är aktiverad med strikt domänisolering (max 1 domän per cykel). Denna cykel initieras dedikerat för domänen `anpassa`.
- **Aktuell domän**: `anpassa`
- **Avbrottsanalys**: Färgvariabler och temaväxling för knappar och modaler har centraliserats i `src/index.css`. Domänen `anpassa` ansvarar för temaväljare, inställningsgränssnitt och preferenser. Vi behöver kartlägga hur tema-, knapp- och modalfärger styrs, säkerställa att inga otillåtna hårdkodade klasser förekommer samt granska att komponenterna i `src/features/anpassa/` uppfyller alla Habit-Hooks (t.ex. tillståndsseparering och typdisciplin).

```json
{
  "status": "OK",
  "current_domain": "anpassa",
  "next_step": "1b_kartlagga"
}
```
