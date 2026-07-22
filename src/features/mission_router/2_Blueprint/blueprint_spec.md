// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/android_app/2_Blueprint]

# Arkitekturspecifikation: Vattentät Service Worker-aktivering och Render ADMIN_PIN

## 1. Säker Service Worker-registrering & Push-prenumeration (`src/features/android_app/pwaService.ts`)
- Utöka och stärka `pwaService.ts` med funktioner för säker aktivering av Service Worker:
  1. `getActiveServiceWorkerRegistration(swPath)`: Registrerar Service Worker och väntar ALLTID på `await navigator.serviceWorker.ready`.
  2. Automatisk tillståndskontroll (`active` state): Om `registration.active` inte är redo direkt, lyssnar den på `statechange` tills worker är i tillståndet `activated` / `active`.
  3. `subscribeUserToPush(publicKey, swPath)`: Säkerställer aktiv Service Worker innan `registration.pushManager.subscribe()` anropas.
- Uppdatera `App.tsx` så att `handleEnablePush` använder `subscribeUserToPush` från `pwaService.ts` för att garantera att felet `Subscription failed - no active Service Worker` aldrig uppstår.

---

## 2. Stöd för process.env.ADMIN_PIN i Backend (`server.ts`)
- Implementera/säkerställ endpointen `/api/admin/verify` i `server.ts`:
  1. Kontrollera först om `process.env.ADMIN_PIN` finns inställt i miljövariablerna (t.ex. på Render). Om `ADMIN_PIN` finns, verifieras inkommande PIN direkt mot detta värde.
  2. Om `process.env.ADMIN_PIN` saknas, faller verifieringen tillbaka på att kontrollera mot `data/admins.json` (eller `adminNumbers`/`API_SECRET`).
  3. Returnera strukturerat svar `{ success: true, verified: true, isAdmin: true, source: 'env' | 'file' }` eller `401 Unauthorized`.
