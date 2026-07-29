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
      return res.json({ success: true, replyMessage: `Enhet verifierad och parkopplad med systemet!` });
    }
  }

  const cmdResult = await handleSmsCommand(sender, trimmedText, isAdmin, isTrustedOrAdmin);
  if (cmdResult.handled) {
    const resp = cmdResult.response;
    if (resp?.error) {
      return res.status(resp.status || 400).json({ error: resp.error });
    }
    return res.json(resp);
  }

  const isWebb = trimmedText.toUpperCase().startsWith("#WEBB");
  if (isWebb) {
    const lines = trimmedText.split("\n");
    let category = "Vara en vän";
    let time = "18:00";
    let area = "Kortedala";
    let organization = "Arrangör";
    let audience = "Alla";
    let rawText = "";

    for (const line of lines) {
      const lower = line.toLowerCase().trim();
      if (lower.startsWith("kategori:")) category = line.substring(line.indexOf(":") + 1).trim() || category;
      else if (lower.startsWith("tid:")) time = line.substring(line.indexOf(":") + 1).trim() || time;
      else if (lower.startsWith("område:") || lower.startsWith("bjud in från områden:")) area = line.substring(line.indexOf(":") + 1).trim() || area;
      else if (lower.startsWith("avsändare:")) organization = line.substring(line.indexOf(":") + 1).trim() || organization;
      else if (lower.startsWith("målgrupp:")) audience = line.substring(line.indexOf(":") + 1).trim() || audience;
      else if (lower.startsWith("text:") || lower.startsWith("aktivitet:")) rawText = line.substring(line.indexOf(":") + 1).trim();
    }

    if (!rawText) {
      rawText = trimmedText.replace(/^#WEBB/i, "").trim();
    }

    const cleanedText = washAnnouncementText(rawText);
    const id = getNextFreeId();
    const { coords, cloakedCoords } = getCoordsForArea(area);
    const offsetSeconds = calculateSecondsUntilTime(time);
    const expiryTimestamp = Date.now() + (offsetSeconds + 2 * 3600) * 1000;
    const isLektionAndSamtal = category === "Läsa skrifterna" && organization === "Missionärerna";
    const status = isTrustedOrAdmin ? "active" : "pending";

    const newAnnouncement: ActiveAlert = {
      id, type: "leader_invitation", rawText: cleanedText, scrubbedText: cleanedText,
      area, time, gender: audience, language: "Svenska", locationName: area, coords, cloakedCoords,
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

  try {
    const washed = await runGeminiWash(trimmedText);
    const newDraft: SmsDraft = {
      rawText: trimmedText, extractedMetadata: washed.extractedMetadata,
      missingAreaForTeaching: washed.warnings.missingAreaForTeaching, timestamp: Date.now()
    };
    
    smsDrafts.set(sender, newDraft);
    const previewMessage = `Utkast sparat i 30 min (ditt nummer döljs). Svara med .ja för att publicera, eller ändra med .avsändare [namn].`;
    return res.json({ success: true, replyMessage: previewMessage });
  } catch (err: any) {
    return res.status(500).json({ error: "Fel vid bearbetning." });
  }
}
