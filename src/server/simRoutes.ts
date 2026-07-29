import express from "express";
import { activeAlerts, API_SECRET } from "./storage";
import { addSimLog, simLogs } from "../main/services/pushService";

export function setupSimRoutes(app: express.Express) {
  app.post("/api/sim/sms", async (req, res) => {
    const { from, body } = req.body;
    const dummyFrom = from || "0709998877";
    const dummyBody = body || "[Kortedala] [18:00] [Vara en vän] [Middag hos familjen Andersson. Välkomna!] [Hjälpföreningen] [0701234567]";

    addSimLog("incoming", `[Simulator] Skickar låtsas-SMS: "${dummyBody}"`);

    const response = await fetch(`http://localhost:3000/api/incoming-sms`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-API-Secret": API_SECRET
      },
      body: JSON.stringify({ sender: dummyFrom, text: dummyBody })
    });

    const data = await response.json();
    res.json(data);
  });

  app.post("/api/sim/whatsapp", async (req, res) => {
    const response = await fetch(`http://localhost:3000/api/sim/sms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  });

  app.get("/api/sim/messages", (req, res) => {
    res.json(simLogs);
  });

  app.get("/api/sim/active-alerts", (req, res) => {
    const safeAlerts = Object.values(activeAlerts)
      .filter(alert => alert.status !== "pending")
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
        responsibleParty: alert.responsibleParty,
        contactType: alert.contactType,
        category: alert.category,
        isFull: !!alert.isFull,
        status: alert.status || "active"
      }));
    res.json(safeAlerts);
  });

  app.get("/api/gateway/status", (req, res) => {
    res.json({ status: "active", qrCode: null, error: null });
  });

  app.get("/api/whatsapp/status", (req, res) => {
    res.json({ status: "disconnected", qrCode: null, error: null });
  });
}
