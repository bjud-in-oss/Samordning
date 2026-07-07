# 3_Council_Impact: Dialectical Debate & Architectural Synchronization

## Adversarial Perspectives on "Ge stöd" Features

### 1. The Innovator (Att förändra)
* **Argument**: Let's build a fully real-time bidirectional anonymous chat. We should push the envelope of WhatsApp's reply mechanics. When a volunteer sends a chat from the Web UI, it lands on the missionary's phone. By replying using the native quote-reply feature in WhatsApp, the missionary initiates an ongoing conversation thread without installing any special app. This allows them to coordinate things like "where should we meet exactly?" or "should I wear a suit?" in real time.
* **UX Concept**: Let's construct a beautiful chat panel on the `/larm/:id` view that mimics a clean SMS/chat interface. When a volunteer sends a message, they get live visual indicators. Let's also build a simulated quoting interface in the developer `SimulatorPanel` so the feature can be tested instantly!

### 2. The Reflector (Att vända)
* **Argument**: We must ensure absolute GDPR compliance and prevent any data leaks. The user strictly specified: *"Noll permanent personuppgiftslagring."* We must make sure that when a volunteer inputs their name and phone number on the `/larm/:id` page, this data is *only* held in RAM for the active alert session, or used as the display header for the WhatsApp message. Once the session is closed via the **Amnesi-utlösning** (Amnesia Trigger), all chat records and correlation mappings are completely purged from memory.
* **Edge Case Alarm**: What happens if a missionary pair has *multiple* active alerts running simultaneously, and they reply to a volunteer's message but *forget* to use the WhatsApp Quote/Reply feature?
  - If they reply without a quote, and we blindly forward it to *all* active chats, we have a massive security/privacy breach! An investigator or volunteer of one alert will see communication meant for another.
  - To prevent this leakage, if the missionary has **multiple** active alerts and sends a non-quote message, the bot **MUST NOT** route the message to any chat. Instead, the bot must intercept it and reply with a strict warning:
    `Ge stöd: Jag kan tyvärr inte se vilket möte du svarar på. Vänligen svara genom att hålla in och "citera" (Reply) det specifika meddelandet du vill besvara.`
  - If they have **exactly one** active alert, we can safely and gracefully fall back to routing the message to that single active alert, ensuring a smooth UX for the common single-alert scenario!

### 3. The Mediator (Att förlika)
* **Resolution**:
  - We will implement the quote-reply mapping in memory via `MessageCorrelation` map.
  - The "forgot to quote" edge case is handled cleanly:
    - 0 active alerts: Respond "Du har inga aktiva möten just nu."
    - 1 active alert: Route the message to that alert's chat log as a fallback.
    - >1 active alerts: Block the message and reply on WhatsApp prompting the missionary to hold down and "Quote" the specific message they want to answer.
  - We will introduce a clear, highly visible "Avsluta & radera larm (Amnesi-utlösning)" button in the `/larm/:id` view, allowing either the volunteer or missionary to trigger immediate purging of the session.
  - All occurrences of "Stateless Mission Router" are officially rebranded to **"Ge stöd"**, giving a warm, loving, and community-centered feeling.

---

## Architectural Synchronization & Impact Analysis

### Operative Files to Modify, Split, or Create

1. **`src/features/mission_router/types.ts`** (Modify):
   - Update interfaces (`ActiveAlert`, `ChatMessage`) to support in-memory chat histories, correlation IDs, and onboarding tags (including `requireInteraction`).

2. **`src/features/mission_router/domain/parser.ts`** (Create):
   - Modularized geocoding tables, Pythagoras calculation, and regex parsing logic.

3. **`src/features/mission_router/domain/pushService.ts`** (Create):
   - Modularized Web Push configuration, subscriber storage (`subscriptions.json` persistence), subscription filtering, and real-time push feedback awaiting.

4. **`src/features/mission_router/domain/whatsappBot.ts`** (Create):
   - Modularized `whatsapp-web.js` configuration, smart cancellation parser, quote-reply routing logic, and simulated reply triggers.

5. **`server.ts`** (Modify):
   - Strip monolith business logic. Import and delegate to `parser.ts`, `pushService.ts`, and `whatsappBot.ts`.
   - Update API routes to serve chat log fetching, chat sending (`POST /api/alerts/:id/chat`), and immediate push-volunteers count feedback.

6. **`src/features/mission_router/translations.ts`** (Modify):
   - Complete rebranding of "Missionshjälpen" / "Stateless Mission Router" to "Ge stöd" and update all language dictionaries with chat strings, persistent notifications, and calendar prompts.

7. **`src/features/mission_router/components/OnboardingForm.tsx`** (Modify):
   - Add "Envisa aviseringar" (`requireInteraction`) setting and update labels to match "Ge stöd".

8. **`src/features/mission_router/components/AlertDetail.tsx`** (Modify):
   - Add the dynamic, anonymous Chat interface.
   - Add clientside `.ics` calendar generation download button.
   - Introduce "Avsluta och radera larm" button (Immediate Amnesia purge).
   - Improve name and phone prompts with helpful guidance.

9. **`src/features/mission_router/components/SimulatorPanel.tsx`** (Modify):
   - Upgrade simulated WhatsApp inbox. Allow developers to mock "Quotes" by clicking "Svara" on simulated outgoing volunteer chat logs!
