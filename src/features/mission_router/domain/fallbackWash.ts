import { STODDISTRIKT } from "./geoUtils";

export interface GeminiWashResult {
  originalText: string;
  extractedMetadata: {
    category: "Vara en vän" | "Få näring av Guds ord" | "Hjälpa andra";
    area: string | null;
    time: string | null;
    audience: "Alla" | "Enbart missionärerna";
    organization: string;
    locationName: string;
    language: string | null;
  };
  aiFeedback: string;
  warnings: {
    missingAreaForTeaching: boolean;
    audienceWarning: boolean;
  };
}

export function runFallbackWash(text: string): GeminiWashResult {
  const lowerText = text.toLowerCase();

  let category: "Vara en vän" | "Få näring av Guds ord" | "Hjälpa andra" = "Vara en vän";
  if (lowerText.includes("lektion") || lowerText.includes("undervisa") || lowerText.includes("samtal") || lowerText.includes("intresserad") || lowerText.includes("undersökare") || lowerText.includes("träffa")) {
    category = "Få näring av Guds ord";
  } else if (lowerText.includes("städa") || lowerText.includes("flytta") || lowerText.includes("bära") || lowerText.includes("hjälpa") || lowerText.includes("tjänande")) {
    category = "Hjälpa andra";
  }

  let area: string | null = null;
  const foundDistrict = STODDISTRIKT.find(d => lowerText.includes(d.name.toLowerCase()));
  if (foundDistrict) {
    area = foundDistrict.name;
  }

  let time: string | null = null;
  const timeMatch = text.match(/\b\d{1,2}[:.]\d{2}\b/);
  if (timeMatch) {
    time = timeMatch[0].replace(".", ":");
  }

  let audience: "Alla" | "Enbart missionärerna" = "Alla";
  if (lowerText.includes("äldsterna") || lowerText.includes("systrarna") || lowerText.includes("enbart missionärerna") || lowerText.includes("bara missionärerna")) {
    audience = "Enbart missionärerna";
  }

  let audienceWarning = false;
  if (lowerText.includes("unga män") || lowerText.includes("unga kvinnor") || lowerText.includes("primär") || lowerText.includes("hjälpforeningen") || lowerText.includes("hjälpföreningen")) {
    audienceWarning = true;
  }

  let organization = "Enskild/Familj";
  const orgs = [
    { name: "Missionärerna", keywords: ["äldste", "äldsterna", "systrarna", "syster", "missionärerna", "missionärer"] },
    { name: "Biskopsrådet", keywords: ["biskop", "biskopen", "biskopsrådet"] },
    { name: "Äldstekvorumet", keywords: ["äldstekvorumet", "kvorumet"] },
    { name: "Hjälpföreningen", keywords: ["hjälpföreningen", "hjalpforeningen", "hf"] },
    { name: "Unga Män (UM)", keywords: ["unga män", "um", "pionjär"] },
    { name: "Unga Kvinnor (UK)", keywords: ["unga kvinnor", "uk"] },
    { name: "Primär", keywords: ["primär", "barnen"] },
    { name: "Söndagsskolan", keywords: ["söndagsskolan"] },
    { name: "Aktivitetskommittén", keywords: ["aktivitetskommitté", "aktivitetskommitte"] },
    { name: "Unga vuxna (UV)", keywords: ["unga vuxna", "uv"] },
    { name: "Ensamstående vuxna (EV)", keywords: ["ensamstående vuxna", "ev"] },
    { name: "Institutet", keywords: ["institut", "institutet"] },
    { name: "Seminariet", keywords: ["seminariet", "seminarie"] },
    { name: "Staven", keywords: ["staven", "stavspresident"] },
    { name: "Församlingsmissionen", keywords: ["församlingsmissionen", "församlingsmissionärer", "församlingsmission"] }
  ];

  for (const org of orgs) {
    if (org.keywords.some(k => lowerText.includes(k))) {
      organization = org.name;
      break;
    }
  }

  let locationName = "Kapellet";
  if (lowerText.includes("hemma hos") || lowerText.includes("hos oss") || lowerText.includes("vårt hem")) {
    locationName = "Medlemmens hem";
  } else {
    const locMatch = text.match(/plats:\s*([^,.\n]+)/i);
    if (locMatch) {
      locationName = locMatch[1].trim();
    }
  }

  let language: string | null = null;
  if (lowerText.includes("svenska")) language = "Svenska";
  else if (lowerText.includes("engelska") || lowerText.includes("english")) language = "Engelska";
  else if (lowerText.includes("spanska")) language = "Spanska";

  const isTeaching = lowerText.includes("undervisa") || lowerText.includes("lektion") || lowerText.includes("träffa en intresserad") || lowerText.includes("undersökare");
  const missingAreaForTeaching = isTeaching && !area;

  let aiFeedback = "";
  if (missingAreaForTeaching) {
    aiFeedback += "För att rätt lokala stödsyskon ska nås måste du ange vilket område personen bor i.\n";
  } else {
    aiFeedback += "Ditt utkast ser jättefint ut! Vi har taggat upp det åt dig.\n";
  }

  if (!language) {
    aiFeedback += "Tips: Nämn gärna vilka språk som talas/tolkas så att fler kan delta.\n";
  }

  if (isTeaching) {
    aiFeedback += "Tips: Överväg att skriva att stödsyskon kan ringa in via video på 5 minuter – perfekt för nya bekantskaper som kanske inte dyker upp.\n";
  }

  return {
    originalText: text,
    extractedMetadata: {
      category,
      area,
      time,
      audience,
      organization,
      locationName,
      language
    },
    aiFeedback: aiFeedback.trim(),
    warnings: {
      missingAreaForTeaching,
      audienceWarning
    }
  };
}
