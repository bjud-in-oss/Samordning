# 1_Scan: Context, Constraints & Baselines

## Objective
Analyze the current baseline system, map environmental constraints, identify required API endpoints, and establish dependencies for the Stateless Mission Router.

## Environment & Baseline Check
* **Frontend Runtime**: React 19 + Vite 6
* **Backend Runtime**: Node.js + Express
* **Stateless Mandate**: NO permanent user data. Ram-only storage for alert/larm data.
* **Privacy Boundary**: Anonymized webpush subscriptions (only areas, preferred format, flexibility tags). No names, no logins, no persistent phone numbers of missionary pairs.
* **Compliance Details**:
  - Hårdkodad bot-identifier: `Hjälp-Bot (NO PERSONAL INFO)`.
  - Ingen logs för inkommande nätverkstrafik (off-switch or clear in-memory).
  - Disclaimer i footer: *"Fristående inofficiell tjänst, ej sponsrad av kyrkan."*

## Feature-Sliced Design (FSD) Structure mapping
The feature `mission_router` houses all components, state mechanisms, and styles related to:
1. **Onboarding**: High-contrast checklist UI for elder volunteers.
2. **Alert Monitoring / Active Alerts (`/larm/:id`)**: Response form for selected alerts.
3. **Simulation Terminal**: Dashboard for testing WhatsApp messages (bypassing headless browser limits or sandbox blocks).

### Files in Feature Domain
* `src/features/mission_router/components/OnboardingForm.tsx` - Big-button layout for elder members.
* `src/features/mission_router/components/AlertDetail.tsx` - Clear, single-column detail display of the scrubbed alert + response input.
* `src/features/mission_router/components/SimulatorPanel.tsx` - High-fidelity WhatsApp bot console for testing.
* `src/features/mission_router/components/Disclaimer.tsx` - Mandatory foot disclaimers.
* `src/features/mission_router/store/subscriptionStore.ts` - Local/session storage and Web Push registration.
* `src/features/mission_router/1_Scan/scan_report.md` - (This file)
* `src/features/mission_router/2_Blueprint/blueprint_spec.md` - Technical specification and schema contracts.
* `src/features/mission_router/3_Council_Impact/council_debate.md` - Dialectical Council review and alignment.
