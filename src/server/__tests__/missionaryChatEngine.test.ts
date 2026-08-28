// [src/server/__tests__/missionaryChatEngine.test.ts] - Unit tests for Interactive Missionary SMS Chat Engine

import { describe, it, expect, beforeEach } from "vitest";
import { handleMissionaryChat, missionarySessions, formatCurrentDraft } from "../missionaryChatEngine";
import { activeAlerts, normalizePhone } from "../storage";

describe("Missionary Interactive SMS Chat Engine", () => {
  const testSender = "+46701234567";
  const normSender = normalizePhone(testSender);

  beforeEach(() => {
    missionarySessions.clear();
    for (const key in activeAlerts) {
      delete activeAlerts[key];
    }
  });

  it("initiates conversation on # prompt and asks for privacy consent with #ja instruction", async () => {
    const res = await handleMissionaryChat(testSender, "#");
    expect(res.handled).toBe(true);
    expect(res.replyMessage).toContain("För att skydda allas integritet");
    expect(res.replyMessage).toContain("#ja");

    const session = missionarySessions.get(normSender);
    expect(session).toBeDefined();
    expect(session?.step).toBe("AWAITING_CONSENT");
    expect(session?.consentGiven).toBe(false);
  });

  it("accepts consent with .ja or #ja without setting ja as activity, showing '(ännu tom)' summary", async () => {
    // 1. Start dialog
    await handleMissionaryChat(testSender, "#");

    // 2. Reply with .ja
    const res = await handleMissionaryChat(testSender, ".ja");
    expect(res.handled).toBe(true);
    expect(res.replyMessage).toContain("Integritetsvillkoren är godkända");
    expect(res.replyMessage).toContain("Inbjudan hittills: (ännu tom)");
    expect(res.replyMessage).not.toContain("Aktivitet: .ja");
    expect(res.replyMessage).not.toContain("Aktivitet: #ja");

    const session = missionarySessions.get(normSender);
    expect(session?.consentGiven).toBe(true);
    expect(session?.step).toBe("ACTIVE_INTERACTIVE_DIALOG");
  });

  it("handles conversation updates, displays 'Inbjudan hittills:' and suggests #publicera", async () => {
    await handleMissionaryChat(testSender, "#");
    await handleMissionaryChat(testSender, "#ja");

    const res = await handleMissionaryChat(testSender, "Bibelläsning kl 19:00");
    expect(res.handled).toBe(true);
    expect(res.replyMessage).toContain("Inbjudan hittills:");
    expect(res.replyMessage).toContain("#publicera");

    const session = missionarySessions.get(normSender);
    expect(session?.step).toBe("AWAITING_PUBLISH_CONFIRM");
    expect(session?.draft.time).toBeDefined();
  }, 15000);

  it("publishes the invitation directly when receiving #publicera", async () => {
    await handleMissionaryChat(testSender, "#");
    await handleMissionaryChat(testSender, "#ja");
    await handleMissionaryChat(testSender, "Bibelläsning kl 19:00");

    const publishRes = await handleMissionaryChat(testSender, "#publicera");
    expect(publishRes.handled).toBe(true);
    expect(publishRes.replyMessage).toContain("är nu publicerad i anslagsflödet");

    expect(missionarySessions.has(normSender)).toBe(false);
    const alertIds = Object.keys(activeAlerts);
    expect(alertIds.length).toBe(1);
    const published = activeAlerts[alertIds[0]];
    expect(published.status).toBe("active");
    expect(published.responsibleParty).toBe("Missionärerna");
  }, 15000);
});
