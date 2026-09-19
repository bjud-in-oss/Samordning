// [src/server/adminMemberRoutes.ts] - Admin Members & Moderation API Routes

import express from "express";
import { 
  activeAlerts, 
  adminNumbers, 
  trustedNumbers, 
  normalizePhone, 
  saveActiveAlerts, 
  saveAdmins, 
  saveTrusted,
  API_SECRET
} from "./storage";

export function setupAdminMemberRoutes(app: express.Express) {
  // GET /api/admin/verified-senders
  // Protected with Bearer ${API_SECRET}, returns approved coordinators in E.164 (+46...)
  app.get("/api/admin/verified-senders", (req, res) => {
    const authHeader = req.headers.authorization || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    const token = bearerToken || (req.query.secret ? String(req.query.secret).trim() : "");

    if (!API_SECRET || token !== API_SECRET) {
      return res.status(401).json({ error: "Obehörig: Ogiltig eller saknad API-nyckel." });
    }

    const toE164 = (num: string): string => {
      let cleaned = num.replace(/[\s\-\(\)]+/g, "");
      if (cleaned.startsWith("+")) return cleaned;
      if (cleaned.startsWith("00")) return "+" + cleaned.slice(2);
      if (cleaned.startsWith("0")) return "+46" + cleaned.slice(1);
      if (cleaned.startsWith("46")) return "+" + cleaned;
      return "+46" + cleaned;
    };

    const verifiedSenders = adminNumbers
      .map(toE164)
      .filter((n, idx, arr) => arr.indexOf(n) === idx);

    return res.json({
      success: true,
      verifiedSenders,
      senders: verifiedSenders
    });
  });

  // Get Admin and Trusted Members list
  app.get("/api/admin/members", (req, res) => {
    res.json({
      admins: adminNumbers,
      trusted: trustedNumbers
    });
  });

  // Helper to check gateway authorization
  const isGatewayAuthorized = (req: express.Request): boolean => {
    const authHeader = req.headers.authorization || "";
    const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    const gatewaySecret = req.headers["x-gateway-secret"] || req.body?.gatewaySecret || bearer;
    return Boolean(API_SECRET && gatewaySecret === API_SECRET);
  };

  // Add Admin or Trusted member
  app.post("/api/admin/members/add", (req, res) => {
    const { phone, role } = req.body || {};
    const norm = normalizePhone(String(phone || ""));
    if (!norm) {
      return res.status(400).json({ error: "Giltigt telefonnummer krävs." });
    }

    if (role === "admin") {
      if (!isGatewayAuthorized(req)) {
        return res.status(403).json({ error: "Kräver Gateway-behörighet för att hantera Samordnare." });
      }
      if (!adminNumbers.some(n => normalizePhone(n) === norm)) {
        adminNumbers.push(norm);
        saveAdmins();
      }
    } else {
      if (!trustedNumbers.some(n => normalizePhone(n) === norm)) {
        trustedNumbers.push(norm);
        saveTrusted();
      }
    }
    return res.json({ success: true, role, phone: norm });
  });

  // Remove Admin or Trusted member
  app.post("/api/admin/members/remove", (req, res) => {
    const { phone, role } = req.body || {};
    const norm = normalizePhone(String(phone || ""));
    if (!norm) {
      return res.status(400).json({ error: "Giltigt telefonnummer krävs." });
    }

    if (role === "admin") {
      if (!isGatewayAuthorized(req)) {
        return res.status(403).json({ error: "Kräver Gateway-behörighet för att hantera Samordnare." });
      }
      const idx = adminNumbers.findIndex(n => normalizePhone(n) === norm);
      if (idx > -1) {
        adminNumbers.splice(idx, 1);
        saveAdmins();
      }
    } else {
      const idx = trustedNumbers.findIndex(n => normalizePhone(n) === norm);
      if (idx > -1) {
        trustedNumbers.splice(idx, 1);
        saveTrusted();
      }
    }
    return res.json({ success: true, role, phone: norm });
  });

  // Moderation endpoint
  app.post("/api/alerts/:id/status", (req, res) => {
    const { id } = req.params;
    const { status, trustSender } = req.body;
    const alert = activeAlerts[id];
    if (!alert) return res.status(404).json({ error: "Inbjudan hittades inte." });

    if (status === "rejected") {
      delete activeAlerts[id];
    } else {
      alert.status = status;
      const alertWithSender = alert as { sender?: string };
      if (trustSender && alertWithSender.sender) {
        const senderNorm = normalizePhone(alertWithSender.sender);
        if (senderNorm && !trustedNumbers.some(n => normalizePhone(n) === senderNorm)) {
          trustedNumbers.push(senderNorm);
          saveTrusted();
        }
      }
    }
    saveActiveAlerts();
    res.json({ success: true, id, status: status === "rejected" ? "deleted" : alert.status });
  });
}
