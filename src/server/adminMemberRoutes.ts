// [src/server/adminMemberRoutes.ts] - Admin Members & Moderation API Routes

import express from "express";
import { 
  activeAlerts, 
  adminNumbers, 
  trustedNumbers, 
  normalizePhone, 
  saveActiveAlerts, 
  saveAdmins, 
  saveTrusted 
} from "./storage";

export function setupAdminMemberRoutes(app: express.Express) {
  // Get Admin and Trusted Members list
  app.get("/api/admin/members", (req, res) => {
    res.json({
      admins: adminNumbers,
      trusted: trustedNumbers
    });
  });

  // Add Admin or Trusted member
  app.post("/api/admin/members/add", (req, res) => {
    const { phone, role } = req.body || {};
    const norm = normalizePhone(String(phone || ""));
    if (!norm) {
      return res.status(400).json({ error: "Giltigt telefonnummer krävs." });
    }

    if (role === "admin") {
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
      if (trustSender && (alert as any).sender) {
        const senderNorm = normalizePhone((alert as any).sender);
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
