// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

// 15 Fasta Stöddistrikt i Göteborg (Geografiskt sorterat Norr -> Söder)
export const STODDISTRIKT = [
  { name: "Angered", lat: 57.7958, lng: 12.0432 },
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

// Local robust runAiWash that replaces Gemini logic completely
export async function runAiWash(
  rawText: string, 
  senderInfo: { role: string; contact: string; originalType?: "missionary_alert" | "leader_invitation" }
): Promise<any> {
  const bracketRegex = /\[(.*?)\]/g;
  const matches: string[] = [];
  let match;
  while ((match = bracketRegex.exec(rawText)) !== null) {
    matches.push(match[1].trim());
  }

  let area = "Kortedala";
  let time = "Ospecificerad tid";
  let category = "Måltid & Gemenskap";
  let scrubbedText = rawText;
  let responsibleParty = senderInfo.role;
  let contactValue = senderInfo.contact;

  if (matches.length >= 4) {
    // If we have at least 4 matches, assume structured SMS format:
    // [Area] [Time] [Category] [Text] [Arrangör/Responsible] [Contact]
    area = matches[0] || "Kortedala";
    time = matches[1] || "Ospecificerad tid";
    category = matches[2] || "Måltid & Gemenskap";
    scrubbedText = matches[3] || rawText;
    if (matches[4]) responsibleParty = matches[4];
    if (matches[5]) contactValue = matches[5];
  } else {
    // Unstructured text format fallback:
    // Try to extract area from text if it contains any of the known district names
    const foundDistrict = STODDISTRIKT.find(d => 
      rawText.toLowerCase().includes(d.name.toLowerCase())
    );
    if (foundDistrict) {
      area = foundDistrict.name;
    }

    // Try to extract time (like 18:00 or 19.30)
    const timeMatch = rawText.match(/\b\d{1,2}[:.]\d{2}\b/);
    if (timeMatch) {
      time = timeMatch[0].replace(".", ":");
    }

    // Classify category based on keywords
    const lowerText = rawText.toLowerCase();
    if (lowerText.includes("mat") || lowerText.includes("middag") || lowerText.includes("fika") || lowerText.includes("bjuder") || lowerText.includes("äta")) {
      category = "Måltid & Gemenskap";
    } else if (lowerText.includes("lektion") || lowerText.includes("samtal") || lowerText.includes("undervisa") || lowerText.includes("möte") || lowerText.includes("skriva")) {
      category = "Lektion & Samtal";
    } else if (lowerText.includes("städa") || lowerText.includes("flytta") || lowerText.includes("bära") || lowerText.includes("hjälpa") || lowerText.includes("tjänande") || lowerText.includes("städdag") || lowerText.includes("hjälp")) {
      category = "Tjänande";
    } else {
      category = "Måltid & Gemenskap";
    }

    // Scrub phone numbers and email addresses from public display text, BUT keep URLs
    let processedText = rawText;
    
    const urls: string[] = [];
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
    processedText = processedText.replace(urlRegex, (url) => {
      urls.push(url);
      return `__URL_PLACEHOLDER_${urls.length - 1}__`;
    });

    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
    processedText = processedText.replace(emailRegex, "[E-POST TVÄTTAD]");

    const phoneRegex = /\b(?:\+?\d{1,3}[- ]?)?\d{2,4}[- ]?\d{2,3}[- ]?\d{2,4}\b/g;
    processedText = processedText.replace(phoneRegex, (phone) => {
      const cleanPhone = phone.replace(/[- ]/g, "");
      if (cleanPhone.length >= 8 && cleanPhone.length <= 15) {
        return "[TELEFON TVÄTTAD]";
      }
      return phone;
    });

    processedText = processedText.replace(/__URL_PLACEHOLDER_(\d+)__/g, (m, index) => {
      return urls[parseInt(index, 10)];
    });

    scrubbedText = processedText;
  }

  // Resolve geocoding
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

  const resolvedArea = findClosestDistrict(coords.lat, coords.lng);

  return {
    scrubbedText,
    responsibleParty,
    contactType: "sms" as const,
    contactValue,
    area: resolvedArea,
    time,
    locationName: area,
    category,
    coords,
    cloakedCoords,
    type: senderInfo.originalType || "leader_invitation"
  };
}
