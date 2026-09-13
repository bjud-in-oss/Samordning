# Steg 1a: Orientera (TCK-SMS-004)

## Mål och Omfång
Synkronisera API-ändpunkterna i `useAdminConsole.ts` med Express-serverns rutter i `src/server/routes.ts` och `src/server/adminMemberRoutes.ts`:
1. `checkPairingStatus`: Ändra anropet från `/api/admin/pairing-status` till `/api/admin/check-pairing?token=${encodeURIComponent(token)}`.
2. `fetchAlerts`: Ändra från `/api/admin/alerts` till `/api/alerts`. Hämta arrayen och filtrera:
   - `pending`: poster där `status === 'pending' || status === 'pending_review'`.
   - `active`: poster där `status !== 'pending' && status !== 'pending_review' && status !== 'rejected'`.
3. `handleApprove`: Ändra från `/api/admin/approve-alert` till `POST /api/alerts/${id}/status` med body `{ status: "active", trustSender }`.
4. `handleRejectOrDelete`: Ändra från `/api/admin/reject-alert` / `/api/admin/delete-alert` till `POST /api/alerts/${id}/status` med body `{ status: "rejected" }`.

## GROW-frågor (Risknoder: Contract, Effects, Resilience)

1. **Contract**:
   *Fråga*: Hur synkroniseras API-kontraktet mellan frontend-hooken `useAdminConsole` och backendens Express-rutter så att parametrar och payload-strukturer matchar serverns implementation exakt?

2. **Effects**:
   *Fråga*: Hur säkerställs att godkännande eller avvisande av anslag (`POST /api/alerts/:id/status`) omedelbart propagerar och uppdaterar listorna i både aktivt tillstånd och väntande kö?

3. **Resilience**:
   *Fråga*: Hur bibehålls motståndskraft och offline-fallback vid nätverksfel så att administrationskonsolen förblir användbar även om backend-tjänsten är temporärt onåbar?
