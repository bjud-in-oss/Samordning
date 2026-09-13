# Steg 2b: Evaluera yttre anpassning (TCK-SMS-004)

## Yttre anpassning och Systemkoherens
- Serverrutterna i `src/server/routes.ts` och `src/server/adminMemberRoutes.ts` förblir oförändrade och auktoritativa.
- `useAdminConsole.ts` anpassas direkt till serverns befintliga implementation:
  - `GET /api/admin/check-pairing?token=...`
  - `GET /api/alerts`
  - `POST /api/alerts/:id/status`
- Klientgränssnittet i `AdminConsole.tsx` fortsätter att konsumera `useAdminConsole` utan några ändringar i sitt publika API eller dess props.
