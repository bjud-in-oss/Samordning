// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]
import { GoogleGenAI } from "@google/genai";

// 16 Fasta Stöddistrikt i Göteborg (Geografiskt sorterat Norr -> Söder)
export const STODDISTRIKT = [
  { name: "Angered", lat: 57.7958, lng: 12.0432 },
  { name: "Bergsjön", lat: 57.7479, lng: 12.0592 },
  { name: "Kortedala", lat: 57.7506, lng: 12.0335 },
  { name: "Gamlestaden", lat: 57.7332, lng: 12.0084 },
  { name: "Hisingen", lat: 57.7311, lng: 11.9332 },
  { name: "Biskopsgården", lat: 57.7281, lng: 11.8955 },
  { name: "Lundby", lat: 57.7172, lng: 11.9381 },
  { name: "Partille", lat: 57.7402, lng: 12.1002 },
  { name: "Örgryte", lat: 57.7024, lng: 12.0121 },
  { name: "Johanneberg", lat: 57.6901, lng: 11.9805 },
  { name: "Majorna", lat: 57.6914, lng: 11.9213 },
  { name: "Mölndal", lat: 57.6583, lng: 12.0132 },
  { name: "Frölunda", lat: 57.6521, lng: 11.9105 },
  { name: "Torslanda", lat: 57.7241, lng: 11.7802 },
  { name: "Askim", lat: 57.6162, lng: 11.9442 },
  { name: "Härryda", lat: 57.6831, lng: 12.3164 }
];

// Rich Local Geocoding Table
export const GEOMAP: Record<string, { lat: number; lng: number }> = {
  "angered": { lat: 57.7958, lng: 12.0432 },
  "angereds torg": { lat: 57.7951, lng: 12.0428 },
  "bergsjön": { lat: 57.7479, lng: 12.0592 },
  "gärdsås": { lat: 57.7562, lng: 12.0487 },
  "kortedala": { lat: 57.7506, lng: 12.0335 },
  "kortedala torg": { lat: 57.7512, lng: 12.0322 },
  "gamlestaden": { lat: 57.7332, lng: 12.0084 },
  "gamlestads torg": { lat: 57.7328, lng: 12.0075 },
  "hisingen": { lat: 57.7311, lng: 11.9332 },
  "biskopsgården": { lat: 57.7281, lng: 11.8955 },
  "vårväderstorget": { lat: 57.7265, lng: 11.8931 },
  "lundby": { lat: 57.7172, lng: 11.9381 },
  "partille": { lat: 57.7402, lng: 12.1002 },
  "örgryte": { lat: 57.7024, lng: 12.0121 },
  "johanneberg": { lat: 57.6901, lng: 11.9805 },
  "majorna": { lat: 57.6914, lng: 11.9213 },
  "mariaplan": { lat: 57.6905, lng: 11.9198 },
  "mölndal": { lat: 57.6583, lng: 12.0132 },
  "frölunda": { lat: 57.6521, lng: 11.9105 },
  "frölunda torg": { lat: 57.6532, lng: 11.9112 },
  "torslanda": { lat: 57.7241, lng: 11.7802 },
  "askim": { lat: 57.6162, lng: 11.9442 },
  "härryda": { lat: 57.6831, lng: 12.3164 },
  "brunnsparken": { lat: 57.7068, lng: 11.9685 },
  "avenyn": { lat: 57.7005, lng: 11.9742 },
  "centralstationen": { lat: 57.7086, lng: 11.9731 }
};

// Approved Senders List
export const APPROVED_SENDERS = [
  "biskop@goteseb.se",
  "biskopsradet@goteseb.se",
  "biskop.goteborg@gmail.com",
  "aldstekvorumet@goteseb.se",
  "eq.goteborg@gmail.com",
  "hjalpforeningen@goteseb.se",
  "rs.goteborg@gmail.com",
  "wardmission@goteseb.se",
  "goteborg.missionaries@gmail.com",
  "aldste.smith@gmail.com",
  "syster.karin@gmail.com"
];

export function isApprovedSender(email: string): boolean {
  const cleanEmail = email.toLowerCase().trim();
  return APPROVED_SENDERS.includes(cleanEmail) ||
         cleanEmail.endsWith("@goteseb.se") ||
         cleanEmail.includes("bishop") ||
         cleanEmail.includes("biskop") ||
         cleanEmail.includes("missionary") ||
         cleanEmail.includes("missionar");
}

