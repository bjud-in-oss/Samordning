// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

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
    formats: ("physical" | "telephone")[];
    alwaysNotify: boolean;
    spiritualTips: boolean;
  };
}

export interface ActiveAlert {
  id: string;
  scrubbedText: string;
  area: string;
  time: string;
  gender: string;
  language: string;
  locationName: string;
  cloakedCoords: { lat: number; lng: number };
  timestamp: number;
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
