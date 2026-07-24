# Dialectical Council Debate & Architectural Impact Analysis - FSD Modularization

## Council Perspectives
- **The Innovator (Att förändra)**: Pushes for modularizing the 1,000+ line monolith into clean React hooks, isolated dialog components, and domain utilities. This enables fast rendering, simplified testing, and isolated UI updates.
- **The Reflector (Att vända)**: Enforces strict Feature-Sliced Design rules. Ensures no business logic leaks into presentation components and preserves all exact state management, validation rules, consent checks, and AI prescreening behavior.
- **The Mediator (Att förlika)**: Balances modularity with maintainability. Extracts reusable dialogs and hooks without over-engineering or introducing unnecessary complexity.

## Architectural Synchronization & Impact Analysis
- `src/features/skapa_inbjudan/domain/types.ts`: Holds `FavoriteItem`, `FormState`, and dialog types.
- `src/features/skapa_inbjudan/domain/constants.ts`: Houses POI_LOCATIONS, AUDIENCE_OPTIONS, ORGANIZATIONS, QUICK_TIMES.
- `src/features/skapa_inbjudan/domain/geocoder.ts`: Encapsulates district geocoding & POI matching against `mapData.ts`.
- `src/features/skapa_inbjudan/hooks/useInvitationForm.ts`: Encapsulates form state, named favorites storage, validation, formatting, and submission handlers.
- `src/features/skapa_inbjudan/components/dialogs/*`: Contains `TimeDialog`, `LocationDialog`, `ActivityDialog`, `AreaDialog`, `AudienceDialog`, and `OrganizerDialog`.
- `src/features/skapa_inbjudan/components/*`: Contains `FavoritesBar`, `PreviewCard`, `GatewayQrModal`, and `AiFlagModal`.
- `src/features/skapa_inbjudan/CreateInvitationForm.tsx`: Orchestrates all components cleanly in under 120 lines.
