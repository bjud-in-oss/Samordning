// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/2_Blueprint]

# Arkitekturspecifikation: FAS 1 – Domänomdöpning, iOS Safari-Fix och Firestore Client Setup

## 1. Domänomdöpning till `mobile_pwa_app`
- Mappen `src/features/android_app/` döps om till `src/features/mobile_pwa_app/`.
- Alla importvägar i projektet (inklusive `src/App.tsx` och `src/features/mobile_pwa_app/pwaService.ts`) uppdateras från `android_app` till `mobile_pwa_app`.

## 2. iOS Safari WebKit-stabilisering & Felsökning
- `vite.config.ts` konfigureras med `build.target: ['es2015', 'safari13']` för att garantera att transpilerad JavaScript är fullt kompatibel med WebKit på äldre och nyare iOS-enheter uden syntaxkrascher.
- `index.html` förses med en global fel- och `unhandledrejection`-lyssnare som fångar upp unhandled runtime-fel och ritar ut ett mjukt fel-overlay med information och en "Ladda om"-knapp istället för en blank vit skärm.

## 3. Anonym Firebase Firestore Client Setup
- Skapa `src/main/config/firebaseClient.ts` för anslutning via Firebase JS SDK (`firebase/app` och `firebase/firestore`).
- Konfigurera klientanslutningen för 100 % anonym läsning av samlingen `alerts` direkt från Netlify i PWA-frontend utan att belasta eller anropa Render för läsoperationer.
