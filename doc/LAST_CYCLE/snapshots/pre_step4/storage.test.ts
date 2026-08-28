// [src/server/__tests__/storage.test.ts] - Unit tests for Storage & Firestore abstraction

import { describe, it, expect, beforeEach } from "vitest";
import { 
  activeAlerts, 
  adminNumbers, 
  trustedNumbers, 
  pairedDevices, 
  pairDeviceToken, 
  getNextFreeId, 
  normalizePhone,
  saveActiveAlerts,
  saveAdmins,
  saveTrusted
} from "../storage";
import { ActiveAlert } from "../../shared/types";

describe("Storage & Data Management", () => {
  beforeEach(() => {
    for (const key in activeAlerts) {
      delete activeAlerts[key];
    }
    adminNumbers.length = 0;
    trustedNumbers.length = 0;
    pairedDevices.clear();
  });

  it("correctly normalizes swedish phone numbers", () => {
    expect(normalizePhone("+46701234567")).toBe("0701234567");
    expect(normalizePhone("0046701234567")).toBe("0701234567");
    expect(normalizePhone(" 070 123 45 67 ")).toBe("0701234567");
  });

  it("allocates the lowest next free id sequentially", () => {
    expect(getNextFreeId()).toBe("1");
    const mockAlert: ActiveAlert = {
      id: "1",
      type: "missionary_alert",
      rawText: "Möte kl 14",
      scrubbedText: "Möte kl 14",
      area: "Centrum",
      time: "kl 14",
      gender: "Äldste",
      language: "Svenska",
      locationName: "Centrum",
      coords: { lat: 57.7, lng: 11.9 },
      cloakedCoords: { lat: 57.7, lng: 11.9 },
      timestamp: Date.now(),
      responsibleParty: "Missionärerna",
      contactType: "sms",
      contactValue: "0701111111",
      expiryTimestamp: Date.now() + 3600000,
      status: "active"
    };
    activeAlerts["1"] = mockAlert;
    expect(getNextFreeId()).toBe("2");
  });

  it("pairs device tokens securely and rejects empty tokens", () => {
    expect(pairDeviceToken("")).toBe(false);
    expect(pairDeviceToken("   ")).toBe(false);
    expect(pairDeviceToken("token-abc-123")).toBe(true);
    expect(pairedDevices.has("token-abc-123")).toBe(true);
  });

  it("saves and maintains in-memory alert state cleanly", () => {
    const mockAlert: ActiveAlert = {
      id: "99",
      type: "leader_invitation",
      rawText: "Larm 99",
      scrubbedText: "Larm 99",
      area: "Nordstan",
      time: "kl 18",
      gender: "Alla",
      language: "Svenska",
      locationName: "Nordstan",
      coords: { lat: 57.7089, lng: 11.9746 },
      cloakedCoords: { lat: 57.7089, lng: 11.9746 },
      timestamp: Date.now(),
      responsibleParty: "Göteborgs Stad",
      contactType: "sms",
      contactValue: "0709999999",
      expiryTimestamp: Date.now() + 7200000,
      status: "active"
    };
    activeAlerts["99"] = mockAlert;

    saveActiveAlerts();
    expect(activeAlerts["99"].type).toBe("leader_invitation");
    expect(activeAlerts["99"].locationName).toBe("Nordstan");
  });

  it("manages admin and trusted numbers collections", () => {
    adminNumbers.push("0701230000");
    saveAdmins();
    expect(adminNumbers).toContain("0701230000");

    trustedNumbers.push("0709870000");
    saveTrusted();
    expect(trustedNumbers).toContain("0709870000");
  });
});
