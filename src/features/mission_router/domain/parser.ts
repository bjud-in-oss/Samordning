// [src/features/mission_router/domain/parser.ts] - Main Parser & AI Wash Domain Entrypoint

import { getCoordsForArea } from "./geoUtils";
import { runGeminiWash, washAnnouncementText } from "./geminiWash";
import { GeminiWashResult, runFallbackWash } from "./fallbackWash";

export * from "./geoUtils";
export * from "./fallbackWash";
export * from "./geminiWash";

export async function runAiWash(
  rawText: string, 
  senderInfo: { role: string; contact: string; originalType?: "missionary_alert" | "leader_invitation" }
): Promise<any> {
  const result = await runGeminiWash(rawText);
  const area = result.extractedMetadata.area || "Kortedala";
  const { coords, cloakedCoords } = getCoordsForArea(area);

  return {
    scrubbedText: rawText,
    responsibleParty: result.extractedMetadata.organization,
    contactType: "sms" as const,
    contactValue: senderInfo.contact,
    area: area,
    time: result.extractedMetadata.time || "Ospecificerad tid",
    locationName: result.extractedMetadata.locationName || area,
    category: result.extractedMetadata.category,
    coords,
    cloakedCoords,
    type: senderInfo.originalType || "leader_invitation"
  };
}
