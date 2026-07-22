// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/anpassa/2_Blueprint]

# Arkitekturspecifikation: Etapp 4 - Ramlös Ticker, Aktiv Språktext och PWA-Slutverifiering

## 1. Helt Ramlös & Osynlig SettingsTicker (`src/features/anpassa/SettingsTicker.tsx`)
- Tabort alla bakgrundskort, tiles, kanter och skuggor (`bg-transparent`, `border-0`, `shadow-none`, `p-0`).
- Tickern återges som ren, klickbar text direkt efter rubriken H1 "Inbjudan till dig".
- Ändra den tidsstyrda textcykeln till den aktiva resurstanken för språk:
  1. `• i [Kortedala, Bergsjön]` (eller valt primärområde / alla områden)
  2. `• översätta till [Svenska]` (aktiv resurstank istället för passivt "på")
  3. `• för [Alla]` (eller valda målgrupper)
- Klick på texten navigerar användaren direkt till inställningar (`setCurrentView('settings')`).

---

## 2. PWA Service Worker & Offline-caching (`public/sw.js`)
- Säkerställ fullständig PWA-hantering i `public/sw.js`:
  - `push`-händelser för bakgrundsaviseringar med tysta avfärdanden (`CANCEL`).
  - `notificationclick`-händelser för fokustagning och öppnande av inbjudningsfönstret.
  - `install` & `fetch`-händelser för offline-caching av PWA-skalet och statiska resurser.

---

## 3. Automatisk Gallring i Backend (`server.ts`)
- Bekräfta och verifiera den automatiska gallringsloopen i `server.ts` (`setInterval` var 60:e sekund):
  - Inaktuella inbjudningar med utgången tidsstämpel (`alert.expiryTimestamp < Date.now()`) gallras och rensas ur minnet automatiskt.
  - Disk-synkronisering utlöses vid gallring så att inaktuella inbjudningar inte överlever en omstart.
