# Process Memory & Last Cycle Decisions: `inbjudningar`

## Context & Scope
This cycle created the root Public API barrier `src/features/inbjudningar/index.ts` to export ActiveStream, AlertDetail, and Disclaimer.

## Summary of Key Implementations
- **Public API Barrier (`index.ts`)**: Exposed `ActiveStream`, `AlertDetail`, and `Disclaimer`.
- **FSD Compliance**: Refactored `App.tsx` and internal sub-components to consume `inbjudningar` exclusively via `./features/inbjudningar`.
