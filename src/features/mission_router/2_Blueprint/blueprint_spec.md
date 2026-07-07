# Ge stöd: System Specification & Contracts

This specification outlines the technical design, schemas, and endpoints for **"Ge stöd"** (formerly Stateless Mission Router).

## 1. Domain Modularization Strategy (FSD Structure)
To keep the server clean and maintainable, all logical subdomains are separated under `src/features/mission_router/domain/`:

```
src/features/mission_router/
├── 1_Scan/
│   └── scan_report.md
├── 2_Blueprint/
│   └── blueprint_spec.md
├── 3_Council_Impact/
│   └── council_debate.md
├── domain/
│   ├── parser.ts          # Text parsing, geocoding & spatial-cloaking
│   ├── pushService.ts     # Web push keys, subscribers & trigger alerts
│   └── whatsappBot.ts     # WhatsApp gateway, smart cancellations & quote-routing
├── components/
│   ├── AlertDetail.tsx    # Details view, calendar download & chat client
│   ├── Disclaimer.tsx
│   ├── OnboardingForm.tsx # Subscription preferences (inc. requireInteraction)
│   └── SimulatorPanel.tsx # High-fidelity test panel (inc. simulated reply-quote)
├── translations.ts        # Fully internationalized dictionary
└── types.ts               # Shared TypeScript types
```

---

## 2. In-Memory Data Structures (RAM Only)

```typescript
export interface ChatMessage {
  id: string;          // Unique WhatsApp or client message ID
  sender: "volunteer" | "missionary";
  senderName: string;
  text: string;
  timestamp: number;
}

export interface ActiveAlert {
  id: string;               // Unique random alert_id (e.g., "ab39d1f")
  missionaryPhone: string;  // Raw phone number for anonymous communication broker
  rawText: string;          // Original raw message from missionary
  scrubbedText: string;     // Parsed bracketed info only
  area: string;             // Parsed area
  time: string;             // Parsed time
  gender: string;           // Parsed gender ("bror" | "syster")
  language: string;         // Parsed language ("engelska" etc.)
  locationName: string;     // Geocoded location (approximated on map)
  coords: { lat: number; lng: number };
  cloakedCoords: { lat: number; lng: number }; // Rounded to 0.02 decimal degrees
  timestamp: number;
  chat: ChatMessage[];      // Real-time conversation thread
}

// In-memory mappings for anonymized chat routing
// Maps sent WhatsApp message ID to Alert ID
export interface MessageCorrelation {
  alertId: string;
}
```

---

## 3. Spatial Cloaking & Geometry
* **Formel**: `Avrundat = Math.round(Coord / 0.02) * 0.02;`
* This rounds latitude and longitude to steps of `0.02` degrees, covering roughly a 2.2 km box. This protects the exact location of the investigator (undersökaren) while giving the volunteer the correct neighborhood.

### Gothenburg Supporting Districts (Fastställda Stöddistrikt)
We define 15 fixed locations (name + lat + lng) for calculating local spatial routing:
1. **Kortedala**: `{ name: "Kortedala", lat: 57.750, lng: 12.033 }`
2. **Majorna**: `{ name: "Majorna", lat: 57.691, lng: 11.921 }`
3. **Frölunda**: `{ name: "Frölunda", lat: 57.652, lng: 11.910 }`
4. **Hisingen**: `{ name: "Hisingen", lat: 57.731, lng: 11.933 }`
5. **Angered**: `{ name: "Angered", lat: 57.795, lng: 12.043 }`
6. **Mölndal**: `{ name: "Mölndal", lat: 57.658, lng: 12.013 }`
7. **Partille**: `{ name: "Partille", lat: 57.740, lng: 12.100 }`
8. **Johanneberg**: `{ name: "Johanneberg", lat: 57.690, lng: 11.980 }`
9. **Lundby**: `{ name: "Lundby", lat: 57.717, lng: 11.938 }`
10. **Biskopsgården**: `{ name: "Biskopsgården", lat: 57.728, lng: 11.895 }`
11. **Gamlestaden**: `{ name: "Gamlestaden", lat: 57.733, lng: 12.008 }`
12. **Örgryte**: `{ name: "Örgryte", lat: 57.702, lng: 12.012 }`
13. **Torslanda**: `{ name: "Torslanda", lat: 57.724, lng: 11.780 }`
14. **Askim**: `{ name: "Askim", lat: 57.616, lng: 11.944 }`
15. **Härryda**: `{ name: "Härryda", lat: 57.683, lng: 12.316 }`

