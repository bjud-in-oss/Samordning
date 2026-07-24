// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Domain Geocoder & KML Matcher

import { POI_LOCATIONS } from "./constants";
import { GOTEBORG_AREAS } from "../../anpassa/mapData";

export function matchLocationToArea(locationText: string): string | null {
  if (!locationText || !locationText.trim()) return null;
  const lower = locationText.toLowerCase();

  // First check exact or partial POI district match
  for (const poi of POI_LOCATIONS) {
    const key = poi.split(" ")[0].toLowerCase();
    if (lower.includes(key)) {
      return poi;
    }
  }

  // Next check GOTEBORG_AREAS polygons / names
  for (const areaName of GOTEBORG_AREAS) {
    if (lower.includes(areaName.toLowerCase())) {
      return areaName;
    }
  }

  return null;
}