// Extrahera tid i sekunder till angiven tidpunkt för TTL-beräkning
export function calculateSecondsUntilTime(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    // Standard-TTL på 2 timmar om formatet är ospecifikt
    return 7200;
  }

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  const now = new Date();
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);

  // Om tiden redan passerat idag, antar vi samma tidpunkt imorgon
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  const diffMs = target.getTime() - now.getTime();
  const diffSec = Math.ceil(diffMs / 1000);

  // Returnera mellan 1 minut och 24 timmar
  return Math.max(60, Math.min(86400, diffSec));
}

// Pythagoras Distance for Gothenburg latitude (57.7 deg)
// d^2 = (dx * 0.53)^2 + dy^2
export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dy = lat1 - lat2;
  const dx = lng1 - lng2;
  return Math.sqrt(Math.pow(dx * 0.53, 2) + Math.pow(dy, 2));
}

// Hitta närmaste stöddistrikt
export function findClosestDistrict(lat: number, lng: number): string {
  let closestName = "Göteborg";
  let minDistance = Infinity;
  for (const d of STODDISTRIKT) {
    const dist = getDistance(lat, lng, d.lat, d.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestName = d.name;
    }
  }
  return closestName;
}

export interface CleanedData {
  locationName: string;
  time: string;
  gender: string;
  language: string;
  coords: { lat: number; lng: number };
  cloakedCoords: { lat: number; lng: number };
  resolvedArea: string;
  scrubbedMessage: string;
}

export function parseMissionaryMessage(text: string): CleanedData | null {
  // Regex to match text in brackets [...]
  const bracketRegex = /\[(.*?)\]/g;
  const matches: string[] = [];
  let match;
  while ((match = bracketRegex.exec(text)) !== null) {
    matches.push(match[1].trim());
  }

  // Fallback if formatting is completely wrong (zero brackets)
  if (matches.length === 0) {
    return null;
  }

  // Parse fields
  const locationName = matches[0] || "Göteborg";
  const time = matches[1] || "Ospecificerad tid";
  const gender = matches[2] || "Kategori ej angiven";
  const language = matches[3] || "Svenska";

  // Geocode location
  const cleanKey = locationName.toLowerCase();
  let coords = { lat: 57.7088, lng: 11.9745 }; // Default Gothenburg center
  if (GEOMAP[cleanKey]) {
    coords = GEOMAP[cleanKey];
  } else {
    // Try substring matching
    const foundKey = Object.keys(GEOMAP).find(key => cleanKey.includes(key) || key.includes(cleanKey));
    if (foundKey) {
      coords = GEOMAP[foundKey];
    } else {
      // If absolutely not found, see if we can locate closest district by name
      const matchingDistrict = STODDISTRIKT.find(d => cleanKey.includes(d.name.toLowerCase()));
      if (matchingDistrict) {
        coords = { lat: matchingDistrict.lat, lng: matchingDistrict.lng };
      }
    }
  }

  // Spatial Cloaking Formula
  const cloakedCoords = {
    lat: Math.round(coords.lat / 0.02) * 0.02,
    lng: Math.round(coords.lng / 0.02) * 0.02
  };

  // Resolve support area
  const resolvedArea = findClosestDistrict(coords.lat, coords.lng);

  // Formulate cleaned display message with brackets ONLY
  const scrubbedMessage = `Plats: [${locationName}], Tid: [${time}], Behov: [${gender}], Språk: [${language}]`;

  return {
    locationName,
    time,
    gender,
    language,
    coords,
    cloakedCoords,
    resolvedArea,
    scrubbedMessage
  };
}

export function getCoordsForArea(area: string) {
  const cleanKey = area.toLowerCase();
  let coords = { lat: 57.7088, lng: 11.9745 };
  if (GEOMAP[cleanKey]) {
    coords = GEOMAP[cleanKey];
  } else {
    const foundKey = Object.keys(GEOMAP).find(key => cleanKey.includes(key) || key.includes(cleanKey));
    if (foundKey) {
      coords = GEOMAP[foundKey];
    } else {
      const matchingDistrict = STODDISTRIKT.find(d => cleanKey.includes(d.name.toLowerCase()));
      if (matchingDistrict) {
        coords = { lat: matchingDistrict.lat, lng: matchingDistrict.lng };
      }
    }
  }

  const cloakedCoords = {
    lat: Math.round(coords.lat / 0.02) * 0.02,
    lng: Math.round(coords.lng / 0.02) * 0.02
  };

  return { coords, cloakedCoords };
}

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn("GEMINI_API_KEY environment variable is not defined. Using local fallback wash.");
    return null;
  }
  aiClient = new GoogleGenAI({ apiKey: key });
  return aiClient;
}

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

