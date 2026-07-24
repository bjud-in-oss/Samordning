# Blueprint Specification - ETAPP 3 UI/UX Enhancements & Reassurance

## 1. Overview & Architecture
This blueprint updates the PWA invitation form and stream floating button layout to improve user reassurance, location entry flexibility, and clean positioning.

## 2. Floating Action Button (FAB) Positioning
- Button text: "Bjud in" with single icon (avoiding double `++` plus sign).
- Anchor: Positioned floating on the bottom-right edge of the centered `max-w-2xl` content column (`fixed bottom-6 inset-x-0 max-w-2xl mx-auto px-4 flex justify-end pointer-events-none`).

## 3. Location Input with Free-Text & Map Matching
- Dialog 2: "Mötesplats: (Var ses vi?)"
- Features open text input field allowing any custom address or place name.
- Preserves quick POI pill buttons for instant selection.
- Automatic geocode / area matching against Göteborg district map data (`mapData.ts`).

## 4. Organizer Reassurance & Guidance
- Dialog 6: "Arrangör: (Vem håller i aktiviteten?)"
- Reassurance notice: "Aktiviteten skickas som ett förslag till de ansvariga ledarna för den valda gruppen. Du behöver inte vara orolig om du klickar på en organisation – de granskar förslaget, godkänner det och hör av sig om det finns några frågor."

## 5. Conditional QR Code & Gateway Reveal
- QR code and SMS-gateway instructions are hidden by default until all mandatory fields are completed OR when the user toggles "Visa QR/SMS-väg".
- Preserves exact 3-line required notice pointing to Gateway `0736108997`.
