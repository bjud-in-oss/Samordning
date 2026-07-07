# 3_Council_Impact: Dialectical Debate & Architectural Synchronization

## Adversarial Perspectives

### 1. The Innovator (Att förändra)
* **Argument**: Let's build a dual-layer WhatsApp connection. Use `whatsapp-web.js` for production, and integrate a high-fidelity Web UI WhatsApp simulator console in the app so that anyone can run, trigger, and review the entire regex cleaning, spatial-cloaking, and push notification process instantly inside the browser. This ensures that even if Chrome sandboxing restricts headless WhatsApp in the testing container, the entire logic works flawlessly and can be validated by anyone!
* **UX Idea**: Let's design a split-screen dashboard layout for the administrative and developer view, where a developer can simulate being a missionary on one side, and see the webpush triggers, area matches, and responding volunteer actions occur in real time. We should support custom VAPID keys that generate automatically on server boot if not specified, making the push integration "just work" right out of the box.

### 2. The Reflector (Att vända)
* **Argument**: We must remain extremely cautious about security, privacy, and simplicity. The user strictly specified: *"Noll permanent personuppgiftslagring."* We must ensure absolutely no database records are kept that link any real phone numbers, names, or locations of investigators to any identifiable information. All alert records `larm_id` in RAM must be completely destroyed the millisecond a volunteer responds. There must be zero leakage in console logs or Express error handling. We must disable Express access logs or strip parameters entirely in production mode.
* **Architecture Alarm**: For the React UI, we must design specifically for elderly users. This means extremely large touch targets (at least 48px), clean high-contrast off-whites/grays, simple checklist forms, and zero multi-column confusion. Do not overcomplicate the volunteer screen with technical details like coordinates or distances in miles; show the name of the nearest District (e.g. Kortedala Torg in Kortedala) and a simple input field for the text response.

### 3. The Mediator (Att förlika)
* **Argument**: We will implement the dual-mode WhatsApp adapter. The backend will attempt to spin up a mockable WhatsApp gateway. If `whatsapp-web.js` initializes, it works; otherwise, it gracefully logs and defaults to our web-based simulator, which perfectly exercises the real regex, Nominatim spatial lookup, cloaking calculations, and Push routing.
* **Layout Compromise**:
  - The Main App serves the elder-focused Onboarding/Registration view and the Active Alert Respond view (`/larm/:id`) cleanly.
  - An "Integrations & Testing Dashboard" is available via a clear, toggleable testing drawer/panel or tab to demonstrate the simulator and QR-code pairing (if real whatsapp-web.js is generating a QR).
  - Footer always renders the mandatory disclaimer: *"Fristående inofficiell tjänst, ej sponsrad av kyrkan."*
  - Express server shuts off logging of request queries or path parameters containing alert answers or phone numbers.

---

## Architectural Synchronization & Impact Analysis

### Operative Files to Modify, Split, or Create

1. **`server.ts`** (Create): Full-stack entry point. Integrates Vite middleware in dev, serves `/dist` in prod. Houses:
   - In-memory active alert registry (`Record<string, ActiveAlert>`).
   - Anonymous push token storage (stored in a JSON file `subscriptions.json` or in-memory array. Since we want persistent subscriptions but anonymous, storing them in a local lightweight file `data/subscriptions.json` prevents subscription loss when the server restarts, complying with "Databasen sparar ENDAST anonyma Webpush-tokens kopplade till generiska taggar").
   - Regex cleaning of bracketed strings.
   - Pythagoras distance lookup against 15 fasta stöddistrikt.
   - Spatial cloaking (0.02 rounding).
   - Mock/real WhatsApp broker (listening to incoming SMS/WhatsApp patterns and returning responses).
   - Web Push triggers using VAPID keys.

2. **`package.json`** (Modify): Update build scripts to use `esbuild server.ts --bundle` for production as defined in the guidelines, and set the dev script to `tsx server.ts`.

3. **`src/App.tsx`** (Modify): Setup client router and state management. Renders:
   - Onboarding View (for elderly members).
   - Active Alert View (`/larm/:id`).
   - Mock Simulator Panel (simulates WhatsApp interaction and lets the user test push notifications).
   - Pairing Console (visual QR code display if real WhatsApp-web is connecting).

4. **`public/sw.js`** (Create): Service worker for Web Push notification handling. Receives the push payload and displays a native browser notification, which links to `/larm/:id` when clicked.

5. **`tsconfig.json`** & **`vite.config.ts`**: Verify they can compile everything cleanly.