export function washAnnouncementText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\([^)]*\)/g, "")
    .replace(/\[\.\?\]/g, "")
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join("\n");
}

export async function runGeminiWash(text: string): Promise<GeminiWashResult> {
  const cleanText = washAnnouncementText(text);
  const ai = getAi();
  if (!ai) {
    return runFallbackWash(cleanText);
  }

  const prompt = `Du är en intelligent AI-rådgivare och extraherare för en digital anslagstavla (Ge stöd till missionärerna).
Du ska analysera en inbjudan (fritext) skriven av en medlem eller ledare i kyrkan och extrahera strukturerad metadata, samt ge varma råd och tips på svenska.

VIKTIGT: Du får ALDRIG ändra eller skriva om användarens personliga text.

Här är reglerna för extrahering:
1. Kategori (category): Bestäm om inbjudan handlar om:
   - "Vara en vän" (t.ex. middag, fika, lunch, umgänge, bjuda hem)
   - "Få näring av Guds ord" (t.ex. undervisning, lektioner, samtalsstöd, träffa personer som missionärerna undervisar)
   - "Hjälpa andra" (t.ex. flytthjälp, städning, trädgårdsarbete)

2. Område (area): Matcha mot följande 15 tillåtna stöddistrikt i Göteborg:
   "Angered", "Kortedala", "Gamlestaden", "Hisingen", "Biskopsgården", "Lundby", "Partille", "Örgryte", "Johanneberg", "Majorna", "Mölndal", "Frölunda", "Torslanda", "Askim", "Härryda".
   Om något av dessa områden nämns i texten (skiftlägesokänsligt), returnera dess exakta namn (t.ex. "Kortedala"). Annars returnera null.

3. Tid (time): Extrahera tidpunkten om den nämns (t.ex. "18:00" eller "kl 19.30"). Konvertera till formatet "HH:MM". Om ingen tid nämns, returnera null.

4. Målgrupp (audience): Får ENDAST vara "Alla" eller "Enbart missionärerna".
   - Om texten nämner att inbjudan endast är för heltidsmissionärerna (t.ex. "för äldsterna", "systrarna", "missionärerna", "heltidsmissionärerna"), sätt till "Enbart missionärerna".
   - Annars, defaulta till "Alla".
   - Om texten nämner någon annan specifik målgrupp (t.ex. "bara för unga män", "hjälpföreningen", "biskopsrådet"), sätt "audienceWarning" till true, men behåll "audience" som "Alla" (eller "Enbart missionärerna" om det gäller dem).

5. Avsändande Organisation (organization): Matcha mot följande tillåtna lista:
   "Enskild/Familj", "Missionärerna", "Församlingsmissionen", "Biskopsrådet", "Äldstekvorumet", "Hjälpföreningen", "Unga Män (UM)", "Unga Kvinnor (UK)", "Primär", "Söndagsskolan", "Aktivitetskommittén", "Unga vuxna (UV)", "Ensamstående vuxna (EV)", "Institutet", "Seminariet", "Staven".
   Om en organisation nämns eller antyds (t.ex. "biskopen bjuder in" -> "Biskopsrådet", "äldsterna bjuder" -> "Missionärerna"), välj det matchande alternativet.
   Om inget nämns eller om det är en vanlig medlem/familj som bjuder in, defaulta till "Enskild/Familj".

6. Specifik plats (locationName): Om en specifik mötesplats eller adress nämns (t.ex. "kapellet i Västra Frölunda", "Mariaplan", "hemma hos oss"), extrahera den. Om ingen specifik plats nämns, defaulta till "Kapellet".

7. Språk (language): Vilka språk som talas eller tolkas (t.ex. "Svenska", "Engelska", "Spanska"). Om inget nämns, returnera null.

Här är reglerna för feedback (aiFeedback) och varningar:
- Geografisk blockering (missingAreaForTeaching):
  Om inbjudan handlar om att missionärerna ska undervisa någon (lektion, träffa en intresserad/undersökare) OCH inget av de 15 stöddistrikten (områdena) ovan nämns i texten, MÅSTE du sätta "missingAreaForTeaching" till true och i "aiFeedback" skriva exakt:
  "För att rätt lokala stödsyskon ska nås måste du ange vilket område personen bor i."
  (Om inlägget INTE handlar om att undervisa någon, eller om ett område är angett, ska "missingAreaForTeaching" vara false).

- Tips och råd i "aiFeedback":
  Du ska bygga en sammanhängande, varm, välkomnande och rådgivande text på svenska (aiFeedback).
  - Om "missingAreaForTeaching" är true, måste feedbacken börja med varningsmeddelandet ovan.
  - Om inget språk nämns (language är null), lägg till ett vänligt tips: "Tips: Nämn gärna vilka språk som talas/tolkas så att fler kan delta."
  - Om inbjudan handlar om att undervisa någon, besöka eller ha en lektion, lägg till ett tips: "Tips: Överväg att skriva att stödsyskon kan ringa in via video på 5 minuter – perfekt för nya bekantskaper som kanske inte dyker upp."
  - Om allt är perfekt, ge en varm uppmuntran!

Texten som ska analyseras är:
"""
${text}
"""

Returnera ett JSON-objekt som matchar följande TypeScript-gränssnitt:
{
  "originalText": string,
  "extractedMetadata": {
    "category": "Vara en vän" | "Få näring av Guds ord" | "Hjälpa andra",
    "area": string | null,
    "time": string | null,
    "audience": "Alla" | "Enbart missionärerna",
    "organization": string,
    "locationName": string,
    "language": string | null
  },
  "aiFeedback": string,
  "warnings": {
    "missingAreaForTeaching": boolean,
    "audienceWarning": boolean
  }
}
Returnera ENDAST JSON-objektet. Inga förklarande texter runt omkring.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini.");
    }

    const data = JSON.parse(responseText.trim()) as GeminiWashResult;
    data.originalText = text;
    return data;
  } catch (err) {
    console.error("Gemini call failed, using fallback:", err);
    return runFallbackWash(text);
  }
}

export function runFallbackWash(text: string): GeminiWashResult {
  const lowerText = text.toLowerCase();

  // 1. Category
  let category: "Vara en vän" | "Få näring av Guds ord" | "Hjälpa andra" = "Vara en vän";
  if (lowerText.includes("lektion") || lowerText.includes("undervisa") || lowerText.includes("samtal") || lowerText.includes("intresserad") || lowerText.includes("undersökare") || lowerText.includes("träffa")) {
    category = "Få näring av Guds ord";
  } else if (lowerText.includes("städa") || lowerText.includes("flytta") || lowerText.includes("bära") || lowerText.includes("hjälpa") || lowerText.includes("tjänande")) {
    category = "Hjälpa andra";
  }

  // 2. Area
  let area: string | null = null;
  const foundDistrict = STODDISTRIKT.find(d => lowerText.includes(d.name.toLowerCase()));
  if (foundDistrict) {
    area = foundDistrict.name;
  }

  // 3. Time
  let time: string | null = null;
  const timeMatch = text.match(/\b\d{1,2}[:.]\d{2}\b/);
  if (timeMatch) {
    time = timeMatch[0].replace(".", ":");
  }

  // 4. Audience
  let audience: "Alla" | "Enbart missionärerna" = "Alla";
  if (lowerText.includes("äldsterna") || lowerText.includes("systrarna") || lowerText.includes("enbart missionärerna") || lowerText.includes("bara missionärerna")) {
    audience = "Enbart missionärerna";
  }

  let audienceWarning = false;
  if (lowerText.includes("unga män") || lowerText.includes("unga kvinnor") || lowerText.includes("primär") || lowerText.includes("hjälpforeningen") || lowerText.includes("hjälpföreningen")) {
    audienceWarning = true;
  }

  // 5. Organization
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

  // 6. LocationName
  let locationName = "Kapellet";
  if (lowerText.includes("hemma hos") || lowerText.includes("hos oss") || lowerText.includes("vårt hem")) {
    locationName = "Medlemmens hem";
  } else {
    const locMatch = text.match(/plats:\s*([^,.\n]+)/i);
    if (locMatch) {
      locationName = locMatch[1].trim();
    }
  }

  // 7. Language
  let language: string | null = null;
  if (lowerText.includes("svenska")) language = "Svenska";
  else if (lowerText.includes("engelska") || lowerText.includes("english")) language = "Engelska";
  else if (lowerText.includes("spanska")) language = "Spanska";

  // missingAreaForTeaching
  const isTeaching = lowerText.includes("undervisa") || lowerText.includes("lektion") || lowerText.includes("träffa en intresserad") || lowerText.includes("undersökare");
  const missingAreaForTeaching = isTeaching && !area;

  // Build feedback
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

// Local robust runAiWash that wraps runGeminiWash for backwards compatibility
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
