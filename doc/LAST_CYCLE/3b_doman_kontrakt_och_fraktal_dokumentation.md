# Steg 3b: Domänkontrakt och Fraktal Dokumentation

## Domän: `anpassa`
- **Huvudkomponent**: `src/features/anpassa/OnboardingWizard.tsx`
- **Interface**:
```typescript
export interface OnboardingWizardProps {
  onSave: (tags: OnboardingTags) => void;
  onClose: () => void;
  initialTags?: OnboardingTags | null;
  pushEnabled?: boolean;
  onEnablePush?: () => void;
}
```
- **Integrationspunkt**: `src/components/MainViewContent.tsx`
