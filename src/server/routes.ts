// [src/server/routes.ts] - Express API Routes Registration

import express from "express";
import { 
  activeAlerts, 
  adminNumbers, 
  pairedDevices, 
  pairDeviceToken, 
  API_SECRET, 
  normalizePhone, 
  saveActiveAlerts 
} from "./storage";
import { handleIncomingSms } from "./smsRoutes";
import { handleIncomingEmail } from "./emailRoutes";
import { setupSimRoutes } from "./simRoutes";
import { 
  getVapidPublicKey, 
  subscriptions, 
  saveSubscriptions 
} from "../main/services/pushService";
import { runGeminiWash } from "../main/services/parser";

export function setupRoutes(app: express.Express) {
  // Check device pairing status endpoint
  app.get("/api/admin/check-pairing", (req, res) => {
    const token = String(req.query.token || "").trim();
    if (token && pairedDevices.has(token)) {
      return res.json({ paired: true, verified: true });
    }
    return res.json({ paired: false, verified: false });
  });

  // Device pairing / loopback endpoint
  app.post("/api/admin/pair", (req, res) => {
    const { token } = req.body || {};
    const tokenStr = String(token || "").trim();
    if (!tokenStr) {
      return res.status(400).json({ success: false, error: "Token krävs." });
    }
    pairDeviceToken(tokenStr);
    return res.json({ success: true, paired: true, message: "Enheten har parats ihop och verifierats!" });
  });

  // Admin verification endpoint
  app.post("/api/admin/verify", (req, res) => {
    const { pin, phone, secret, password, deviceToken } = req.body || {};
    const inputPin = String(pin || secret || password || "").trim();
    const inputPhone = String(phone || "").trim();
    const tokenStr = String(deviceToken || "").trim();

    if (tokenStr && pairedDevices.has(tokenStr)) {
      return res.json({ success: true, verified: true, isAdmin: true, source: "paired_device" });
    }

    const envAdminPin = process.env.ADMIN_PIN ? process.env.ADMIN_PIN.trim() : "";

    if (envAdminPin.length > 0) {
      if (inputPin === envAdminPin) {
        return res.json({ success: true, verified: true, isAdmin: true, source: "env" });
      } else {
        return res.status(401).json({ success: false, verified: false, error: "Felaktig PIN-kod." });
      }
    }

    const isSecretMatch = inputPin === API_SECRET;
    const isPhoneAdmin = inputPhone && adminNumbers.some(num => normalizePhone(num) === normalizePhone(inputPhone));
    const isPinInAdmins = inputPin && adminNumbers.some(num => normalizePhone(num) === normalizePhone(inputPin));

    if (isSecretMatch || isPhoneAdmin || isPinInAdmins) {
      return res.json({ success: true, verified: true, isAdmin: true, source: "file" });
    }

    return res.status(401).json({ success: false, verified: false, error: "Obehörig admin eller felaktig PIN." });
  });

  // VAPID Public Key for Web Push subscription
  app.get("/api/vapid-public-key", (req, res) => {
    res.json({ publicKey: getVapidPublicKey() });
  });

  // Analyze raw text invitation with Gemini
  app.post("/api/wash", async (req, res) => {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text krävs." });
    }

    try {
      const washed = await runGeminiWash(text.trim());
      res.json(washed);
    } catch (err: any) {
      console.error("Wash error:", err);
      res.status(500).json({ error: "Kunde inte analysera inbjudan med AI: " + err.message });
    }
  });

  // Create push subscription
  app.post("/api/subscription", (req, res) => {
    const { id, subscription, tags } = req.body;
    if (!subscription) {
      return res.status(400).json({ error: "Missing subscription object" });
    }

    const recordId = id || Math.random().toString(36).substring(2, 11);
    const existingIndex = subscriptions.findIndex(s => s.id === recordId);

    const newRecord = {
      id: recordId,
      subscription,
      tags: {
        areas: tags?.areas || [],
        primaryArea: tags?.primaryArea || "",
        limitAreas: !!tags?.limitAreas,
        limitedAreas: tags?.limitedAreas || [],
        limitOrganizations: !!tags?.limitOrganizations,
        limitedOrganizations: tags?.limitedOrganizations || [],
        languages: tags?.languages || [],
        organization: tags?.organization || "bror",
        formats: tags?.formats || ["physical"],
        alwaysNotify: !!tags?.alwaysNotify,
        spiritualTips: !!tags?.spiritualTips,
        requireInteraction: tags?.requireInteraction ?? true
      }
    };

    if (existingIndex > -1) {
      subscriptions[existingIndex] = newRecord;
    } else {
      subscriptions.push(newRecord);
    }

    saveSubscriptions();
    res.json({ success: true, id: recordId });
  });

  // View all active Alerts/Announcements
  app.get("/api/alerts", (req, res) => {
    const safeAlerts = Object.values(activeAlerts)
      .filter(alert => alert.status !== "rejected")
      .map(alert => ({
        id: alert.id,
        type: alert.type,
        area: alert.area,
        time: alert.time,
        gender: alert.gender,
        language: alert.language,
        locationName: alert.locationName,
        timestamp: alert.timestamp,
        scrubbedText: alert.scrubbedText,
        rawText: alert.rawText,
        responsibleParty: alert.responsibleParty,
        contactType: alert.contactType,
        contactValue: alert.contactValue,
        category: alert.category,
        isFull: !!alert.isFull,
        status: alert.status || "active"
      }));
    res.json(safeAlerts);
  });

  // Moderation endpoint
  app.post("/api/alerts/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const alert = activeAlerts[id];
    if (!alert) return res.status(404).json({ error: "Inbjudan hittades inte." });

    if (status === "rejected") {
      delete activeAlerts[id];
    } else {
      alert.status = status;
    }
    saveActiveAlerts();
    res.json({ success: true, id, status: status === "rejected" ? "deleted" : alert.status });
  });

  // View specific Alert/Announcement detail
  app.get("/api/alerts/:id", (req, res) => {
    const alert = activeAlerts[req.params.id];
    if (!alert || alert.status === "pending") {
      return res.status(404).json({ error: "Aktiviteten hittades inte, har förfallit eller raderats permanent." });
    }

    const compliantAlert = {
      id: alert.id,
      type: alert.type,
      scrubbedText: alert.scrubbedText,
      area: alert.area,
      time: alert.time,
      gender: alert.gender,
      language: alert.language,
      locationName: alert.locationName,
      cloakedCoords: alert.cloakedCoords,
      timestamp: alert.timestamp,
      responsibleParty: alert.responsibleParty,
      contactType: alert.contactType,
      contactValue: alert.contactValue,
      category: alert.category,
      isFull: !!alert.isFull,
      totalActiveAlerts: Object.keys(activeAlerts).length
    };

    res.json(compliantAlert);
  });

  // SMS Gateway & Email routes
  app.post("/api/incoming-sms", handleIncomingSms);
  app.post("/api/incoming-email", handleIncomingEmail);

  // Web Simulator & Gateway status routes
  setupSimRoutes(app);
}
