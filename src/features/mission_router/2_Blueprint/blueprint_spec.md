// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/2_Blueprint]

# Arkitekturspecifikation: Etapp 3 - Inkluderande Matchningsmotor, Kaskadnotiser och Backend-verifiering

## 1. Inkluderande Matchningsmotor (`pushService.ts` & `server.ts`)
1. **Inga språkhinder**:
   - Alla prenumeranter i valda geografiska områden ska ta emot inbjudningar oavsett vilket språk inbjudan skapades på.
   - Språkvalet i användarens profil fungerar som en **resursspegel** (register över vilka språk användaren kan erbjuda tolkning/översättning för) och får **ALDRIG** användas som ett sållningsfilter för att blockera aviseringar.
   - Översättning och lokaliserat gränssnitt hanteras i klienten/notisen utifrån mottagarens valda UI-språk.

2. **Geografisk och Målgruppsmatchning**:
   - Inbjudningar matchas mot prenumerantens valda områden (`primaryArea` och `limitedAreas`).
   - Målgruppsmatchning sker mot angiven målgrupp utan att expandera eller begränsa den underliggande datastrukturen.

---

## 2. Kaskadnotiser (Nivå 3 - Digitalt/Telefon)
1. **Brådskande förfrågningar & Digital Eskalering**:
   - I `pushService.ts` introduceras/bekräftas stöd för kaskadnotiser där flaggan `allowDigital` (eller eskalering till nivå 3) aktiverar utökad digital avisering (Web Push med hög prioritet / kaskad till alla berörda stödgrupper).
   - När en inbjudan eskalerats (`escalationLevel === 3` eller vid brådskande larm) skickas aviseringen till samtliga bevakande användare med `requireInteraction: true` för maximal uppmärksamhet på låsskärmen.

---

## 3. Symmetrisk AdminConsole (`src/features/sms_assistant/components/AdminConsole.tsx`)
1. **FSD-anpassning & Universell 5-raders mall**:
   - Alla simulerade testmeddelanden, SMS-kommandon och webbpubliceringar i `AdminConsole` följer de 5 rena FSD-domänvägarna.
   - Mallen följer den universella 5-radersstrukturen:
     ```
     Tid: [tid]
     Mötesplats: [plats]
     Aktivitet: [vad]
     Bjud in från områden: [område]
     Målgrupp: Alla
     ```
   - Alla administrativa kommandon (`.ja`, `.nej`, `.status`, `.mall`, `#WEBB`) stämmer exakt överens med `server.ts`.
