# Steg 3c: Fil-operativ Källkodsspecifikation (TCK-SMS-003)

## Ändringsmanifest (Endast 1 domän: sms_assistant)

### 1. Zod-schema och Datakontrakt
- **Fil**: `src/features/sms_assistant/domain/schema.ts`
- **Syfte**: Skapa körtidsvalidering för `sms_assistant` med Zod.
- **Innehåll**:
  - `AdminDeviceTokenSchema`: z.string().min(5)
  - `AdminPairingStatusSchema`: z.object({ paired: z.boolean() })
  - `AlertItemSchema`: z.object({...})

### 2. Custom Hook för administration
- **Fil**: `src/features/sms_assistant/hooks/useAdminConsole.ts`
- **Syfte**: Extrahera hooks och asynkron datahantering från vyn.
- **Specifikation**:
  - Synkron initiering av `deviceToken`:
    ```ts
    const [deviceToken] = useState<string>(() => {
      let token = localStorage.getItem("admin_device_token");
      if (!token) {
        token = "dev_tok_" + Math.random().toString(36).substring(2, 11);
        localStorage.setItem("admin_device_token", token);
      }
      return token;
    });
    ```
  - Hantering av `isPaired`, `checkingPairing`, `pendingAlerts`, `activeAlertsList`, `activeTab`.
  - Funktioner: `fetchAlerts`, `handleApprove`, `handleRejectOrDelete`, `checkPairingStatus`, `handleLogout`.

### 3. Komponentrefaktorisering
- **Fil**: `src/features/sms_assistant/components/AdminConsole.tsx`
- **Syfte**: Använda `useAdminConsole` och hålla komponenten ren, typad och fri från `fetch()` eller hook-läckage.
- **Specifikation**:
  - Rendera `PairingGate` med `token={deviceToken}` och `onRefresh={() => checkPairingStatus(deviceToken)}`.
  - Rendera flikar och anslagslistor baserat på hook-tillståndet.

### 4. Enhetstester (TDD)
- **Fil**: `src/features/sms_assistant/components/__tests__/AdminConsole.test.tsx`
- **Syfte**: Verifiera synkron `deviceToken`-initiering och komponentens rendering.
- **Specifikation**:
  - Verifiera att `deviceToken` skapas direkt i `localStorage` och skickas till `PairingGate`.
  - Verifiera interaktion via `fireEvent.click`.
