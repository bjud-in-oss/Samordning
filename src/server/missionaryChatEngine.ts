// [src/server/missionaryChatEngine.ts] - Interactive SMS Chat Engine for Missionaries & Contributors

import { 
  activeAlerts, 
  getNextFreeId, 
  saveActiveAlerts, 
  adminNumbers,
  sendOutboundSms,
  normalizePhone
} from "./storage";
import { 
  getCoordsForArea, 
  calculateSecondsUntilTime, 
  washAnnouncementText 
} from "../main/services/parser";
import { addSimLog, triggerPushAlert } from "../main/services/pushService";
import { ActiveAlert } from "../shared/types";

export interface MissionarySession {
  sender: string;
  step: "AWAITING_CONSENT" | "COLLECTING_DETAILS" | "AWAITING_PUBLISH_CONFIRM";
  consentGiven: boolean;
  messages: Array<{ role: "user" | "assistant"; text: string }>;
  draft: {
    activity?: string;
    time?: string;
    area?: string;
    locationName?: string;
    organization?: string;
    audience?: string;
    category?: string;
  };
  lastActive: number;
}

export const missionarySessions = new Map<string, MissionarySession>();

export function formatCurrentDraft(draft: MissionarySession["draft"]): string {
  const lines = [
    "Inbjudan hittills:",
    `Aktivitet: ${draft.activity || "Ej angiven"}`,
    `Tid: ${draft.time || "Ej angiven"}`,
    `Område: ${draft.area || "Hela församlingen"}`,
    `Mötesplats: ${draft.locationName || draft.area || "Ej angiven"}`,
    `Arrangör: ${draft.organization || "Missionärerna"}`
  ];
  return lines.join("\n");
}

let aiClientInstance: unknown = null;
async function getAiClient(): Promise<unknown> {
  if (aiClientInstance) return aiClientInstance;
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  try {
    const pkg = ["@google", "genai"].join("/");
    const module = await import(pkg);
    aiClientInstance = new module.GoogleGenAI({ apiKey: key });
    return aiClientInstance;
  } catch (err) {
    console.error("Failed to initialize GenAI client:", err);
    return null;
  }
}

/**
 * Handle missionary SMS chat interactions
 */
