# Steg 2e: Försoning och förlikning (TCK-SMS-004)

## Målkonflikter och Lösning
- **Konflikt**: Tidigare använde klientkoden fiktiva endpoints (`/api/admin/alerts`, `/api/admin/approve-alert`, `/api/admin/reject-alert`), medan Express-servern definierat `POST /api/alerts/:id/status` och `GET /api/alerts`.
- **Lösning**: `useAdminConsole.ts` anpassas helt till de faktiska serverrutterna och filtrerar `GET /api/alerts` lokalt i klienten enligt reglerna för `pending` och `active`.
- **Konflikt**: Om servern returnerar fel eller om nätverket är otillgängligt måste klienten fortsätta fungera.
- **Lösning**: Fallback-logik till `localStorage` behålls i `catch`-blocken så att offline-funktionalitet bibehålls.

MÄTTNAD: JA
