# Steg 3b: Domänkontrakt och Fraktal Dokumentation

## Domän: `inbjudningar`
- **Komponenter**: `ActiveStream.tsx`, `StreamFilterStatus.tsx`, `StreamCard.tsx`.
- **Kontrakt**:
  - `StreamFilterStatusProps`:
    - `savedTags?: SavedFilterTags | null`
    - `pushEnabled?: boolean`
    - `onOpenSettings?: () => void`
    - `onEnableAndOpenSettings?: () => void`

## Domän: `anpassa`
- **Komponenter**: `OnboardingWizard.tsx`.
- **Kontrakt**:
  - `OnboardingWizardProps`:
    - `pushEnabled: boolean`
    - `onEnablePush?: () => void`
    - `onSave: (tags: OnboardingTags) => void`
    - `onClose: () => void`

## Domän: `skapa_inbjudan`
- **Komponenter**: `CreateInvitationForm.tsx`, `DraftBanner.tsx`.
- **Kontrakt**:
  - Knapp: `"Ge en inbjudan"`.
  - Statusbrickor för förberedelse och publicering.
