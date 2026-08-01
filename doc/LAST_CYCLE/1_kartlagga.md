# Steg 1: Att kartlägga

### Påverkade domäner
- `sms_assistant`
- `anpassa`
- `inbjudningar`
- `mission_router`
- `mobile_pwa_app`
- `skapa_inbjudan`

### Empirisk inventering
- **Mål**: Förbättra hanteringen av admin-loggar i `AdminLogsArea`.
- **Användarbehov & UX-krav**:
  1. Realtidssökning i loggtext via ett dedikerat sökfält.
  2. Nivåfiltrering för loggnivåer (`ALLA`, `INFO`, `WARN`, `ERROR`).
  3. Rensningsknapp/knappsats för att tömma den aktiva loggbufferten.
  4. Tydlig färgkodning och nivåbrickor baserat på loggnivå.
  5. Prestandaoptimering via `useMemo` för att förhindra tröghet.
