# Steg 1b: Kartlägga (TCK-SMS-006)

## Svar på GROW-frågor

1. **State**:
   *Svar*: Genom att `pairDeviceToken` sparar både original och `.toLowerCase()` i in-memory Setet `pairedDevices` och synkroniserar till `data/paired_devices.json`, samt att `loadPairedDevices()` initialt läser in denna diskfil, förblir tillståndet intakt över omstarter även vid saknad databasbehörighet.

2. **Contract**:
   *Svar*: Ändpunkten `/api/admin/check-pairing` i `src/server/routes.ts` inspekterar minnes-Setet `pairedDevices` direkt. Om koden (eller dess gemena variant) finns, returneras `{ paired: true, verified: true }` omedelbart utan att invänta Firestore-uppslag.

3. **Resilience**:
   *Svar*: I `initServerStorage()` sparas unsubscribe-funktionerna från `onSnapshot`. Vid fel (såsom `permission-denied`) anropas unsubscribe genast för att avbryta gRPC-strömmens återanslutningsloop. En ren logg skrivs en gång: `[Firestore] Ingen databasbehörighet. Kör i helt lokalt RAM- och disk-läge.`. Alla övriga Firestore-anrop fångar behörighetsfel defensivt utan att störa konsolen.

```json
{
  "status": "In Progress",
  "current_domain": "Global",
  "next_step": "2a",
  "ticket_id": "TCK-SMS-006",
  "active_skill": "systemarkitekt",
  "active_vectors": ["Resilience"]
}
```
