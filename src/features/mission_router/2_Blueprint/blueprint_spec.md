[CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/2_Blueprint]

# Arkitekturspecifikation: FSD Domänuppdelning i 5 Isolera Moduler

## 1. Mål och struktur
Systemet delas upp i 5 strikt isolerade Feature-Sliced Design (FSD) domäner under `src/features/`:

1. **`src/features/inbjudningar/`**
   - **Ansvarsområde**: Läsa och visa inbjudningar och anslag.
   - **Komponenter/Filer**:
     - `ActiveStream.tsx` (Anslagstavla / Ström)
     - `AlertDetail.tsx` (Detaljvy för enskild inbjudan)
     - Shared Types / Sub-components som behövs för läsning.

2. **`src/features/skapa_inbjudan/`**
   - **Ansvarsområde**: Formulär för att skapa inbjudan med universell 5-raders mall, AI-texttvätt, QR-kod och SMS-generering.
   - **Komponenter/Filer**:
     - `CreateInvitationForm.tsx` (Extraherad / isolerad skaparvy)
     - `washAnnouncementText` & tvätt-helpers.

3. **`src/features/anpassa/`**
   - **Ansvarsområde**: Profil, filter och personliga inställningar.
   - **Komponenter/Filer**:
     - `OnboardingWizard.tsx` (Inställningspanelen "Anpassa")
     - `Step1Geography.tsx` (Dina områden)
     - `Step2Language.tsx` (Språk)
     - `Step3Organizations.tsx` (Målgrupper / Organisationer)
     - `Step4Formats.tsx` (Deltagandesätt)
     - `mapData.ts` (Områden och koordinater)

4. **`src/features/sms_assistant/`**
   - **Ansvarsområde**: Backend SMS-gateway, moderering, parser, AI-analys och AdminConsole.
   - **Komponenter/Filer**:
     - `AdminConsole.tsx`
     - `supportAgent.ts`
     - `parser.ts` & SMS/WhatsApp integrationslogik.

5. **`src/features/android_app/`**
   - **Ansvarsområde**: Android Web App Manifest, Service Worker (`sw.js`), PWA/TWA-konfiguration och Web Push-prenumerationshantering.
   - **Komponenter/Filer**:
     - `manifest.json` config / helpers
     - `sw.js` integration / Service Worker helper scripts.

---

## 2. Importer och Beroendegraf
- `src/App.tsx` importerar rent från de isolerade domänerna:
  - `import ActiveStream from "./features/inbjudningar/ActiveStream";`
  - `import AlertDetail from "./features/inbjudningar/AlertDetail";`
  - `import OnboardingWizard from "./features/anpassa/OnboardingWizard";`
  - `import AdminConsole from "./features/sms_assistant/AdminConsole";`
  - `import Disclaimer from "./features/inbjudningar/Disclaimer";`
- Inga cirkulära importer. Gemensamma typer hålls rena i `src/features/mission_router/types.ts` eller lokalt re-exporterade.
