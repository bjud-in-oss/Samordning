// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/2_Blueprint]

# Arkitekturspecifikation: Anonym Enhetsparning (#PAIR) & PIN-Avveckling

## 1. Anonym Enhetsparning (#PAIR)
- PIN-koder avvecklas helt för admin-behörighet.
- Enheten genererar en unik `device_token` (lagrad i `localStorage`).
- Status kontrolleras mot servern (`/api/admin/check-pairing?token=...`).
- Om enheten ej är verifierad:
  - Genereras en `#PAIR <device_token>`-kod för SMS-verifiering.
  - För mobila enheter: Knappen "Verifiera min enhet via engångs-SMS (#PAIR)" öppnar `sms:0736108997?body=%23PAIR%20<device_token>`.
  - För dator/stationär: Visas en dynamisk QR-kod med SMS-länken för skanning från admin-mobil.
  - För utvecklingsmiljö / Gateway-enhet (loopback): Finns en snabbknapp "Direktaktivera lokal enhet" för att undvika onödiga SMS i testmiljö.

---

## 2. Serverhantering av Enhetstoken (`server.ts`)
- Servern lagrar verifierade enhetstoken i `data/paired_devices.json`.
- Inkommande `#PAIR <device_token>` via `/api/incoming-sms` verifierar automatiskt enheten om avsändaren är admin/trusted eller godkänd.
- `/api/admin/pair` tillåter även direkt registrering vid lokal testning.

