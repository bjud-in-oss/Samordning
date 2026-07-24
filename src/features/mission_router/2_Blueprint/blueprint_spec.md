# Blueprint Specification - ETAPP 6 Prompts & Dynamic Field Expansion in LiveCard

## 1. Overview & Architecture
This specification re-introduces prompt label headers on line 1 above each interactive field in the LiveCard, enables vertical expansion without text truncation, and enforces contextual asterisk placement.

## 2. Interactive Prompt Labels (Line 1)
- Activity Prompt: "Beskriv din inbjudan..."
- Time & Date Prompt: "Välj tid & datum..."
- Location Prompt: "Välj var ni ses..."
- Invite From Areas Prompt: "Välj närområden du bjuder in från..."
- Audience Prompt: "Välj vem inbjudan är till för..."
- Organizer Prompt: "Beskriv vem som håller i det..."

## 3. Status Fields & Vertical Expansion (Line 2)
- All fields expand vertically using `break-words whitespace-pre-wrap` with no restrictive max-height or `truncate` classes.
- Asterisk `*` appears on line 2 ONLY when a required field lacks a value:
  - Activity: `Ingen aktivitet angiven än...*`
  - Time & Date: `Ej vald*`
  - Location: `Ej vald*`
  - Invite From Areas: `Inga valda` (Optional - no asterisk)
  - Audience: `Inga valda*`
  - Organizer: `Ej angiven*`
- Footnote retained: `* = obligatorisk uppgift`.

