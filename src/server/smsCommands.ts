import { ActiveAlert } from "../shared/types";
import { activeAlerts, adminNumbers, trustedNumbers, smsDrafts, saveActiveAlerts, saveTrusted, getNextFreeId, sendOutboundSms } from "./storage";
import { addSimLog, broadcastCancelPush, triggerPushAlert } from "../main/services/pushService";
import { getCoordsForArea, calculateSecondsUntilTime, washAnnouncementText } from "../main/services/parser";

export async function handleSmsCommand(
  sender: string,
  trimmedText: string,
  isAdmin: boolean,
  isTrustedOrAdmin: boolean
): Promise<{ handled: boolean; response?: { success: boolean; replyMessage?: string; error?: string; status?: number } }> {
  const isStatusReport = /^[\.#]$/.test(trimmedText);
  const helpMatch = trimmedText.match(/^[\.#]\?$/i);
  const mallMatch = trimmedText.match(/^[\.#]mall$/i);
  const taBortMatch = trimmedText.match(/^[\.#]ta\s*bort\s+(\d+)$/i);
  const jaDraftMatch = trimmedText.match(/^[\.#]ja$/i);
  const jaMatch = trimmedText.match(/^[\.#]ja\s+(\d+)$/i);
  const nejMatch = trimmedText.match(/^[\.#]nej\s+(\d+)$/i);
  const jaAllaMatch = trimmedText.match(/^[\.#]ja\s+alla\s+(\d+)$/i);
  const avsandareMatch = trimmedText.match(/^[\.#]avsändare\s+(.+)$/i);
  const expanderaMatch = trimmedText.match(/^[\.#]expandera\s+(\d+)$/i);
  const fullMatch = trimmedText.match(/^[\.#]full\s+(\d+)$/i);

  if (helpMatch) {
    const helpText = "5-raders mall för inbjudan:\nTid: (t.ex. Idag kl 18:00)\nMötesplats: (Plats/Länk/Tfn)\nAktivitet: (Vad ska ni göra?)\nBjud in från områden: (Område)\nMålgrupp: Alla\n\nKommandon: .ja [id], .nej [id], .ta bort [id], .status, .mall";
    return { handled: true, response: { success: true, replyMessage: helpText } };
  }

  if (taBortMatch) {
    if (!isAdmin) return { handled: true, response: { success: false, error: "Obehörig.", status: 403 } };
    const id = taBortMatch[1];
    if (!activeAlerts[id]) return { handled: true, response: { success: false, replyMessage: `Inbjudan ${id} finns ej.` } };
    
    delete activeAlerts[id];
    saveActiveAlerts();
    await broadcastCancelPush(id);
    return { handled: true, response: { success: true, replyMessage: `Inbjudan ${id} raderad och avbeställd.` } };
  }

  if (isStatusReport) {
    if (!isAdmin) return { handled: true, response: { success: false, error: "Obehörig.", status: 403 } };
    let report = "";
    let count = 0;
    for (const id in activeAlerts) {
      const a = activeAlerts[id];
      report += `${id}. ${a.category} (${a.status === 'pending' ? 'Väntar' : 'Aktiv'})\n`;
      count++;
    }
    if (count === 0) report = "Inga inbjudningar.\n";
    report += "\nKommandon: .ja [nr], .nej [nr], .ja alla [nr], .avsändare [namn]";
    return { handled: true, response: { success: true, replyMessage: report } };
  }

  if (mallMatch) {
    if (!isAdmin) return { handled: true, response: { success: false, error: "Obehörig.", status: 403 } };
    const mallText = "Tid: \nMötesplats: \nAktivitet: \nBjud in från områden: \nMålgrupp: Alla";
    return { handled: true, response: { success: true, replyMessage: mallText } };
  }

  if (jaDraftMatch) {
    if (!isAdmin) return { handled: true, response: { success: false, error: "Obehörig.", status: 403 } };
    const draft = smsDrafts.get(sender);
    if (!draft) return { handled: true, response: { success: false, replyMessage: "Inget utkast att publicera." } };
    if (draft.missingAreaForTeaching) return { handled: true, response: { success: false, replyMessage: "Område saknas." } };
    
    const id = getNextFreeId();
    const area = draft.extractedMetadata.area || "Kortedala";
    const { coords, cloakedCoords } = getCoordsForArea(area);
    const offsetSeconds = calculateSecondsUntilTime(draft.extractedMetadata.time || "18:00");
    const expiryTimestamp = Date.now() + (offsetSeconds + 2 * 3600) * 1000;
    
    const draftCategory = draft.extractedMetadata.category || "Vara en vän";
    const draftOrg = draft.extractedMetadata.organization || "Arrangör";
    const isLektionAndSamtal = draftCategory === "Läsa skrifterna" && draftOrg === "Missionärerna";
    const escalationLevel = isLektionAndSamtal ? 1 : undefined;

    const newAnnouncement: ActiveAlert = {
      id, type: "leader_invitation", rawText: draft.rawText, scrubbedText: draft.rawText,
      area, time: draft.extractedMetadata.time || "Ospecificerad tid",
      gender: draft.extractedMetadata.audience || "Alla", language: draft.extractedMetadata.language || "Svenska",
      locationName: draft.extractedMetadata.locationName || area, coords, cloakedCoords,
      timestamp: Date.now(), responsibleParty: draftOrg, contactType: "sms", contactValue: sender,
      expiryTimestamp, category: draftCategory, isFull: false, status: "active", escalationLevel
    };
    activeAlerts[id] = newAnnouncement;
    saveActiveAlerts();
    smsDrafts.delete(sender);
    await triggerPushAlert(newAnnouncement);
    addSimLog("system", `SMS MODERERING: Inbjudan ${id} publicerad av ${sender}.`);
    return { handled: true, response: { success: true, replyMessage: `Inbjudan ${id} har publicerats!` } };
  }

  if (jaMatch || jaAllaMatch || nejMatch) {
    if (!isAdmin) return { handled: true, response: { success: false, error: "Obehörig.", status: 403 } };
    const match = jaMatch || jaAllaMatch || nejMatch;
    if (!match) return { handled: true, response: { success: false, error: "Oväntat fel.", status: 400 } };
    
    const id = match[1];
    const alert = activeAlerts[id];
    if (!alert) return { handled: true, response: { success: false, error: `Hittade inte inbjudan ${id}.`, status: 404 } };

    if (nejMatch) {
      delete activeAlerts[id];
      saveActiveAlerts();
      await broadcastCancelPush(id, alert.area);
      addSimLog("system", `SMS MODERERING: Inbjudan ${id} avvisad av ${sender}.`);
      return { handled: true, response: { success: true, replyMessage: `Inbjudan ${id} har raderats.` } };
    }

    if (jaMatch || jaAllaMatch) {
      if (alert.status === "active") return { handled: true, response: { success: true, replyMessage: `Inbjudan ${id} är redan aktiv.` } };
      alert.status = "active";
      saveActiveAlerts();
      await triggerPushAlert(alert);
      addSimLog("system", `SMS MODERERING: Inbjudan ${id} godkänd av ${sender}.`);
      
      let extraMessage = "";
      if (jaAllaMatch) {
        if (!trustedNumbers.includes(alert.contactValue)) {
          trustedNumbers.push(alert.contactValue);
          saveTrusted();
          extraMessage = " Avsändaren har vitlistats för framtida direktpubliceringar.";
          addSimLog("system", `VITLISTAD: ${alert.contactValue} lades till i trusted list.`);
        }
      }
      return { handled: true, response: { success: true, replyMessage: `Inbjudan ${id} har publicerats!${extraMessage}` } };
    }
  }

  if (expanderaMatch) {
    if (!isAdmin) return { handled: true, response: { success: false, error: "Obehörig.", status: 403 } };
    const id = expanderaMatch[1];
    const alert = activeAlerts[id];
    if (!alert) return { handled: true, response: { success: false, error: `Hittade inte inbjudan ${id}.`, status: 404 } };
    alert.escalationLevel = 2;
    saveActiveAlerts();
    await triggerPushAlert(alert);
    return { handled: true, response: { success: true, replyMessage: `Inbjudan ${id} har expanderats till övriga!` } };
  }

  if (fullMatch) {
    const id = fullMatch[1];
    const alert = activeAlerts[id];
    if (!alert) return { handled: true, response: { success: false, error: `Hittade inte inbjudan ${id}.`, status: 404 } };
    if (!isAdmin && sender !== alert.contactValue) return { handled: true, response: { success: false, error: "Obehörig.", status: 403 } };
    alert.isFull = true;
    saveActiveAlerts();
    return { handled: true, response: { success: true, replyMessage: `Inbjudan ${id} har markerats som fullbokad.` } };
  }

  if (avsandareMatch) {
    const draft = smsDrafts.get(sender);
    if (!draft) return { handled: true, response: { success: false, replyMessage: "Inget aktivt utkast." } };
    draft.extractedMetadata.organization = avsandareMatch[1].trim();
    draft.timestamp = Date.now();
    return { handled: true, response: { success: true, replyMessage: `Ny avsändare: ${draft.extractedMetadata.organization}. Svara .ja för att publicera.` } };
  }

  return { handled: false };
}
