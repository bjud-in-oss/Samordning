// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/3_Council_Impact]

# Rådslagsdebatt & Synkroniserings-/Konsekvensanalys (FAS 1: Domänomdöpning, iOS Safari-fix & Firestore Client)

## Rådslagsdebatt (Dialektisk analys)

### The Innovator (Att förändra)
> "Genom att döpa om domänen till `mobile_pwa_app` blir arkitekturen plattformsoberoende och speglar PWA-funktionen korrekt. Med `build.target: ['es2015', 'safari13']` och ett globalt fel-overlay i `index.html` säkerställer vi 100 % driftsäkerhet på alla iOS WebKit-enheter. Anonym Firestore-läsning direkt i PWA-klienten avlastar backend drastiskt och möjliggör snabb global distribution via Netlify!"

### The Reflector (Att vända)
> "Vi måste säkerställa att alla importer till `pwaService` justeras sömlöst utan brutna sökvägar. Firebase-klienten i `src/main/config/firebaseClient.ts` måste ha säkra reservvärden om miljövariabler saknas under lokal utveckling så att appen inte kraschar."

### The Mediator (Att förlika)
> "Alla tre initiativ är nödvändiga för en stabil och skalbar PWA. Vi godkänner domänflytten till `src/features/mobile_pwa_app`, konfigurerar WebKit-målet i `vite.config.ts`, lägger till felhanteraren i `index.html` samt skapar `firebaseClient.ts`."

---

## Architectural Synchronization & Impact Analysis

### Operativa filer att modifiera/skapa i `4_Produce`:
1. `src/features/mobile_pwa_app/` (Omdöpt från `src/features/android_app/` via `move`):
   - `src/features/mobile_pwa_app/pwaService.ts`
2. `src/App.tsx`:
   - Uppdatera import från `./features/android_app/pwaService` till `./features/mobile_pwa_app/pwaService`.
3. `vite.config.ts`:
   - Lägg till `build: { target: ['es2015', 'safari13'] }`.
4. `index.html`:
   - Lägg till inline error-boundary script för `window.onerror` och `window.onunhandledrejection`.
5. `src/main/config/firebaseClient.ts` (NY):
   - Firebase JS SDK-konfiguration för anonym Firestore-läsning.

### Beslut:
- **Route Forward**: Steg till `4_Produce` godkänt.
