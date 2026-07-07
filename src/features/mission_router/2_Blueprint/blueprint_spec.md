# 2_Blueprint: System Specification & Contracts

## 1. Data Contracts (Stateless & Anonymized)

### A. Web Push Subscription Store (Persistent but Anonymous)
We save ONLY the Web Push subscription object and tags.
```typescript
interface SubscriptionRecord {
  id: string; // Random UUID
  subscription: webpush.PushSubscription;
  tags: {
    areas: string[];          // e.g. ["Kortedala", "Majorna", "Frölunda"]
    languages?: string[];     // e.g. ["Svenska", "English"]
    organization?: string;    // e.g. "bror" | "syster"
    formats: ("physical" | "telephone")[];
    alwaysNotify: boolean;    // "Skicka larm alltid, jag avgör i stunden"
    spiritualTips: boolean;   // "Veckans andliga tips"
  }
}
```

### B. In-Memory Alert Store (Active Lifecycle - Cleared on Response/Amnesia)
Lives 100% in backend memory (`Record<string, ActiveAlert>`).
```typescript
interface ActiveAlert {
  id: string;               // UUID / generated larm_id
  missionaryPhone: string;  // Raw phone number of missionary pair
  rawText: string;          // Original un-scrubbed message
  scrubbedText: string;     // Parsed bracketed info only
  area: string;             // Parsed area
  time: string;             // Parsed time
  gender: string;           // Parsed gender ("bror" | "syster")
  language: string;         // Parsed language ("engelska" etc.)
  locationName: string;     // e.g. "Kortedala Torg"
  coords: { lat: number; lng: number };
  cloakedCoords: { lat: number; lng: number }; // Math.round(Coord / 0.02) * 0.02
  timestamp: number;        // Created time
  ttl: number;              // Expiry time (e.g., alert time + 2 hours)
}
```

## 2. Spatial Cloaking & Geometry
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

## 3. Parsing Regex (WhatsApp Multi-bracket)
Message Format: `"Vi ska till [Kortedala Torg] kl [18:00]. Behöver en [bror] för [engelska]."`
* **Scrubbing Regex**: Matches text inside brackets `\[(.*?)\]`
* Output details:
  1. Plats/Location: `brackets[0]` -> `"Kortedala Torg"`
  2. Tid/Time: `brackets[1]` -> `"18:00"`
  3. Kön/Gender: `brackets[2]` -> `"bror"` (or syster)
  4. Språk/Language: `brackets[3]` -> `"engelska"`

Any text outside brackets is discarded instantly to protect privacy.

## 4. API Endpoints
* `POST /api/subscription` - Register anonymous subscription + tags.
* `GET /api/alerts/:id` - Fetch scrubbed alert information (or returns 404 if expired or wiped by amnesia).
* `POST /api/alerts/:id/respond` - Send response text back to WhatsApp missionary pair, then instantly trigger Amnesia (wipe record).
* `POST /api/sim/whatsapp` - Mock receiving a WhatsApp message from a missionary (triggers push notification + console output).
* `GET /api/sim/messages` - Fetch list of mock messages sent/received for the high-fidelity dashboard.
