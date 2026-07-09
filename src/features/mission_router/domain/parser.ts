// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]
import { GoogleGenAI, Type } from "@google/genai";

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

// Lazy Gemini Client initialization
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}

// Output schema for AI wash
const geminiOutputSchema = {
  type: Type.OBJECT,
  properties: {
    scrubbedText: {
      type: Type.STRING,
      description: "Den offentliga texten helt tvättad från efternamn, exakta adresser och råa kontaktuppgifter."
    },
    responsibleParty: {
      type: Type.STRING,
      description: "Förnamn och titel på den ansvariga personen (t.ex. 'Syster Karin', 'Äldste Smith'). Sätt standard till avsändarens roll om ingen nämns."
    },
    contactType: {
      type: Type.STRING,
      description: "Sätt till 'whatsapp', 'sms' eller 'email'."
    },
    contactValue: {
      type: Type.STRING,
      description: "E-post eller telefonnummer för direkt, dold kontakt."
    },
    area: {
      type: Type.STRING,
      description: "Ett av de fastställda stöddistrikten i Göteborg som matchar platsen bäst."
    },
    time: {
      type: Type.STRING,
      description: "Eventuell tidpunkt som nämns, t.ex. '18:00'."
    },
    locationName: {
      type: Type.STRING,
      description: "Område eller mötesplats utan husnummer (t.ex. 'Kortedala Torg')."
    },
    type: {
      type: Type.STRING,
      description: "Sätt till 'missionary_alert' eller 'leader_announcement'."
    },
    expiryDays: {
      type: Type.INTEGER,
      description: "Antal dagar som detta meddelande ska leva i strömmen (standard 7 dagar om ospecifikt)."
    }
  },
  required: ["scrubbedText", "responsibleParty", "contactType", "contactValue", "area", "type", "expiryDays"]
};

// AI-wash pipeline using Gemini API on server-side
export async function runAiWash(rawText: string, senderInfo: { role: string; contact: string; originalType?: "missionary_alert" | "leader_announcement" }): Promise<any> {
  const ai = getAiClient();
  
  const systemInstruction = `
Du är en strikt och integritetsfokuserad AI-assistent utvecklad för kyrkans församlingsstöd "Ge stöd".
Din uppgift är att tvätta (tvätta bort känslig information) och strukturera inkommande meddelanden från antingen unga missionärer på fältet eller församlingsledare, i enlighet med Allmänna handboken 33.8 (GDPR, personlig integritet).

REGLER FÖR INTEGRITETSTVÄTT (MANDATORISKT):
1. Ta bort ALLA efternamn helt. Behåll endast förnamn och titlar (t.ex. "Syster Karin", "Äldste Smith", "Bror Johan").
2. Ta bort ALLA exakta hemadresser (t.ex. gatunamn, husnummer, lägenhetsnummer). Ersätt dem med det allmänna områdesnamnet (t.ex. "Kortedala" eller "Hisingen").
3. Ta bort ALLA råa telefonnummer och e-postadresser från den offentliga texten ('scrubbedText'). De ska ALDRIG synas där!
4. Spara förnamn och titel för den som bär ansvaret i fältet 'responsibleParty'. Om ingen namnges, sätt avsändarens roll/titel (t.ex. "Hjälpföreningens presidentskap" eller "Biskopsrådet").
5. Extrahera dolda kontaktuppgifter (telefonnummer eller mailadress) till fälten 'contactType' ('sms', 'email', 'whatsapp') och 'contactValue'.

REGLER FÖR STRUKTURERING:
Bestäm om meddelandet är ett akut missionärslarm ('missionary_alert') eller en allmän ledarpålysning ('leader_announcement'):
- 'missionary_alert' (akut): Handlar om att unga missionärer ska på ett möte (ofta med en undersökare) och behöver en medlem som följer med som stöd (t.ex. "Vi behöver en bror på Kortedala Torg kl 18:00").
- 'leader_announcement' (pålysning): Information från ledare om aktiviteter, förberedelser, städdagar, möten, etc. (t.ex. "Hjälpföreningen bjuder in till pysselkväll på tisdag kl 19:00").

Du måste matcha platsen mot ett av följande fastställda stöddistrikt i Göteborg:
[Angered, Kortedala, Gamlestaden, Hisingen, Biskopsgården, Lundby, Partille, Örgryte, Johanneberg, Majorna, Mölndal, Frölunda, Torslanda, Askim, Härryda].

Svara i strikt JSON-format enligt det angivna schemat.
`;

  const prompt = `
Indata råtext: "${rawText}"
Avsändarens standardroll: "${senderInfo.role}"
Avsändarens standardkontakt: "${senderInfo.contact}"
${senderInfo.originalType ? `Önskad typ (tvingande): "${senderInfo.originalType}"` : ""}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: geminiOutputSchema
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini.");
    }

    const parsedJson = JSON.parse(resultText.trim());

    // Fallbacks if AI fails or omits values
    if (!parsedJson.responsibleParty || parsedJson.responsibleParty === "") {
      parsedJson.responsibleParty = senderInfo.role;
    }
    if (!parsedJson.contactValue || parsedJson.contactValue === "") {
      parsedJson.contactValue = senderInfo.contact;
    }
    if (!parsedJson.area || parsedJson.area === "") {
      parsedJson.area = "Kortedala";
    }

    // Geocode the extracted location name
    const locationName = parsedJson.locationName || parsedJson.area;
    const cleanKey = locationName.toLowerCase();
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

    return {
      ...parsedJson,
      locationName,
      coords,
      cloakedCoords,
      resolvedArea: parsedJson.area
    };

  } catch (err) {
    console.error("Gemini AI Wash failed, falling back to manual parsing:", err);
    // Safe fallback to manual bracket parsing if AI fails
    const manualCleaned = parseMissionaryMessage(rawText);
    if (manualCleaned) {
      return {
        scrubbedText: manualCleaned.scrubbedMessage,
        responsibleParty: senderInfo.role,
        contactType: senderInfo.originalType === "leader_announcement" ? "email" : "whatsapp",
        contactValue: senderInfo.contact,
        area: manualCleaned.resolvedArea,
        time: manualCleaned.time,
        locationName: manualCleaned.locationName,
        coords: manualCleaned.coords,
        cloakedCoords: manualCleaned.cloakedCoords,
        type: senderInfo.originalType || "missionary_alert",
        expiryDays: 7,
        resolvedArea: manualCleaned.resolvedArea
      };
    } else {
      // Complete minimal placeholder fallback so server doesn't crash
      return {
        scrubbedText: rawText.replace(/[A-ZÅÄÖ][a-zåäö]+/g, "[TVÄTTAT]").substring(0, 150),
        responsibleParty: senderInfo.role,
        contactType: senderInfo.originalType === "leader_announcement" ? "email" : "whatsapp",
        contactValue: senderInfo.contact,
        area: "Kortedala",
        time: "Ospecificerad tid",
        locationName: "Göteborg",
        coords: { lat: 57.7088, lng: 11.9745 },
        cloakedCoords: { lat: 57.70, lng: 11.98 },
        type: senderInfo.originalType || "missionary_alert",
        expiryDays: 7,
        resolvedArea: "Kortedala"
      };
    }
  }
}
