// [src/server/smsRoutes.ts] - SMS Gateway & Commands Handler

import { Request, Response } from "express";
import { 
  activeAlerts, 
  adminNumbers, 
  trustedNumbers, 
  smsDrafts, 
  API_SECRET, 
  normalizePhone, 
  pairDeviceToken, 
  saveActiveAlerts, 
  getNextFreeId, 
  sendOutboundSms,
  SmsDraft
} from "./storage";
import { 
  addSimLog, 
  triggerPushAlert 
} from "../main/services/pushService";
import { 
  getCoordsForArea, 
  calculateSecondsUntilTime, 
  washAnnouncementText, 
  runGeminiWash 
} from "../main/services/parser";
import { ActiveAlert } from "../shared/types";
import { handleSmsCommand } from "./smsCommands";
import { handleMissionaryChat, missionarySessions } from "./missionaryChatEngine";

// Deduplicering / Eko-skydd vid själv-SMS (inom 30 sekunder)
interface SmsCacheEntry {
  response: any;
  timestamp: number;
}
const recentSmsCache = new Map<string, SmsCacheEntry>();

export async function handleIncomingSms(req: Request, res: Response) {
  const requestSecret = req.headers["x-api-secret"] || req.body.secret;
  if (requestSecret !== API_SECRET) {
    addSimLog("system", `AVVISAT WEBHOOK-ANROP: Obehörig API-nyckel/secret.`);
    return res.status(401).json({ error: "Unauthorized: Invalid or missing API Webhook Secret." });
  }

  const { sender, text } = req.body;
  if (!sender || !text) {
    return res.status(400).json({ error: "Avsändare och text krävs." });
  }

  let trimmedText = text.trim();
  const dedupKey = `${normalizePhone(sender)}_${trimmedText.toLowerCase()}`;
  const now = Date.now();
  const cached = recentSmsCache.get(dedupKey);

  // Om identiskt SMS inkommit från samma avsändare inom 30s, svara med samma resultat direkt utan ny registrering
  if (cached && now - cached.timestamp < 30000) {
    addSimLog("system", `EKO-FILTER: Dubblett-SMS ignorerad för ${sender} (behandlad som 1 signal).`);
    return res.json(cached.response);
  }

  addSimLog("incoming", `Inkommande SMS från ${sender}: "${trimmedText}"`);

  const isAdmin = adminNumbers.some(num => normalizePhone(num) === normalizePhone(sender));
  const isTrusted = trustedNumbers.some(num => normalizePhone(num) === normalizePhone(sender));
  const isTrustedOrAdmin = isAdmin || isTrusted;

  const pairMatch = trimmedText.match(/^[\.#]PAIR\s*(.*)$/i);
  if (pairMatch) {
    const token = pairMatch[1].trim();
    if (token) {
      pairDeviceToken(token);
      addSimLog("system", `ENHETSPARNING (#PAIR): Enhet ${token.substring(0, 10)}... parats ihop av ${sender}.`);
      const pairResp = { success: true, replyMessage: `Enhet verifierad och parkopplad med systemet!` };
      recentSmsCache.set(dedupKey, { response: pairResp, timestamp: now });
      return res.json(pairResp);
    }
  }

  // 1. If user is in an active missionary chat session, route to the chat engine directly
  const normSender = normalizePhone(sender);
  const hasActiveSession = missionarySessions.has(normSender);
  const isWebb = trimmedText.toUpperCase().startsWith("#WEBB");

  if (hasActiveSession) {
    const chatResult = await handleMissionaryChat(sender, trimmedText);
    if (chatResult.handled) {
      const chatResp = { success: true, replyMessage: chatResult.replyMessage };
      recentSmsCache.set(dedupKey, { response: chatResp, timestamp: now });
      return res.json(chatResp);
    }
  }

  // 2. Handle Admin & System Commands (.ja [id], .nej [id], .status, .mall, .ta bort, etc)
  const cmdResult = await handleSmsCommand(sender, trimmedText, isAdmin, isTrustedOrAdmin);
  if (cmdResult.handled) {
    const resp = cmdResult.response;
    if (resp?.error) {
      return res.status(resp.status || 400).json({ error: resp.error });
    }
    return res.json(resp);
  }

  // 3. Handle Web Form Submissions (#WEBB)
  if (isWebb) {
    const lines = trimmedText.split("\n");
    let category = "Vara en vän";
    let time = "18:00";
    let area = "";
    let locationName = "";
    let organization = "Arrangör";
    let audience = "Alla";
    let rawText = "";

    for (const line of lines) {
      const lower = line.toLowerCase().trim();
      if (lower.startsWith("kategori:")) category = line.substring(line.indexOf(":") + 1).trim() || category;
      else if (lower.startsWith("tid:")) time = line.substring(line.indexOf(":") + 1).trim() || time;
      else if (lower.startsWith("område:") || lower.startsWith("bjud in från områden:")) area = line.substring(line.indexOf(":") + 1).trim();
      else if (lower.startsWith("mötesplats:")) locationName = line.substring(line.indexOf(":") + 1).trim();
      else if (lower.startsWith("avsändare:") || lower.startsWith("arrangör:")) organization = line.substring(line.indexOf(":") + 1).trim() || organization;
      else if (lower.startsWith("målgrupp:")) audience = line.substring(line.indexOf(":") + 1).trim() || audience;
      else if (lower.startsWith("text:") || lower.startsWith("aktivitet:")) rawText = line.substring(line.indexOf(":") + 1).trim();
    }

    if (!rawText) {
      rawText = trimmedText.replace(/^#WEBB/i, "").trim();
    }

    const cleanedText = washAnnouncementText(rawText);
    const id = getNextFreeId();
    const { coords, cloakedCoords } = area ? getCoordsForArea(area) : { coords: null, cloakedCoords: null };
    const offsetSeconds = calculateSecondsUntilTime(time);
    const expiryTimestamp = Date.now() + (offsetSeconds + 2 * 3600) * 1000;
    const isLektionAndSamtal = category === "Läsa skrifterna" && organization === "Missionärerna";
    const status = isTrustedOrAdmin ? "active" : "pending";

    const newAnnouncement: ActiveAlert = {
      id, type: "leader_invitation", rawText: cleanedText, scrubbedText: cleanedText,
      area: area || "", time, gender: audience, language: "Svenska", 
      locationName: locationName || area || "", coords, cloakedCoords,
      timestamp: Date.now(), responsibleParty: organization, contactType: "sms", contactValue: sender,
      expiryTimestamp, category, isFull: false, status, escalationLevel: isLektionAndSamtal ? 1 : undefined
    };

    activeAlerts[id] = newAnnouncement;
    saveActiveAlerts();

    if (status === "pending") {
      const modMsg = `Ny inbjudan ${id} väntar! Svara .ja ${id} eller .nej ${id}`;
      await sendOutboundSms(adminNumbers, modMsg);
      return res.json({ success: true, replyMessage: `Din inbjudan är i väntrummet (nr ${id}). En administratör godkänner strax!` });
    } else {
      await triggerPushAlert(newAnnouncement);
      return res.json({ success: true, replyMessage: `Din inbjudan (nr ${id}) har publicerats!` });
    }
  }

  // 4. If text starts with # or ., initiate Missionary Interactive Chat
  if (trimmedText.startsWith("#") || trimmedText.startsWith(".")) {
    const chatResult = await handleMissionaryChat(sender, trimmedText);
    if (chatResult.handled) {
      const chatResp = { success: true, replyMessage: chatResult.replyMessage };
      recentSmsCache.set(dedupKey, { response: chatResp, timestamp: now });
      return res.json(chatResp);
    }
  }

  // 5. If text does NOT start with # or . and is not a command, ignore to protect privacy
  addSimLog("system", `INTEGRITETSSKYDD: SMS från ${sender} saknar prompt-tecken (# eller .) och ignorerades.`);
  return res.json({ success: true, replyMessage: "Meddelandet ignorerades. Starta en inbjudan genom att skriva ett meddelande som börjar med # eller ." });
}

