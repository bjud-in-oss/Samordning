# 1_Scan: Context, Constraints & Baselines (Älska, dela och bjud in)

## 1. Architectural Rebranding: "Älska, dela och bjud in" ("Ge stöd")
* **Title**: Transition to a frictionless "digital veranda" where we gather all parish coordination needs in a single stream.
* **Unified Flow**: Discard the dual-mode structure (acute vs announcements) on the frontend. Consolidate into a single platt ström (flat flow) of chronological cards called "Notiser" (Notices).
* **Compliance**: Strict adherence to General Handbook 33.8 (integrity wash):
  - Strip surnames.
  - Convert precise residential addresses to general neighborhoods/districts.
  - Extract and conceal contact parameters (`contactType` and `contactValue`).
  - No persistent database on disk; RAM-only in-memory storage.

## 2. Stateless Google Inlet (E-post)
* **Goal**: Enable `/api/incoming-email` to accept leader announcements sent to the parish mission account (`alska.dela.bjudin@gmail.com`).
* **White-list Validation**: Restrict processing to pre-validated sender addresses (e.g., Bishopric, Elders Quorum, Relief Society presidencies, Ward Missionaries, or `@goteseb.se` domain). Unapproved senders are securely logged and ignored to prevent spam poisoning.

## 3. Real-time Gemini AI Wash Pipeline
* **Engine**: `@google/genai` with `gemini-3.1-flash-lite`.
* **Prompt Engineering Constraints**:
  - Automatically parse raw text input from mail/SMS.
  - Wipe sensitive PII (surnames, phone numbers, email addresses, exact house/apartment coordinates) from `scrubbedText`.
  - Intelligently populate `responsibleParty` with the sender's title/name.
  - Segment hidden contact details into typed targets: `contactType` ("sms" | "email" | "whatsapp") and `contactValue`.
  - Estimate chronological duration (`expiryTimestamp`) and district matching (`area`).

## 4. Smart Interaction Buttons & iOS Desktop Shortcut Prompts
* **Frictionless UI Integration**: Action buttons trigger system-native deep-links (`mailto:`, `sms:`, `https://wa.me/`) dynamically, bypassing intermediate manual copying steps and holding zero persistent session context in RAM once completed.
* **iOS Detection Rule**: Home screen bookmarking installation guidelines should not clutter the screen for Android/Desktop users. Present the prompt *only* if `navigator.userAgent` detects Apple mobile hardware AND the user is in a normal browser (not in standalone PWA mode) trying to enable notifications.
