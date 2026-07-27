# Process Memory & Last Cycle Decisions: `anpassa`

## Context & Scope
This cycle created the root Public API barrier `src/features/anpassa/index.ts` to export OnboardingWizard, SettingsTicker, Step components, and mapData.

## Summary of Key Implementations
- **Public API Barrier (`index.ts`)**: Exposed `OnboardingWizard`, `SettingsTicker`, `Step1Geography`, `Step2Language`, `Step3Organizations`, `Step4Formats`, and `mapData`.
- **FSD Compliance**: Refactored cross-feature imports to consume `anpassa` exclusively via `./features/anpassa`.
