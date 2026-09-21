// [src/server/missionaryChatEngine.ts] - Interactive SMS Chat Engine for Missionaries & Contributors
import { activeAlerts, getNextFreeId, saveActiveAlerts, normalizePhone } from "./storage";
import { getCoordsForArea, calculateSecondsUntilTime, washAnnouncementText } from "../main/services/parser";
import { addSimLog, triggerPushAlert } from "../main/services/pushService";
import { ActiveAlert } from "../shared/types";
import { MAP_DISTRICTS } from "../shared/geo/mapData";

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

const KNOWN_AREAS = [
  "Angered", "Hjällbo", "Kortedala", "Bellevue", "Bergsjön", "Gärdsås", "Utby",
  "Partille", "Sävedalen", "Furulund", "Kungälv", "Tjörn", "Stenungsund",
  "Gråbo", "Olofstorp", "Hisingen", "Kålltorp", "Olskroken", "Bagaregården",
  "Landvetter", "Härryda", "Majorna", "Linné", "Centrum", "Mölndal", "Askim",
  "Torslanda", "Lundby", "Backa", "Tuve", "Gamlestaden"
];

export function mergeDraftContext(existingDraft: MissionarySession["draft"], incomingText: string): MissionarySession["draft"] {
  const nextDraft: MissionarySession["draft"] = { ...existingDraft };
  const trimmed = incomingText.trim();
  const lower = trimmed.toLowerCase();

  const timeMatch = trimmed.match(/(?:\bkl\s*(\d{1,2}(?::\d{2})?)|\b(\d{1,2}[:.]\d{2})\b)/i);
  if (timeMatch) nextDraft.time = timeMatch[0];

  for (const areaName of KNOWN_AREAS) {
    if (new RegExp(`\\b${areaName}\\b`, "i").test(trimmed)) {
      nextDraft.area = areaName;
      break;
    }
  }
  if (!nextDraft.area) {
    for (const d of MAP_DISTRICTS) {
      if (lower.includes(d.name.toLowerCase())) {
        nextDraft.area = d.name;
        break;
      }
    }
  }

  const locMatch = trimmed.match(/(?:(?:vi\s+)?ses\s+(?:vid|på|hos)|plats(?:\s*:\s*|\s+)|mötesplats(?:\s*:\s*|\s+)|hemma\s+hos\s+)([^\n.,;]+)/i);
  if (locMatch && locMatch[1]?.trim().length > 2) nextDraft.locationName = locMatch[1].trim();

  if (/(?:äldsterna|elders)/i.test(lower)) nextDraft.organization = "Äldsterna";
  else if (/(?:systrarna|sisters)/i.test(lower)) nextDraft.organization = "Systrarna";
  else if (/(?:hjälpföreningen|hf)/i.test(lower)) nextDraft.organization = "Hjälpföreningen";
  else if (/(?:unga\s+vuxna|uv)/i.test(lower)) nextDraft.organization = "Unga Vuxna";
  else if (!nextDraft.organization) nextDraft.organization = "Missionärerna";

  const cleanText = trimmed.replace(/^[#\.]+/g, "").trim();
  const isOnlyTime = /^(?:kl\s*\d{1,2}(?::\d{2})?|\d{1,2}[:.]\d{2})$/i.test(cleanText);
  const isOnlyArea = /^(?:i|på|vid|omkring)?\s*(?:[A-ZÅÄÖa-zåäö\s]+)$/i.test(cleanText) && KNOWN_AREAS.some(a => cleanText.toLowerCase().replace(/^(?:i|på|vid)\s+/i, "").trim() === a.toLowerCase());
  const isOnlyMeetingPlace = /^(?:(?:vi\s+)?ses\s+(?:vid|på|hos)|plats(?:\s*:\s*|\s+)|mötesplats(?:\s*:\s*|\s+)|hemma\s+hos\s+)/i.test(cleanText);

  if (isOnlyTime || isOnlyArea || isOnlyMeetingPlace) {
    if (!nextDraft.activity && cleanText.length > 3 && !isOnlyTime) nextDraft.activity = cleanText;
  } else {
    let candidate = cleanText;
    if (nextDraft.area) candidate = candidate.replace(new RegExp(`\\b(?:i|på|vid)\\s+${nextDraft.area}\\b`, "gi"), "").trim();
    if (nextDraft.time) candidate = candidate.replace(new RegExp(`\\b${nextDraft.time}\\b`, "gi"), "").trim();
    candidate = candidate.replace(/\s{2,}/g, " ").trim();
    if (candidate.length >= 3) nextDraft.activity = candidate;
    else if (!nextDraft.activity && cleanText.length >= 3) nextDraft.activity = cleanText;
  }
  return nextDraft;
}

export function formatCurrentDraft(draft: MissionarySession["draft"]): string {
  return [
    "Inbjudan hittills:",
    `Aktivitet: ${draft.activity || "Ej angiven"}`,
    `Tid: ${draft.time || "Ej angiven"}`,
    `Område: ${draft.area || "Hela församlingen"}`,
    `Mötesplats: ${draft.locationName || draft.area || "Ej angiven"}`,
    `Arrangör: ${draft.organization || "Missionärerna"}`
  ].join("\n");
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
    return null;
  }
}

export async function handleMissionaryChat(sender: string, text: string): Promise<{ handled: boolean; replyMessage?: string }> {
  const normSender = normalizePhone(sender);
  const trimmed = text.trim();
  const session = missionarySessions.get(normSender);

  if (!session) {
    if (trimmed.startsWith("#") || trimmed.startsWith(".")) {
      const initialContent = trimmed.replace(/^[#\.]+/g, "").trim();
      const initialDraft = mergeDraftContext({ organization: "Missionärerna", audience: "Alla", category: "Få näring av Guds ord" }, initialContent);
      missionarySessions.set(normSender, {
        sender: normSender,
        step: "AWAITING_CONSENT",
        consentGiven: false,
        messages: [{ role: "user", text: trimmed }],
        draft: initialDraft,
        lastActive: Date.now()
      });
      addSimLog("system", `SMS CHATT: ${sender} startade dialog med ${trimmed[0]}. Frågar om integritet.`);
      return { handled: true, replyMessage: `Välkommen! För att skydda allas integritet: Bekräftar du att du inte delar andras personuppgifter (namn, telefon etc) utan deras medgivande?\n\nSvara #ja för att godkänna och fortsätta.` };
    }
    return { handled: false };
  }

  session.lastActive = Date.now();

  if (session.step === "AWAITING_CONSENT") {
    if (/^[\.#]?(ja|godkänn|godkänner|ok|okej|absolut|stämmer)$/i.test(trimmed)) {
      session.consentGiven = true;
      session.step = "COLLECTING_DETAILS";
      if (session.draft.activity || session.draft.area || session.draft.time) {
        addSimLog("system", `SMS CHATT: ${sender} godkände integritet. Bearbetar tidigare angiven aktivitet.`);
      } else {
        addSimLog("system", `SMS CHATT: ${sender} godkände integritet. Övergår till informationsinsamling.`);
        return { handled: true, replyMessage: `Tack! Integritetsvillkoren är godkända.\n\nVad vill ni bjuda in till? Berätta gärna vad ni ska göra, vilken tid och var ni ska ses (eller om det gäller hela församlingen).\n\nInbjudan hittills: (ännu tom)` };
      }
    } else if (/^[\.#]?(nej|avbryt|stopp)$/i.test(trimmed)) {
      missionarySessions.delete(normSender);
      addSimLog("system", `SMS CHATT: ${sender} avböjde eller avbröt.`);
      return { handled: true, replyMessage: `Dialogen avslutades. Skicka # eller . när du vill starta på nytt.` };
    } else {
      return { handled: true, replyMessage: `För att skydda allas personuppgifter behöver du först bekräfta integritetsvillkoren. Svara #ja för att fortsätta eller #avbryt.` };
    }
  }

  if (/^[\.#]?avbryt$/i.test(trimmed)) {
    missionarySessions.delete(normSender);
    addSimLog("system", `SMS CHATT: ${sender} avbröt dialogen.`);
    return { handled: true, replyMessage: `Inbjudningsdialogen avbröts. Skriv # eller . när du vill börja om.` };
  }

  if (session.step === "AWAITING_PUBLISH_CONFIRM" || /^[\.#]?(publicera)$/i.test(trimmed)) {
    if (/^[\.#]?(publicera|ja|klar)$/i.test(trimmed)) {
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
        area: area || "",
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
        status: "active"
      };

      activeAlerts[id] = newAlert;
      saveActiveAlerts();
      missionarySessions.delete(normSender);
      await triggerPushAlert(newAlert);
      addSimLog("system", `SMS CHATT: Inbjudan #${id} publicerad direkt av missionär ${sender}!`);
      return { handled: true, replyMessage: `Klart! Din inbjudan (nr ${id}) är nu publicerad i anslagsflödet för hela församlingen! Tack för ert arbete.` };
    }
  }

  session.messages.push({ role: "user", text: trimmed });
  session.draft = mergeDraftContext(session.draft, trimmed);
  session.step = "AWAITING_PUBLISH_CONFIRM";

  const ai = await getAiClient();
  if (ai && typeof ai === "object" && "models" in ai) {
    try {
      const instruction = `Du är samordningsassistent via SMS för kyrkans missionärer och medlemmar i Göteborg.\nNuvarande utkast:\n- Aktivitet: ${session.draft.activity || "ej angiven"}\n- Tid: ${session.draft.time || "ej angiven"}\n- Område: ${session.draft.area || "Hela församlingen"}\n- Mötesplats: ${session.draft.locationName || "ej angiven"}\n- Arrangör: ${session.draft.organization || "Missionärerna"}\n\n1. Svara kort och varmt (1-2 meningar).\n2. Avsluta ALLTID med:\n${formatCurrentDraft(session.draft)}\n\nSvara #publicera för att lägga ut den direkt, eller skriv vad du vill ändra.`;
      const aiTyped = ai as { models: { generateContent: (opts: { model: string; contents: unknown[] }) => Promise<{ text?: string }> } };
      const response = await aiTyped.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [{ role: "user", parts: [{ text: `${instruction}\n\nMeddelande: "${trimmed}"` }] }]
      });
      const replyText = response.text || "";
      session.messages.push({ role: "assistant", text: replyText });
      return { handled: true, replyMessage: replyText };
    } catch (err) {
      console.error("AI Missionary Chat error:", err);
    }
  }

  const preview = `Tack! Jag har uppdaterat inbjudan.\n\n${formatCurrentDraft(session.draft)}\n\nSvara #publicera för att lägga ut den direkt, eller skriv vad du vill ändra.`;
  session.messages.push({ role: "assistant", text: preview });
  return { handled: true, replyMessage: preview };
}
