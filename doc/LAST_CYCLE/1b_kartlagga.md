# Steg 1b: Kartlägga

- **Empirisk inventering av domänen `anpassa`**:
  - **Komponenter och vyer i `src/features/anpassa/`**:
    - `OnboardingWizard.tsx`: Huvudkontroller för anpassningsvyn som samordnar geografiska områden, målgrupper, format, språk och dynamiska temainställningar.
    - `components/ThemeSelectorSection.tsx`: Tillhandahåller val och omedelbar växling av de 5 centrala färgtemana (`default`, `high-contrast`, `autumn`, `spring`, `winter`) med realtidsuppdatering av `data-theme` på `:root` och lokal persistens i `localStorage`.
    - `components/MoreSettingsSection.tsx`: Samlar temaväljare, deltagandeformat (fysiskt/digitalt) och språkalternativ i enhetliga kort med semantiska designtokens.
    - `components/TargetGroupsSection.tsx`: Renderar målgruppsval med enhetliga `brand-accent` och `brand-paper` interaktionsmönster.
    - `Step1Geography.tsx` till `Step4Formats.tsx`: Guidesteg för initial konfigurering.
    - `SettingsTicker.tsx`: Visuell sammanfattningsremsa för aktiva preferenser.
    - `domain/orgData.ts` och `mapData.ts`: Domänspecifika datauppsättningar för organisationer och geografi.
  - **CSS- och färgstruktur (`src/index.css`)**:
    - Centrala CSS-variabler för knappar: `--color-btn-invite-bg`, `--color-btn-invite-hover`, `--color-btn-invite-text`.
    - Centrala CSS-variabler för modaler: `--color-modal-bg`, `--color-modal-overlay`, `--color-modal-border`.
    - Centrala CSS-variabler för flöde: `--color-stream-card-bg`, `--color-stream-card-border`, `--color-stream-tag-bg`, `--color-stream-tag-text`.
    - Alla variabler är kartlagda till Tailwind-temat (`@theme`) och varierar deterministiskt per `[data-theme]`.
  - **Habit-Hooks och koddisciplin i `anpassa`**:
    - `OnboardingWizard.tsx` samlar flera interna `useState`- och `useEffect`-anrop som bör struktureras upp i en renodlad custom hook (`hooks/useOnboardingState.ts`) för att garantera att tillståndssepareringen strikt uppfyller v8.7 Habit-Hook-regeln (`<= 3` hooks per UI-komponent).
    - Alla komponenter i `anpassa` använder uteslutande semantiska designtokens utan hårdkodade Tailwind-färgklasser eller råa hex-koder.
