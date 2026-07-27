# Architectural Decision Records (ADR) - Master Log

## ADR-001: Feature-Sliced Design & Public API Barriers
- **Status**: Accepted & Enforced
- **Context**: To eliminate tight coupling and prevent cross-domain contract drift, all domain logic and components are organized under `src/features/[feature_name]/`.
- **Decision**: Every feature MUST expose its public capabilities strictly via `src/features/[feature_name]/index.ts`. Direct deep-importing into another feature's subdirectories is strictly forbidden.
- **Slices**:
  1. Visual/UI Slice (`components/`)
  2. Domain/Logic Slice (`hooks/`, `domain/`)
  3. Test Slice (`__tests__/`)
  4. Integration/Gateway Slice (`api/`, `pwaService.ts`)
  5. Content/i18n Slice (`translations.ts`, `constants.ts`)
  6. Feature Documentation Slice (`doc/*.md`)

## ADR-002: Stateless Execution & In-Memory RAM Architecture
- **Status**: Accepted & Enforced
- **Context**: The Node.js container runtime operates in a sandboxed, stateless environment.
- **Decision**: No personal data, session tokens, or puppeteer authentication files (`.wwebjs_auth`) may be written to disk. All runtime state relies on RAM or secure Firestore persistent backends.

## ADR-003: Contract-First Verification & Pre-Commit Gates
- **Status**: Accepted & Enforced
- **Context**: Ensuring 100% type safety and high test confidence during builds.
- **Decision**: Type checking (`tsc --noEmit`) and linting must pass before cycle completion. All domain interfaces must be frozen in `domain/types.ts`.
