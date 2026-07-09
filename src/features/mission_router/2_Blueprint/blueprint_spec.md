# 2_Blueprint: Design Specifications (Digital Veranda & Notiser)

## 1. Unified Backend Registry and API Contracts
We unify the flat in-memory registry to maintain a single list of `ActiveAlert` (now referred to as **Notiser** / Notices) in `server.ts`.
```typescript
interface ActiveAlert {
  id: string; // Random short string
  type: "missionary_alert" | "leader_invitation";
  rawText: string;
  scrubbedText: string;
  area: string; // Gothenburg district
  time: string; // Relevant meeting time or "Ospecificerad tid"
  gender: string; // Target audience, e.g. "bror" / "syster" / "Alla medlemmar"
  language: string; // e.g. "Svenska"
  locationName: string; // e.g. "Kortedala"
  coords: { lat: number; lng: number };
  cloakedCoords: { lat: number; lng: number };
  timestamp: number; // Creation time
  responsibleParty: string; // e.g. "Syster Karin", "Biskopsrådet"
  contactType: "sms" | "email" | "whatsapp";
  contactValue: string; // Hidden contact detail
  expiryTimestamp: number; // Automated cleanup threshold
}
```

### Endpoints
1. `GET /api/sim/active-alerts`: Returns all active Notices. It strips `rawText` and `contactValue` to protect privacy on general index screens, making it fully compliant with § 33.8.
2. `GET /api/alerts/:id`: Returns the details of a notice, including `contactValue` for direct contact when explicitly requested by a logged/confirmed volunteer.
3. `POST /api/alerts/:id/respond`: Forwards responses via actual WhatsApp or logs a simulated action.
   * *Amnesia Protocol*: If `type === "missionary_alert"`, the Notice is instantly deleted from server RAM and matching push notifications are cancelled.
   * *Leader Notices (Inbjudningar)*: Remain active in the registry until their `expiryTimestamp` passes.
4. `POST /api/incoming-email`: Evaluates in-coming e-mails. Verifies whitelist, runs real-time Gemini AI Wash, and adds notice to memory.

## 2. Real-time Gemini AI Wash Instructions
We configure `runAiWash` in `parser.ts` to instruct `gemini-3.1-flash-lite` (or the appropriate flash model):
* Input: Raw text message + sender's default role + sender's email/phone.
* Output: Structured JSON mapping the properties of `ActiveAlert` with type `missionary_alert` or `leader_invitation`.
* **Privacy & Preservation Guard**: Strips surnames, precise house numbers, and phone numbers.
* **URL Preservation**: Crucially, any valid URLs (web URLs, Google Sheets/Drive files, virtual meeting invitations) MUST remain fully untouched and intact in `scrubbedText`.
* **Versatility**: The model is trained to process and categorize all types of general needs (dinners, transport, moving assistance, religious lessons).

## 3. Frontend Stream UI ("Älska, dela och bjud in")
* **Single View Layout**: The active view displays a single stream under "Älska, dela och bjud in" with sleek typography ("Space Grotesk" displays paired with "Inter").
* **Smart Actions**:
  * Clicking "Ge stöd" triggers native URI schemas depending on `contactType` and `contactValue`:
    - `sms` -> `sms:<number>?body=Hej! Angående Notisen i ${area}: ...`
    - `email` -> `mailto:<address>?subject=Ge stöd - Notis: ${area}&body=Hej! Jag hjälper gärna till med...`
    - `whatsapp` -> `https://wa.me/<number>?text=Hej! Angående...`
* **iOS Web Push Onboarding Prompt**:
  * Detect: `const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;`
  * Condition: Show an educational slide-up overlay detailing "Lägg till på hemskärmen" (Add to Home Screen) *only* if the user is on an iOS device AND they click the "Aktivera push-notiser" toggle inside a standard browser view (where native Web Push is restricted until bookmarked as an standalone app on iOS).
