# Blueprint Specification - ETAPP UI/UX Cleaning, In-Place Dialogs & PWA Form

## 1. Overview & Architecture
This blueprint details the transformation of the PWA Invitation Flow (`ActiveStream.tsx` & `CreateInvitationForm.tsx`), enforcing frictionless in-place dialogs, pure custom named favorites, single-page instant preview, mandatory consent verification, AI background moderation check, and explicit gateway instructions.

## 2. ActiveStream Cleaning
- Heading: "Inbjudan till dig" (without "PWA Stream" badge).
- Cleaned top section without redundant disclaimer or hero paragraphs.
- "Tillbaka" button renamed to "Visa dina inbjudningar igen".
- Floating Action Button updated to single "+ Bjud in" button anchored bottom-right.

## 3. CreateInvitationForm In-Place Dialog System
- Headline: "Bjud in andra"
- Subtitle: "Bjud in andra att vara en vän, hämta näring i Guds ord eller hjälpa andra"
- Prompt label: "Beskriv din inbjudan i knapparna nedan:"
- Interactive Reglage Buttons:
  1. **Tid**: Opens in-place date/time picker, recurring schedule options, and reminder checkbox (`Påminnelse: <time>`).
  2. **Plats**: Single-choice POI selector with exact district mapping (closes on select).
  3. **Aktivitet**: Free text input dialog for custom activity description.
  4. **Område**: Multi-choice area picker (optional) with "⚡ Markera alla" / "✕ Rensa alla".
  5. **Målgrupp**: Multi-choice target audience selector.
  6. **Arrangör**: Organization selector limited to valid groups, plus "Förtydliga med namn" modal when "Enskild/Familj" is selected.
- In-place Dialog Mechanics:
  - Single Choice: Closes immediately on click.
  - Multi-Choice / Text: Requires "Välj" / "Klar" or "Ångra" / "Avbryt" to apply and close.
  - Checked state on button bar showing current filled values with checkmarks.

## 4. Single-Page Preview, Publishing & Favorites
- Non-editable live preview card displaying formatted invitation text in clear, enlarged serif typography.
- Custom Named Favorites: Users can name and save their configurations to `localStorage`.
- Mandatory Privacy Consent Checkbox before publish.
- AI Appropriateness Screening: Polite advisory modal if potential flags are detected prior to human moderation.
- Primary Action: "Publicera på anslagstavlan".
- Gateway SMS/QR Section with exact 3-line notice pointing to 0736108997.
