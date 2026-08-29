// [src/server/__tests__/missionaryChatEngine.test.ts] - Unit tests for Interactive Missionary SMS Chat Engine

import { describe, it, expect, beforeEach } from "vitest";
import { 
  handleMissionaryChat, 
  missionarySessions, 
  formatCurrentDraft, 
  mergeDraftContext,
  MissionarySession
} from "../missionaryChatEngine";
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

  it("merges draft context incrementally without losing previously declared area and activity", () => {
    let draft: MissionarySession["draft"] = {
      activity: "Undervisa en intresserad",
      area: "Angered",
      locationName: "Angered Centrum",
      organization: "Missionärerna"
    };

    // Follow-up 1: User specifies time only ("kl 19:00")
    draft = mergeDraftContext(draft, "kl 19:00");
    expect(draft.time).toBe("kl 19:00");
    expect(draft.area).toBe("Angered");
    expect(draft.activity).toBe("Undervisa en intresserad");
    expect(draft.locationName).toBe("Angered Centrum");

    // Follow-up 2: User specifies a specific meeting location ("vi ses vid spårvagnshållplatsen")
    draft = mergeDraftContext(draft, "vi ses vid spårvagnshållplatsen");
    expect(draft.locationName).toBe("spårvagnshållplatsen");
    expect(draft.time).toBe("kl 19:00");
    expect(draft.area).toBe("Angered");
    expect(draft.activity).toBe("Undervisa en intresserad");

    // Follow-up 3: User changes area explicitly ("i Kortedala")
    draft = mergeDraftContext(draft, "i Kortedala");
    expect(draft.area).toBe("Kortedala");
    expect(draft.activity).toBe("Undervisa en intresserad");
    expect(draft.time).toBe("kl 19:00");
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
    expect(session?.step).toBe("COLLECTING_DETAILS");
  });

  it("handles conversation updates with context memory and suggests #publicera", async () => {
    await handleMissionaryChat(testSender, "#");
    await handleMissionaryChat(testSender, "#ja");

    // Step 1: Activity & Area
    const res1 = await handleMissionaryChat(testSender, "Bibelläsning i Kortedala");
    expect(res1.handled).toBe(true);
    expect(res1.replyMessage).toContain("Inbjudan hittills:");
    expect(res1.replyMessage).toContain("Kortedala");
    expect(res1.replyMessage).toContain("#publicera");

    // Step 2: Add time only
    const res2 = await handleMissionaryChat(testSender, "kl 19:00");
    expect(res2.handled).toBe(true);
    expect(res2.replyMessage).toContain("Kortedala");
    expect(res2.replyMessage).toContain("19:00");

    const session = missionarySessions.get(normSender);
    expect(session?.draft.area).toBe("Kortedala");
    expect(session?.draft.time).toContain("19:00");
    expect(session?.draft.activity).toBe("Bibelläsning");
  }, 15000);

  it("publishes the invitation directly when receiving #publicera with accumulated area and locationName", async () => {
    await handleMissionaryChat(testSender, "#");
    await handleMissionaryChat(testSender, "#ja");
    await handleMissionaryChat(testSender, "Bibelläsning i Kortedala");
    await handleMissionaryChat(testSender, "kl 19:00");

    const publishRes = await handleMissionaryChat(testSender, "#publicera");
    expect(publishRes.handled).toBe(true);
    expect(publishRes.replyMessage).toContain("är nu publicerad i anslagsflödet");

    expect(missionarySessions.has(normSender)).toBe(false);
    const alertIds = Object.keys(activeAlerts);
    expect(alertIds.length).toBe(1);
    const published = activeAlerts[alertIds[0]];
    expect(published.status).toBe("active");
    expect(published.area).toBe("Kortedala");
    expect(published.time).toContain("19:00");
    expect(published.responsibleParty).toBe("Missionärerna");
  }, 15000);
});
