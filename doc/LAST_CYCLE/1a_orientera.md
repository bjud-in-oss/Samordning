# Steg 1a: Orientera (TCK-016: Integrera realtidsöversättning och Gemini Live-server)

## Mål
Slå ihop översättningsrepot med vårt huvudprojekt Samordning, så att realtidsöversättningen blir en integrerad feature (`live_translation`) under `src/features/live_translation/` med komplett exportfasad och Zod-validering.

## Sokratiska GROW-frågor inriktade på tillståndsvektorerna (Contract)

1. **Contract (Fasad & Exporter)**: Hur säkerställs att `src/features/live_translation/index.ts` tillhandahåller en strikt, namngiven fasad utan stjärnexporter (`export *`) för alla krokar, komponenter och domänadaptrar?
2. **Contract (Zod-validering)**: Hur garanteras att språkkoder, sessionskonfigurationer och transportstatusar valideras vid körtid via kompletta Zod-scheman i `src/features/live_translation/domain/schema.ts`?
3. **Contract (TDD & Arkitekturverifiering)**: Hur verifierar vi att samtliga enhetstester under `src/features/live_translation/` uppfyller FSD- och kontraktkrav utan anmärkningar via `npm run verify`?

```json
{
  "status": "IN_PROGRESS",
  "current_domain": "live_translation",
  "next_step": "1b_kartlagga",
  "ticket_id": "TCK-016",
  "active_skill": "wayfinder"
}
```
