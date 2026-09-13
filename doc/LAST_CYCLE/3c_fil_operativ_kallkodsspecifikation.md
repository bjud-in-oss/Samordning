# Steg 3c: Fil-operativ Källkodsspecifikation (TCK-SMS-004)

## Ändringsmanifest (Endast 1 domän: sms_assistant)

### 1. Enhetstester (TDD)
- **Fil**: `src/features/sms_assistant/components/__tests__/AdminConsole.test.tsx`
- **Syfte**: Verifiera att de uppdaterade API-rutterna anropas korrekt från komponenten/hooken och att parningskontroll samt interaktioner fungerar.
- **Specifikation**:
  - Mocka `fetch` för `/api/admin/check-pairing` och `/api/alerts`.
  - Verifiera parningsanrop mot `/api/admin/check-pairing?token=...`.
  - Verifiera interaktion och uppdatering via `fireEvent.click`.

### 2. Custom Hook: API-ändpunkter
- **Fil**: `src/features/sms_assistant/hooks/useAdminConsole.ts`
- **Syfte**: Korrigera rutterna så att de matchar Express-servern i `src/server/routes.ts` och `src/server/adminMemberRoutes.ts`.
- **Specifikation**:
  - `checkPairingStatus`:
    ```ts
    const res = await fetch(`/api/admin/check-pairing?token=${encodeURIComponent(token)}`);
    ```
  - `fetchAlerts`:
    ```ts
    const res = await fetch("/api/alerts");
    const data = await res.json();
    const alerts: AlertItem[] = Array.isArray(data) ? data : [];
    const pending = alerts.filter(
      (item) => item.status === "pending" || item.status === "pending_review"
    );
    const active = alerts.filter(
      (item) => item.status !== "pending" && item.status !== "pending_review" && item.status !== "rejected"
    );
    setPendingAlerts(pending);
    setActiveAlertsList(active);
    ```
  - `handleApprove`:
    ```ts
    const res = await fetch(`/api/alerts/${encodeURIComponent(id)}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "active", trustSender }),
    });
    ```
  - `handleRejectOrDelete`:
    ```ts
    const res = await fetch(`/api/alerts/${encodeURIComponent(id)}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" }),
    });
    ```
