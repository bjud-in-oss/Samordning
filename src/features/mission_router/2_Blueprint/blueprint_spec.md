// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/2_Blueprint]

# Arkitekturspecifikation: Ny Vy-hierarki, PWA-Formulär med Favoriter, Fixad Områdesväljare & Moderering i Flödet

## 1. Ny Vy-hierarki & Expanderbar Introtext (`ActiveStream.tsx`)
- Huvudrubrik: "Inbjudan till dig" med skräddarsydd ingress.
- Kort introtext visas som standard med en blå klickbar "...läs mer"-knapp som fäller ut hela beskrivningen.
- Ansvarsfriskrivningen ("Detta är en fristående, inofficiell tjänst utan sponsring från Utby församling.") placeras direkt under funktionsknapparna för renare visuell rytm.

---

## 2. Flexibelt PWA-Formulär med Personliga Favoriter (`CreateInvitationForm.tsx`)
- Ersätter fasta mall-knappar med ett öppet textfält för Aktivitet samt reglage/knapp-modaler för:
  - Tid (e.g. Idag kl 18:00, Ikväll, Lördag m.m.)
  - Mötesplats (med kartmatchning/sökning)
  - Områden (samma områdesväljare som under Anpassa)
  - Målgrupp (Alla, Ungdomar, Vuxna, etc.)
- Användare kan spara sina skapade inbjudningar som "Personliga favoriter" i `localStorage` for snabb återanvändning.

---

## 3. Fixerad "Alla/Ingen"-logik i Områdesväljaren (`Step1Geography.tsx`)
- "Alla" och "Ingen" omvandlas till rena snabbåtgärder (Quick Actions) i gränssnittet.
- Istället för låsta, ömsesidigt uteslutande tillstånd fungerar de som "Markera alla" / "Rensa alla" så att knappar aldrig fastnar eller blir felaktigt markerade samtidigt.

---

## 4. Admin Modereringsvy i Det Ordinarie Flödet (`ActiveStream.tsx`)
- För inloggade/parade administratörer visas alla poster med `status === 'pending'` framhävt överst i flödet med en markant "Väntar på godkännande"-banderoll.
- Varje pending-kort förses med:
  - Knappen "Godkänn (.ja)" – ändrar status till active.
  - Knappen "Avvisa (.nej)" – raderar inbjudan.
  - Direktlänkar för att Ringa (`tel:`) eller SMS:a (`sms:`) arrangören vid oklarheter.
- Pending-poster hålls immuna mot vanliga taggfilter så att admin alltid ser orörda inbjudningar direkt.

---

## 5. Textstorleksfix för Android PWA (`src/index.css`)
- Lägger till `-webkit-text-size-adjust: 100%; text-size-adjust: 100%;` på `html` och `body`.
- Säkerställer tillräcklig rem-skalning och explicita textklasser så att fontstorleken i PWA-vyer på Android hålls stabil och läsbar.

---

## 6. Modereringsspärr (Pending vs Active) (`server.ts` & `AdminConsole.tsx`)
- Alla inkommande meddelanden/inbjudningar från icke-verifierade avsändare tilldelas `status: 'pending'`.
- Endast poster med `status === 'active'` (eller bakåtkompatibla utan status) visas för vanliga användare.
- Administratörer kan godkänna eller avvisa både via SMS (.ja/.nej), i AdminConsole samt direkt i `ActiveStream`.

