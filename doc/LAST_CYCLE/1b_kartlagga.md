# Steg 1b: Kartlägga

- **Empirisk inventering av domänen `skapa_inbjudan`**:
  - **Formulär och UI-komponenter (`src/features/skapa_inbjudan/components/`)**:
    - `CreateInvitationForm.tsx`: Huvudvy för att skapa inbjudningar, samlar dialoger, förhandsgranskning, favoritfält och publiceringssteg.
    - `PostSubmissionStepper.tsx`: Stegvisare efter publicering (AI-granskning, integritet, SMS-delning, avstämning). Innehåller direkta asynkrona anrop och `any`-typer som ska städas och lyftas till domänlagret.
    - `dialogs/`: Dialoger för tid, plats, aktivitet, område, målgrupp och organisation. Behöver justera importvägar till shared/domain för att respektera FSD-gränser.
    - `PreviewCard.tsx`, `FavoritesBar.tsx`, `AiReviewModal.tsx`, `AiFlagModal.tsx`, `GatewayQrModal.tsx`: Presentationskomponenter för formulärets flöde.
  - **Tillstånd och Hooks (`src/features/skapa_inbjudan/hooks/`)**:
    - `useInvitationForm.ts`: Huvudhook som sammanfogar delhooks (`useInvitationBasics`, `useInvitationDialogs`, `useInvitationFavorites`, `useInvitationPublishing`).
    - `subhooks/useInvitationPublishing.ts`: Sköter publicering mot datalagret/backend (`/api/alerts` och lokal lagring/simulering). Innehåller `any`-typer som ska ersättas med typade kontrakt.
  - **Domänmodeller och typer (`src/features/skapa_inbjudan/domain/`)**:
    - `types.ts`: Innehåller `savedTags?: any` och orena gränsöverskridande importer. Ska förses med strikta gränssnitt.
    - `geocoder.ts`: Hjälpfunktioner för plats- och koordinatmatchning i Göteborg.
    - `constants.ts`: Standardvärden och valalternativ för dialoger.
  - **Befintliga avvikelser som ska elimineras**:
    1. Ersätta `any` med konkreta typer (`SavedUserTags`, `InvitationPublishPayload`).
    2. Säkerställa korrekt persistens mot datalagret vid formulärinskick.
    3. FSD-städning av interna importer mellan komponenter och delhooks.
