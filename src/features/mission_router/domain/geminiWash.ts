import { GoogleGenAI } from "@google/genai";
import { GeminiWashResult, runFallbackWash } from "./fallbackWash";

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
