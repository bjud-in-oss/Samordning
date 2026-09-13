# Steg 1b: Kartlägga (TCK-SMS-004)

## Svar på GROW-frågor

1. **Contract**:
   *Svar*: Serverrutterna i `adminMemberRoutes.ts` exponerar `GET /api/admin/check-pairing?token=...` och `POST /api/alerts/:id/status`. I `routes.ts` returnerar `GET /api/alerts` en lista med anslagsobjekt. Genom att uppdatera `useAdminConsole.ts` till exakt dessa URL:er och payloads skapas 100 % konformitet med serverkontraktet.

2. **Effects**:
   *Svar*: Efter ett lyckat statusanrop (`POST /api/alerts/${id}/status`) anropas `fetchAlerts()` på nytt, vilket hämtar den aktuella alert-listan från servern och applicerar filtreringen för `pending` och `active`.

3. **Resilience**:
   *Svar*: Befintliga `try/catch`-block med lokal `localStorage`-fallback behålls och skyddar gränssnittet mot krascher om nätverket fallerar, samtidigt som varningar loggas kontrollerat.

```json
{
  "status": "In Progress",
  "current_domain": "sms_assistant",
  "next_step": "2a",
  "ticket_id": "TCK-SMS-004",
  "active_skill": "systemarkitekt",
  "active_vectors": ["Contract"]
}
```
