# Steg 4: Producera (TCK-SMS-004)

## Utförda ändringar

1. **Enhetstester (TDD)**:
   - `src/features/sms_assistant/components/__tests__/AdminConsole.test.tsx`:
     - Testar parningsanrop mot `/api/admin/check-pairing?token=...`.
     - Testar hämtning av `/api/alerts` och filtrering mellan `pending` och `active`.
     - Testar interaktiva flikbyten och rendering av aktiva anslag.

2. **API-ändpunktskorrigering i Custom Hook**:
   - `src/features/sms_assistant/hooks/useAdminConsole.ts`:
     - Ändrade parningskontroll till `/api/admin/check-pairing?token=${encodeURIComponent(token)}`.
     - Ändrade hämtning till `/api/alerts` med strikt filtrering för `pending` och `active`.
     - Ändrade `handleApprove` till `POST /api/alerts/${encodeURIComponent(id)}/status` med `{ status: "active", trustSender }`.
     - Ändrade `handleRejectOrDelete` till `POST /api/alerts/${encodeURIComponent(id)}/status` med `{ status: "rejected" }`.
