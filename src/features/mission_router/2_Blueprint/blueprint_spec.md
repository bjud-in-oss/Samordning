# Blueprint Specification - ETAPP 7 Unified LiveCard UI & Smart AI Pre-flight

## 1. Overview & Architecture
This specification restores the exact clean left-aligned UI layout of the LiveCard in `PreviewCard.tsx` while enabling an always-clickable publication workflow with a smart AI Pre-flight modal (`AiReviewModal.tsx`).

## 2. LiveCard Visual UI (`PreviewCard.tsx`)
- **Alignment**: Icons aligned on the left, text block on the right with straight left-alignment.
- **Header Line 1 (Monospace, Gray Uppercase)**:
  - Empty field prompt (no ellipses, no asterisks):
    * Activity: "Beskriv din inbjudan"
    * Time & Date: "Välj tid & datum"
    * Location: "Var ses ni?"
    * Invite From: "Varifrån bjuder du in?"
    * Audience: "Vilka grupper bjuds in?"
    * Organizer: "Vem håller i det?"
  - Filled field title:
    * Activity: "AKTIVITET"
    * Time & Date: "TID & DATUM"
    * Location: "MÖTESPLATS"
    * Invite From: "BJUD IN FRÅN"
    * Audience: "MÅLGRUPP"
    * Organizer: "ARRANGÖR"
- **Value Line 2 (Bold, Black, Straight)**:
  - `font-semibold text-brand-ink` (no italics/ghost styling).
  - Empty status texts (no asterisks, no ellipses):
    * Activity: "Ingen aktivitet angiven än"
    * Time & Date: "Ej vald"
    * Location: "Ej vald"
    * Invite From: "Inga valda"
    * Audience: "Inga valda"
    * Organizer: "Ej angiven"
  - Free vertical expansion (`break-words whitespace-pre-wrap`).
- **Zero Visual Noise**:
  - REMOVE all asterisks (`*`) and ellipses (`...`).
  - REMOVE footnote `* = obligatorisk uppgift`.
  - LIVECARD badge: Clean dark pill with text "LIVECARD" (no edit pencil icon).

## 3. Always-Clickable Publish Button & AI Pre-flight Logic
- **Always Clickable**: "Publicera på anslagstavlan" button is never disabled (except during active network submission).
- **Types Contract**: `AiReviewProposal` added in `types.ts` with `missingFields`, `extractedFromText`, `reasonCopy`, `hasPrivacyFlag`.
- **Smart AI Review Modal (`AiReviewModal.tsx`)**:
  - Opens when mandatory fields are missing or text contains potential details/privacy flags.
  - Explains why missing info helps participants in a friendly, non-judgmental tone.
  - Quick auto-fill button if time/location were detected in activity text.
  - Two explicit buttons:
    * `[ Justera inbjudan ]` (Primary: closes modal to refine fields)
    * `[ Publicera ändå ]` (Secondary: proceeds directly to publish)


