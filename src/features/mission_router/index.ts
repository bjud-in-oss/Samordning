// [src/features/mission_router/index.ts] - Public API Barrier (Client-safe)

export { TRANSLATIONS } from "./translations";
export type { UiLanguage, TranslationDict } from "./translations";

export {
  runAiWash,
  getCoordsForArea,
  calculateSecondsUntilTime,
  findClosestDistrict,
  parseMissionaryMessage,
  runFallbackWash,
  runGeminiWash,
  washAnnouncementText,
  isApprovedSender,
  APPROVED_SENDERS,
  GEOMAP,
  STODDISTRIKT
} from "./domain/parser";
export type { GeminiWashResult } from "./domain/parser";

export { MAP_DISTRICTS, GOTEBORG_AREAS, AREA_TO_DISTRICT_MAP, DISTRICT_NAME_MAPPING } from "./domain/mapData";
export type { MapDistrict } from "./domain/mapData";

export type {
  ActiveAlert,
  StreamItemType,
  PushSubscriptionKeys,
  ClientPushSubscription,
  SubscriptionRecord,
  ChatMessage,
  SimLog,
  GatewayStatus
} from "./types";
