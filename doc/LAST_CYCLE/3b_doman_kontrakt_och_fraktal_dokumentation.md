# Steg 3b: Domänkontrakt och Fraktal Dokumentation

## Domän: `anpassa`

### 1. Komponenter och Gränssnitt

#### A. `src/features/anpassa/OnboardingWizard.tsx`
- **Interface**:
```typescript
interface OnboardingWizardProps {
  onSave: (tags: {
    areas: string[];
    primaryArea?: string;
    limitAreas?: boolean;
    limitedAreas?: string[];
    limitOrganizations?: boolean;
    limitedOrganizations?: string[];
    languages: string[];
    organization: string;
    formats: ("physical" | "telephone")[];
    alwaysNotify: boolean;
    spiritualTips: boolean;
    targetGroups?: string[];
    allowDigital?: boolean;
  }) => void;
  savedTags?: OnboardingStateSavedTags;
  pushEnabled: boolean;
  onEnablePush: () => void;
  onDisablePush: () => void;
  uiLanguage: UiLanguage;
  onClose?: () => void;
}
```

### 2. Fraktal dokumentation
- Uppdatering i `src/features/anpassa/doc/INDEX.md` och `src/features/anpassa/doc/UI_WORKFLOWS.md`.
