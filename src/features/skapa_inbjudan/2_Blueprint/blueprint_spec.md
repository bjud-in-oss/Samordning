# Blueprint Specification - FSD Refactoring of CreateInvitationForm

## 1. Domain & Feature Architecture (Feature-Sliced Design)
The monolithic `CreateInvitationForm.tsx` is decomposed into modular, single-responsibility files inside `src/features/skapa_inbjudan/`:

```
src/features/skapa_inbjudan/
├── CreateInvitationForm.tsx          # Lean Orchestrator Container (< 120 lines)
├── domain/
│   ├── constants.ts                  # Form options (POI, Audience, Organizations, Quick Times)
│   ├── geocoder.ts                   # KML/POI district matching logic
│   └── types.ts                      # Form state & Favorite interfaces
├── hooks/
│   └── useInvitationForm.ts          # State management, validation, favorites, AI screening
└── components/
    ├── FavoritesBar.tsx              # Named favorites pill bar & save modal
    ├── PreviewCard.tsx               # Non-editable enlarged live invitation card
    ├── GatewayQrModal.tsx            # SMS & QR gateway fallback section
    ├── AiFlagModal.tsx               # Moderation alert modal
    └── dialogs/
        ├── TimeDialog.tsx            # Date, time, recurring & reminder controls
        ├── LocationDialog.tsx        # Free-text address & POI quick selector
        ├── ActivityDialog.tsx        # Free-text activity description
        ├── AreaDialog.tsx            # District multi-selector
        ├── AudienceDialog.tsx        # Target audience multi-selector
        └── OrganizerDialog.tsx      # Group selector & reassurance copy
```

## 2. Component Contracts & Interfaces
- `useInvitationForm`: Exposes form fields, dialog state triggers, favorite management, formatting, and submission methods.
- `CreateInvitationForm`: Binds UI components with `useInvitationForm` hook and renders clean, modular JSX.
