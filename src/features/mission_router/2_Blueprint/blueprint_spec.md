// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/2_Blueprint]

# Arkitekturspecifikation: Slutgiltig Mappstruktur, PWA-Formulär, Silent Render Ping & Anonym Firestore

## 1. Slutgiltig Domänomdöpning till `mobile_pwa_app`
- Mappen `src/features/android_app/` har helt fasats ut och ersatts av `src/features/mobile_pwa_app/`.
- Samtliga importreferenser i `src/App.tsx` och relaterade moduler använder `src/features/mobile_pwa_app/pwaService`.

---

## 2. PWA Formulär för Inbjudningar & SMS-Gateway (`src/features/skapa_inbjudan/CreateInvitationForm.tsx`)
- Interaktivt PWA-formulär med snabbknappar (Fika, Promenad, Samtal, Trädgård, Gudstjänst).
- Tydliga fält för Tid, Plats/Mötesplats, Målgrupp, Kategori och Aktivitet.
- Automatisk generering av förformaterad `sms:0736108997?body=...`-URI riktad mot modererings-gatewayen.
- QR-kodsgenerering som fallback för skrivbordsanvändare.

---

## 3. Silent Render Ping (`src/features/mobile_pwa_app/pwaService.ts`)
- `pingRenderBackend()` utför en tyst, bakgrunds-fetch till `/api/health` utan att störa användargränssnittet.
- Anropas vid appens initiering i `src/App.tsx` för att väcka Render-instansen i bakgrunden när användaren öppnar PWA:n på Netlify.

---

## 4. Anonym Firestore-läsning i `ActiveStream`
- Hybrid realläsning via `firebaseClient.ts` med automatisk fallback till `/api/alerts`.