### Pythagoras Distance
For Gothenburg (Latitude ~57.7):
* `d^2 = (dx * 0.53)^2 + dy^2`
where `dx = lng1 - lng2` and `dy = lat1 - lat2`. The factor `0.53` compensates for the narrowing of longitude lines at Gothenburg's latitude.

---

## 4. Communication Bridge & Quote-Based Routing Protocol
Volunteers (Web UI) and Missionaries (WhatsApp) engage in secure, anonymized chat without disclosing volunteer phone numbers or personal names:

1. **Web to WhatsApp**:
   - Volunteer types a message. UI calls `POST /api/alerts/:id/chat` with `{ text, senderName, senderPhone }`.
   - Backend forwards to the missionary's real phone number using `whatsapp-web.js`:
     `Ge stöd: [Kortedala Torg] Volontär (${senderName}): "${text}" (Svara direkt på detta meddelande för att skriva till volontären)`
   - The returned WhatsApp message's `id._serialized` is saved in the global correlation map:
     `messageCorrelation[serializedId] = { alertId: alert.id }`

2. **WhatsApp to Web (Contextual Quote Routing)**:
   - When a missionary replies to that specific message on WhatsApp, `whatsapp-web.js` receives `msg`.
   - The backend checks `msg.hasQuotedMsg`.
   - It fetches the quoted message using `const quotedMsg = await msg.getQuotedMessage()`.
   - It checks `messageCorrelation[quotedMsg.id._serialized]`.
   - If a correlation exists, the reply is securely appended to `activeAlerts[alertId].chat` and streamed/polled in the volunteer's active UI session.
   - **Smart Fallback**: If the missionary sends a message without a quote, and they only have *exactly one* active alert, the message is routed to that alert's chat log. If they have *multiple* active alerts, they receive a prompt:
     `Ge stöd: Jag kan tyvärr inte se vilket möte du svarar på. Vänligen svara genom att hålla in och "citera" (Reply) det specifika meddelandet du vill besvara.`

---

## 5. Smart Cancellation (No ID Codes Required)
* Missionaries send "avboka" or "avbryt" to cancel an active support request.
* **Single Alert Case**: If they have exactly 1 active alert, it is cancelled instantly. The database is cleared, and a silent `{ type: 'CANCEL' }` push notification is broadcast to volunteers to dismiss browser notifications.
* **Multi-Alert Case**: If they have more than 1 active alert, the bot replies with a numbered list:
  `Ge stöd: Du har flera aktiva möten. Svara med siffran för det möte du vill ta bort:`
  `1. Kortedala kl 18:00`
  `2. Angered Centrum kl 19:15`
* Sending the number (or "avboka 1") immediately cancels the corresponding alert.

---

## 6. Web Push & Sticky Notifications
* **Sticky Notifications (`requireInteraction: true`)**: Configured in `sw.js` so that alerts persist on screen until dismissed by the user. Subscriptions can opt out via Onboarding settings.
* **Immediate Feedback**: The alert trigger counts matching subscribers and immediately responds on WhatsApp:
  `Ge stöd: Larmet har skickats ut! Det har nått ${pushCount} aktiva volontärer i ${resolvedArea}.`

---

## 7. Client-Side iCal Calendar Generation
Users can click "Spara i Kalender" to instantly download a `.ics` file generated on the fly in the browser. It details:
* Date and time mapped to the alert's scheduled time slot.
* Detailed description including a deep link back to the alert page: `/?alertId=${alert.id}`.
* Encrypted deep-linked URL field to streamline re-accessing the active chat bridge.
