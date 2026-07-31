# Feature Documentation: `anpassa`

## Overview & Scope
`anpassa` handles user configuration, geographic preferences (Gothenburg areas/districts), language selection, target groups, organization filters, and format preferences.

## Public API Exports (`src/features/anpassa/index.ts`)
- **Components**: `OnboardingWizard`, `SettingsTicker`, `Step1Geography`, `Step2Language`, `Step3Organizations`, `Step4Formats`
- **Domain Data**: `GOTEBORG_AREAS`, `MAP_DISTRICTS`, `AREA_TO_DISTRICT_MAP`, `DISTRICT_NAME_MAPPING` from `./mapData`
