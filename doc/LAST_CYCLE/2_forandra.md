# Steg 2: Att förändra

- **Planerade förändringar**:
  1. **Städning & Sanering**:
     - Ta bort `src/features/healthcheck` och `src/features/exportering`.
     - Ta bort `doc/features/healthcheck` och `doc/features/exportering`.
     - Rensa bort `HealthStatusWidget` och `ExportButton` från `MainViewContent.tsx`.
     - Rensa bort URL-bakdörren `?admin=true` / `?user=admin` från `App.tsx`.
     - Ersätt lösenordspropt `"utby2026"` i `useAppState.ts` med SMS/QR-enhetsparning och persistering i `localStorage`.
  2. **Lösenordsfri SMS Admin-parning**:
     - Vid admin-aktivering kontrolleras `admin_device_token` mot `/api/admin/check-pairing`.
     - Om enheten är parats blir användaren godkänd som admin och förblir inloggad i `localStorage`.
     - Om den ej är parats visas `PairingGate` med SMS-länk och QR-kod.
  3. **Platt Admin-hantering & Betrodda Skapare**:
     - Skapa `AdminMembersPanel` i `sms_assistant` för att visa, lägga till och ta bort administratörer och betrodda skapare.
     - Implementera API-ändpunkter: `GET /api/admin/members`, `POST /api/admin/members/add`, `POST /api/admin/members/remove`.
     - Stöd SMS-kommandon: `.admin +<nr>`, `.admin -<nr>`, `.betrodd +<nr>`, `.betrodd -<nr>`.
  4. **Aktiv Moderering**:
     - Förbättra modereringskön `PendingAlertsQueue` i `AdminConsole` med åtgärder för att godkänna, avböja samt godkänna & vitlista avsändaren.
     - Inbjudningar från betrodda skapare publiceras direkt (`status: "active"`).
