# Blueprint Specification - ETAPP 5 Direct Composition Live Card & Minimalist Layout

## 1. Overview & Architecture
This specification transforms the Live Invitation Card into an interactive composition surface, removing redundant form buttons, simplifying placeholders with contextual asterisks, and fixing contact person dialog inputs.

## 2. Live Card Interactive Composition Surface
- Remove top button matrix (`FORMULÄRFÄLT:`).
- Header above Live Card: "Klicka på fälten i kortet för att komponera din inbjudan:".
- Each field inside `PreviewCard.tsx` is clickable and opens the corresponding in-place dialog.

## 3. Minimalist Placeholders & Contextual Asterisks
- Asterisks appear ONLY when a mandatory field lacks a value:
  - Activity: `Ingen aktivitet angiven än...*`
  - Time & Date: `Ej vald*`
  - Location: `Ej vald*`
  - Area (Områden): `Inga valda` (No asterisk, field is optional)
  - Audience (Målgrupp): `Inga valda*`
  - Organizer (Arrangör): `Ej angiven*`
- Footnote under card: `* = obligatorisk uppgift`.

## 4. Contact Person Bugfix in Organizer Dialog
- Pass active `showPersonNameModal` and `setShowPersonNameModal` state to `OrganizerDialog.tsx` so clicking "+ Lägg till kontaktperson / privatnamn" correctly toggles the input field.

## 5. Gateway QR Button State & Copy
- Text: "Publicera på anslagstavlan via annan enhet" (disabled until `isFormValid`).

