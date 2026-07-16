// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

export type StreamItemType = "missionary_alert" | "leader_invitation";

export interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface ClientPushSubscription {
  endpoint: string;
  expirationTime: number | null;
  keys: PushSubscriptionKeys;
}

export interface SubscriptionRecord {
  id: string;
  subscription: ClientPushSubscription;
  tags: {
    areas: string[];
    primaryArea?: string;
    limitAreas?: boolean;
    limitedAreas?: string[];
    limitOrganizations?: boolean;
    limitedOrganizations?: string[];
    languages?: string[];
    organization?: string;
    formats: ("physical" | "telephone")[];
    alwaysNotify: boolean;
    spiritualTips: boolean;
    requireInteraction?: boolean;
  };
}

export interface ChatMessage {
  id: string;
  sender: "volunteer" | "missionary";
  senderName: string;
  text: string;
  timestamp: number;
}

export interface ActiveAlert {
  id: string;
  type: StreamItemType;
  missionaryPhone?: string;
  rawText: string;
  scrubbedText: string;
  area: string;
  time: string;
  gender: string;
  language: string;
  locationName: string;
  coords: { lat: number; lng: number };
  cloakedCoords: { lat: number; lng: number };
  timestamp: number;
  chat?: ChatMessage[];
  responsibleParty: string;
  contactType: "sms" | "email" | "whatsapp" | "web";
  contactValue: string;
  expiryTimestamp: number;
  category?: string;
  isFull?: boolean;
  status?: 'active' | 'pending';
  escalationLevel?: number;
  totalActiveAlerts?: number;
}

export interface SimLog {
  id: string;
  timestamp: number;
  type: "incoming" | "outgoing" | "system" | "push";
  message: string;
  details?: any;
}

export interface WhatsAppStatus {
  status: "disconnected" | "connecting" | "connected" | "error";
  qrCode: string | null;
  error: string | null;
}
