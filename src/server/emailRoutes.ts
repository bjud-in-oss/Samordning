import express from "express";
import { activeAlerts, saveActiveAlerts, getNextFreeId } from "./storage";
import { addSimLog, triggerPushAlert } from "../main/services/pushService";
import { runAiWash, isApprovedSender, calculateSecondsUntilTime } from "../main/services/parser";
import { ActiveAlert } from "../shared/types";

export async function handleIncomingEmail(req: express.Request, res: express.Response) {
  const { from, body, subject } = req.body;

  if (!from || !body) {
    return res.status(400).json({ error: "Missing from or body parameter" });
  }

  addSimLog("incoming", `E-post mottagen till alska.dela.bjudin@gmail.com från ${from}. Ämne: "${subject || ''}"`);

  if (!isApprovedSender(from)) {
    addSimLog("system", `AVVISAD E-POST: Avsändaren ${from} är inte på listan över godkända ledaradresser.`);
    return res.status(403).json({ error: "Avsändaren är inte på listan över godkända ledaradresser." });
  }

  try {
    const washed = await runAiWash(body, {
      role: "Församlingsledare",
      contact: from,
      originalType: "leader_invitation"
    });

    const id = getNextFreeId();
    const offsetSeconds = calculateSecondsUntilTime(washed.time);
    const expiryTimestamp = Date.now() + (offsetSeconds + 2 * 3600) * 1000;

    const isLektionAndSamtal = ((washed.category || "Vara en vän") === "Läsa skrifterna" || (washed.category || "Vara en vän") === "Få näring av Guds ord") && (washed.responsibleParty || "Församlingsledare") === "Missionärerna";
    const escalationLevel = isLektionAndSamtal ? 1 : undefined;

    const newAnnouncement: ActiveAlert = {
      id,
      type: "leader_invitation",
      rawText: body,
      scrubbedText: washed.scrubbedText,
      area: washed.area || "Kortedala",
      time: washed.time || "Ospecificerad tid",
      gender: "Alla",
      language: "Svenska",
      locationName: washed.locationName || washed.area || "Göteborg",
      coords: washed.coords,
      cloakedCoords: washed.cloakedCoords,
      timestamp: Date.now(),
      responsibleParty: washed.responsibleParty || "Församlingsledare",
      contactType: "sms",
      contactValue: washed.contactValue || from,
      expiryTimestamp,
      category: washed.category || "Vara en vän",
      isFull: false,
      status: "active",
      escalationLevel
    };

    activeAlerts[id] = newAnnouncement;
    saveActiveAlerts();

    await triggerPushAlert(newAnnouncement);

    addSimLog("system", `NY INBJUDAN SKAPAD VIA E-POST: "${newAnnouncement.scrubbedText.substring(0, 50)}..." i [${newAnnouncement.area}].`);
    return res.json({ success: true, id });

  } catch (err: any) {
    console.error("Failed to process incoming email:", err);
    addSimLog("system", `Fel vid bearbetning av e-post: ${err.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
}
