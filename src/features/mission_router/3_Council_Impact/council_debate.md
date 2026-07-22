// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/android_app/3_Council_Impact]

# Rådslagsdebatt & Synkroniserings-/Konsekvensanalys (SW-aktivering & ADMIN_PIN)

## Rådslagsdebatt (Dialektisk analys)

### The Innovator (Att förändra)
> "Genom att introducera en explicit asynkron väntan på `navigator.serviceWorker.ready` och verifiera att `registration.active` existerar innan `pushManager.subscribe()` anropas försvinner alla race conditions vid PWA/Push-aktivering! Dessutom gör stödet för `process.env.ADMIN_PIN` i `/api/admin/verify` det extremt smidigt att styra adminbehörighet i molnmiljöer som Render."

### The Reflector (Att vända)
> "Vi måste säkerställa att om Service Workern är under installation (`installing` eller `waiting`), så låser vi inte tråden för evigt utan har en säker event-lyssnare som löser ut när den blir `activated`. För backend-endpointen måste fall-backen till `data/admins.json` bibehålla bakåtkompatibiliteten så att befintliga admin-telefonnummer eller secrets fortfarande fungerar."

### The Mediator (Att förlika)
> "Debatten är i full klang. Vi uppdaterar `pwaService.ts` med den vattentäta `subscribeUserToPush`-funktionen och uppdaterar `App.tsx` för att använda den. I `server.ts` lägger vi till `/api/admin/verify` med prioritetsordning: `process.env.ADMIN_PIN` först, därefter `data/admins.json` / `adminNumbers` / `API_SECRET`."

---

## Architectural Synchronization & Impact Analysis

### Operativa filer att modifiera i `4_Produce`:
1. `src/features/android_app/pwaService.ts`:
   - Lägg till `getActiveServiceWorkerRegistration`, `subscribeUserToPush` och `urlBase64ToUint8Array`.
2. `src/App.tsx`:
   - Integrera `subscribeUserToPush` i `handleEnablePush` för felfri Service Worker-prenumeration.
3. `server.ts`:
   - Lägg till `/api/admin/verify` endpoint med prioritering av `process.env.ADMIN_PIN` och reserv mot `data/admins.json`.

### Beslut:
- **Route Forward**: Steg till `4_Produce` godkänt.
