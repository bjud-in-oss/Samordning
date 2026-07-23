// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/2_Blueprint]

# Arkitekturspecifikation: Slutgiltig Mappstruktur, Mobile PWA Domain & Anonym Firestore ActiveStream

## 1. Slutgiltig Domänomdöpning till `mobile_pwa_app`
- Mappen `src/features/android_app/` har helt fasats ut och ersatts av `src/features/mobile_pwa_app/`.
- Samtliga importreferenser i `src/App.tsx` och relaterade moduler använder `src/features/mobile_pwa_app/pwaService`.
- Alla gamla `android_app`-kvarlevor är bortrensade.

---

## 2. Anonym Firestore-läsning i `ActiveStream` (`src/features/inbjudningar/ActiveStream.tsx`)
- `ActiveStream` kopplar upp sig mot anonym Firestore-läsning via `src/main/config/firebaseClient.ts`.
- Om `db` i `firebaseClient` är tillgänglig (när `VITE_FIREBASE_PROJECT_ID` är definierat), aktiveras `subscribeToFirestoreAlerts` för anonym realtidslyssning direkt från Firestore.
- Om Firestore inte returnerar data eller om miljövariabeln saknas, faller `ActiveStream` sömlöst tillbaka på backend-anropet `/api/alerts`.
- Anonyma PWA-användare på Netlify kan därmed läsa alla inbjudningar med noll belasning på Render.

---

## 3. iOS Safari WebKit-säkring
- `vite.config.ts` är låst med `build.target: ['es2015', 'safari13']`.
- `index.html` innehåller en global felskyddslyssnare (`window.onerror` och `window.onunhandledrejection`) som förhindrar vita skärmar vid oväntade WebKit-undantag.
