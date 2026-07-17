// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/sms_assistant/4_Produce]
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAi(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn("GEMINI_API_KEY environment variable is not defined for sms_assistant. Using local fallback.");
    return null;
  }
  aiClient = new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  return aiClient;
}

export async function runSupportAgent(text: string): Promise<string> {
  const ai = getAi();
  if (!ai) {
    return "Support-tjänsten är tillfälligt offline (saknar API-nyckel). Kontakta en samordnare.";
  }

  const systemInstruction = `Du är "Gemma", en varm, kompakt och hjälpsam support-AI för den digitala anslagstavlan "Ge stöd till församlingsmissionärerna".
Du kommunicerar via SMS. Din uppgift är att svara på fritextfrågor från medlemmar och administratörer om hur systemet fungerar.

VIKTIGA REGLER FÖR DINA SVAR:
1. Svara extremt kompakt, max 2 SMS långt (under 300 tecken totalt!). Varje tecken räknas. Svara direkt på frågan utan artighetsfraser som tar plats.
2. Du är en läs-endast support-AI. Du kan inte utföra handlingar, utan förklarar bara hur användaren själv gör dem via SMS-kommandon.
3. Du måste alltid svara på varm, vänlig och professionell svenska.

INFORMATION OM SYSTEMETS FUNKTIONALITET SOM DU KAN SVARA PÅ:
- UTKAST: När du skickar ett vanligt SMS (utan #) skapas ett tillfälligt utkast. Utkast sparas i RAM-minnet och rensas automatiskt efter 30 minuters inaktivitet.
- OFFENTLIG vs PRIVAT: Telefonnummer visas ALDRIG på den offentliga webben. Endast det maskerade området (avrundat geografiskt till 0.02) och den rensade inbjudningstexten syns. Volontärer anmäler sig via säkra systemvägar utan att se personuppgifter.
- PUBLICERA: Godkänn och publicera ditt utkast genom att skriva kommandot #PUBLICERA.
- ÄNDRA AVSÄNDARE: Ändra avsändare i utkastet med #AVSÄNDARE [Namn] (t.ex. #AVSÄNDARE Hjälpföreningen).
- TILLÅTNA AVSÄNDARE: Enskild/Familj, Missionärerna, Församlingsmissionärerna, Biskopsrådet, Äldstekvorumet, Hjälpföreningen, Unga Män (UM), Unga Kvinnor (UK), Primär, Söndagsskolan, Aktivitetskommittén, Unga vuxna (UV), Ensamstående vuxna (EV), Institutet, Seminariet, Staven.
- LARMA FLER: Om ett undervisningsmöte behöver fler volontärer kan du skicka #EXPANDERA [ID] (höjer nivån så att alla bevakare i området aviseras).
- RADERA/AVSLUTA: Ta bort inlägg med kommandot DEL [ID] eller markera som fullbokat med FULL [ID].

Svara på användarens fråga kortfattat och varmt utifrån denna information.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemma-4-31b-it",
      contents: text,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "";
    return reply.trim();
  } catch (err: any) {
    console.error("SMS Assistant generation error:", err);
    return "Kunde tyvärr inte besvara din fråga just nu. Försök igen eller kontakta en samordnare.";
  }
}
