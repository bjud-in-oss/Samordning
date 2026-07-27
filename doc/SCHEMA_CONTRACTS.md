# Master Schema Contracts & Interface Definitions

## 1. `ActiveAlert` Contract (`mission_router`)
```typescript
export interface ActiveAlert {
  id: string;
  category: string;
  time: string;
  location: string;
  targetGroup: string;
  organization: string;
  text: string;
  areas: string[];
  districtNames: string[];
  timestamp: string;
  source: string;
  isRecurring?: boolean;
  hasReminder?: boolean;
  reminderTime?: string;
}
```

## 2. `FormState` & Invitation Proposal Contract (`skapa_inbjudan`)
```typescript
export interface FormState {
  time: string;
  location: string;
  areas: string[];
  audience: string[];
  organization: string;
  organizerPersonName: string;
  activityText: string;
  isRecurring: boolean;
  hasReminder: boolean;
  reminderTime: string;
}

export interface AiReviewProposal {
  missingFields: string[];
  extractedFromText: {
    time?: string;
    location?: string;
  };
  organizerNotice?: string;
  reasonCopy: string;
  hasPrivacyFlag: boolean;
}
```

## 3. Gateway SMS Payload Contract
Standard multiline payload parsed by `server.ts` and `washAnnouncementText`:
```text
#WEBB
Kategori: [Aktivitet]
Tid: [Kl. HH:MM]
Område: [Göteborg]
Avsändare: [Organisation]
Text: [Beskrivning...]
```
