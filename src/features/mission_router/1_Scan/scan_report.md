# 1_Scan: Context, Constraints & Baselines (Ge stöd)

## Objective
Analyze the current baseline system, map environmental constraints, identify required API endpoints, and establish dependencies for **Project "Ge stöd"** (formerly Stateless Mission Router), focusing on domain modularization, context-aware WhatsApp chat routing via quotes, and frictionless volunteer interactions.

## 1. Rebranding Strategy: "Ge stöd"
* **Scope**: Eradicate all instances of "Stateless Mission Router" from code, comments, titles, and documentation.
* **UI Tone**: Soft, warm, welcoming, and community-driven. Focuses on support (stöd) rather than routing or technical telemetry.
* **Visual Identity**: Clean, supportive layout with teal accents.

## 2. Domain Modularization (FSD Alignment)
To eliminate the server monolith, `server.ts` will be stripped to its HTTP framework shell and delegate business logic to clean domain sub-modules:
1. **`parser.ts`**:
   - Location geocoding table (`GEOMAP`).
   - Pythagorean distance & district matching (`STODDISTRIKT`).
   - Bracket regex parsing of incoming messages.
   - Spatial cloaking formulation.
2. **`pushService.ts`**:
   - VAPID key initialization.
   - Subscription persistence (`subscriptions.json`) and active subscription array.
   - Language, area, and organization-based filtering.
   - **`triggerPushAlert(alert: ActiveAlert): Promise<number>`**: Awaits and returns the number of reached volunteers in real time to provide immediate feedback to missionaries.
   - Silent cancel push broadcaster.
3. **`whatsappBot.ts`**:
   - Initialization and connection state management for `whatsapp-web.js`.
   - Handling of incoming messages, including routing to `parser.ts` or triggering smart cancellation.
   - **Smart Cancellation Logic**: Processes "avboka"/"avbryt" by searching `activeAlerts` for the sender's phone. Handles single or multi-request cancellation using a numbered index reply list, with no persistent session DB required.
   - **Anonymous Quote-Based Chat Routing**: Maps sent message IDs to alert IDs (`Record<string, string>`). Resolves replies to specific alerts via `msg.getQuotedMessage()`, appending to the alert's RAM-based chat log and routing to the active volunteer's browser view.

## 3. Persistent Notifications & Calendar Utilities
* **`requireInteraction: true`**: Native Service Worker configuration for sticky notifications that require user dismissal. Enabled by default with an optional opt-out checkbox in Onboarding.
* **iCal Calendar Generator**: Clientside generator of standard `.ics` files in `AlertDetail.tsx` providing a direct deep link back to the alert in the description/URL fields.

## 4. Operational File Plan
* Update `/src/features/mission_router/1_Scan/scan_report.md` (This file)
* Update `/src/features/mission_router/2_Blueprint/blueprint_spec.md` with complete architecture schemas.
* Update `/src/features/mission_router/3_Council_Impact/council_debate.md` with adversarial safety/GDPR checks.
* Implement `/src/features/mission_router/domain/parser.ts`, `pushService.ts`, `whatsappBot.ts`.
* Update `/server.ts` to utilize these domain modules.
* Update UI components to conform with "Ge stöd" rebranding, chat interface, calendar downloads, and name/phone prompts.
