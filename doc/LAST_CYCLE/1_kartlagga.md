# Steg 1: Att kartlägga

- **Uppdrag**: Sanera och säkra administratörs- och modereringsarkitekturen.
- **Kartlagda brister och komponenter**:
  1. **Föråldrade testdomäner**:
     - `src/features/healthcheck` och `src/features/exportering` samt deras dokumentation i `doc/features/`.
     - `HealthStatusWidget` och `ExportButton` konsumeras i `src/components/MainViewContent.tsx`.
  2. **Säkerhet & Bakdörrar**:
     - URL-parameter `admin=true` / `user=admin` i `src/App.tsx`.
     - Hårdkodat lösenord `"utby2026"` i `src/hooks/useAppState.ts`.
  3. **Admin-parning & Inloggning**:
     - SMS/QR-baserad parning via `#PAIR <token>` behöver göras till primär autentiseringsmetod och sparas i `localStorage` (`admin_device_token`, `isAdmin`).
  4. **Platt Admin-hantering**:
     - Behov av gränssnitt och API-stöd för att lägga till/ta bort administratörsnummer direkt i AdminConsole samt via SMS-kommandon (`.admin +...`, `.admin -...`).
  5. **Aktiv Moderering & Betrodda Skapare**:
     - Moderering av inkommande förslag (godkänna, avböja, godkänna & lita på).
     - Betrodda skapare (`trustedNumbers`) ska kunna passera modereringskön automatiskt till det offentliga flödet (`status: "active"`).