export async function handleMissionaryChat(sender: string, text: string): Promise<{ handled: boolean; replyMessage?: string }> {
  const normSender = normalizePhone(sender);
  const trimmed = text.trim();
  const session = missionarySessions.get(normSender);

  // 1. Check if user is initiating dialog with # or .
  if (!session) {
    if (trimmed.startsWith("#") || trimmed.startsWith(".")) {
      const initialContent = trimmed.replace(/^[#\.]+/g, "").trim();
      const initialSession: MissionarySession = {
        sender: normSender,
        step: "AWAITING_CONSENT",
        consentGiven: false,
        messages: [{ role: "user", text: trimmed }],
        draft: {
          activity: initialContent || undefined,
          organization: "Missionärerna",
          audience: "Alla",
          category: "Få näring av Guds ord"
        },
        lastActive: Date.now()
      };
      missionarySessions.set(normSender, initialSession);

      const reply = 
        `Välkommen! För att skydda allas integritet: Bekräftar du att du inte delar andras personuppgifter (namn, telefon etc) utan deras medgivande?\n\nSvara #ja för att godkänna och fortsätta.`;
      
      addSimLog("system", `SMS CHATT: ${sender} startade dialog med ${trimmed[0]}. Frågar om integritet.`);
      return { handled: true, replyMessage: reply };
    }

    // Not starting with # or . and no active session -> IGNORE to protect privacy
    return { handled: false };
  }

  // Session exists -> update activity
  session.lastActive = Date.now();

  // 2. Step 1: Awaiting Consent
  if (session.step === "AWAITING_CONSENT") {
    if (/^[\.#]?(ja|godkänn|godkänner|ok|okej|absolut|stämmer)$/i.test(trimmed)) {
      session.consentGiven = true;
      session.step = "COLLECTING_DETAILS";

      if (session.draft.activity) {
        addSimLog("system", `SMS CHATT: ${sender} godkände integritet. Bearbetar tidigare angiven aktivitet.`);
        // Fallthrough to step 2 AI parsing with their saved activity
      } else {
        const reply = 
          `Tack! Integritetsvillkoren är godkända.\n\nVad vill ni bjuda in till? Berätta gärna vad ni ska göra, vilken tid och var ni ska ses (eller om det gäller hela församlingen).\n\nInbjudan hittills: (ännu tom)`;
        addSimLog("system", `SMS CHATT: ${sender} godkände integritet. Övergår till informationsinsamling.`);
        return { handled: true, replyMessage: reply };
      }
    } else if (/^[\.#]?(nej|avbryt|stopp)$/i.test(trimmed)) {
      missionarySessions.delete(normSender);
      addSimLog("system", `SMS CHATT: ${sender} avböjde eller avbröt.`);
      return { handled: true, replyMessage: `Dialogen avslutades. Skicka # eller . när du vill starta på nytt.` };
    } else {
      return { 
        handled: true, 
        replyMessage: `För att skydda allas personuppgifter behöver du först bekräfta integritetsvillkoren. Svara #ja för att fortsätta eller #avbryt.` 
      };
    }
  }

  // 3. User wants to cancel
  if (/^[\.#]?avbryt$/i.test(trimmed)) {
    missionarySessions.delete(normSender);
    addSimLog("system", `SMS CHATT: ${sender} avbröt dialogen.`);
    return { handled: true, replyMessage: `Inbjudningsdialogen avbröts. Skriv # eller . när du vill börja om.` };
  }

  // 4. Step 3: Awaiting Final Publish Confirm (#publicera, .publicera eller ja/klar)
  if (session.step === "AWAITING_PUBLISH_CONFIRM" || /^[\.#]?(publicera)$/i.test(trimmed)) {
    if (/^[\.#]?(publicera|ja|klar)$/i.test(trimmed)) {
      // Execute Direct Publishing!
      const id = getNextFreeId();
      const area = session.draft.area || "";
      const { coords, cloakedCoords } = area ? getCoordsForArea(area) : { coords: null, cloakedCoords: null };
      const time = session.draft.time || "Ospecificerad tid";
      const offsetSeconds = calculateSecondsUntilTime(time === "Ospecificerad tid" ? "18:00" : time);
      const expiryTimestamp = Date.now() + (offsetSeconds + 2 * 3600) * 1000;
      const scrubbed = washAnnouncementText(session.draft.activity || "Inbjudan");

      const newAlert: ActiveAlert = {
        id,
        type: "leader_invitation",
        rawText: scrubbed,
        scrubbedText: scrubbed,
        area: area || "", // Empty area means whole congregation!
        time,
        gender: (session.draft.audience as ActiveAlert["gender"]) || "Alla",
        language: "Svenska",
        locationName: session.draft.locationName || area || "",
        coords,
        cloakedCoords,
        timestamp: Date.now(),
        responsibleParty: session.draft.organization || "Missionärerna",
        contactType: "sms",
        contactValue: sender,
        expiryTimestamp,
        category: (session.draft.category as ActiveAlert["category"]) || "Få näring av Guds ord",
        isFull: false,
        status: "active" // Directly published!
      };

      activeAlerts[id] = newAlert;
      saveActiveAlerts();
      missionarySessions.delete(normSender);

      await triggerPushAlert(newAlert);
      addSimLog("system", `SMS CHATT: Inbjudan #${id} publicerad direkt av missionär ${sender}!`);

      const confirmMsg = `Klart! Din inbjudan (nr ${id}) är nu publicerad i anslagsflödet för hela församlingen! Tack för ert arbete.`;
      return { handled: true, replyMessage: confirmMsg };
    }
  }

  // 5. Step 2 or 3 Adjustment: Parse user message with AI to update draft
  session.messages.push({ role: "user", text: trimmed });

  // Quick heuristic parsing for draft fields
  if (/kl|:\d\d/i.test(trimmed)) {
    const timeMatch = trimmed.match(/(\d{1,2}[:.]\d{2}|\bkl\s*\d{1,2}(?::\d{2})?)/i);
    if (timeMatch) session.draft.time = timeMatch[0];
  }
  const cleanActivityText = trimmed.replace(/^[#\.]+/g, "").trim();
  if (!session.draft.activity || cleanActivityText.length > 3) {
    session.draft.activity = cleanActivityText;
  }
  session.step = "AWAITING_PUBLISH_CONFIRM";

  const ai = await getAiClient();
  if (ai && typeof ai === "object" && "models" in ai) {
    try {
      const systemInstruction = `Du är en hjälpsam, varm samordningsassistent via SMS för kyrkans missionärer och medlemmar i Göteborg.
Missionären bygger en inbjudan via SMS.
Nuvarande utkast:
- Aktivitet: ${session.draft.activity || "ej angiven"}
- Tid: ${session.draft.time || "ej angiven"}
- Område: ${session.draft.area || "Ingen ort angiven (gäller hela församlingen)"}
- Mötesplats: ${session.draft.locationName || "ej angiven"}
- Arrangör: ${session.draft.organization || "Missionärerna"}

Instruktioner:
1. Extrahera eventuella nya uppgifter (tid, plats, vad de vill göra) från missionärens senaste meddelande: "${trimmed}".
2. Svara kort och varmt (1-2 korta meningar).
3. Avsluta ALLTID med följande exakta block:
${formatCurrentDraft(session.draft)}

Svara #publicera för att lägga ut den direkt, eller skriv vad du vill ändra.`;

      const aiTyped = ai as { models: { generateContent: (opts: { model: string; contents: unknown[] }) => Promise<{ text?: string }> } };
      const response = await aiTyped.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemInstruction}\n\nMissionärens meddelande: "${trimmed}"` }] }
        ]
      });

      const replyText = response.text || "";
      session.messages.push({ role: "assistant", text: replyText });
      return { handled: true, replyMessage: replyText };
    } catch (err) {
      console.error("AI Missionary Chat error:", err);
    }
  }

  // Fallback if AI not available
  const preview = `Tack! Jag har uppdaterat inbjudan.\n\n${formatCurrentDraft(session.draft)}\n\nSvara #publicera för att lägga ut den direkt, eller skriv vad du vill ändra.`;
  session.messages.push({ role: "assistant", text: preview });
  return { handled: true, replyMessage: preview };
}
