# Steg 1a: Orientera (TCK-015: Permanent persistens för admin-telefonnummer över serveromstarter)

## Sokratiska GROW-frågor inriktade på tillståndsvektorerna (State & Resilience)

1. **State (Tillstånd & Persistens)**: Hur säkerställer vi att nyss registrerade eller borttagna administratörsnummer omedelbart och atomärt synkroniseras till både det lokala filsystemet (`data/admins.json`) och Cloud Firestore (`system_config/admins`) utan att blockera händelseloopen eller tappa RAM-konsistens?
2. **State & Resilience (Inläsning och Flerkällssammanfogning)**: Hur ska `loadAdmins()` konstrueras så att den vid serverstart robust läser och deduplicerar telefonnummer från miljövariabler (`ADMIN_NUMBERS`), lokal diskfil (`data/admins.json`) och Firestore, även om filsystemet är tomt eller Firestore har tillfällig nätverkslatens?
3. **Resilience (TDD & Verifierbarhet)**: Vilken specifik testmetodik i `src/server/__tests__/storage.test.ts` verifierar att sparade admin-nummer kvarstår efter att in-memory-arrayen nollställts och `loadAdmins()` anropas på nytt?

```json
{
  "status": "IN_PROGRESS",
  "current_domain": "Global",
  "next_step": "1b_kartlagga",
  "ticket_id": "TCK-015",
  "active_skill": "wayfinder"
}
```
