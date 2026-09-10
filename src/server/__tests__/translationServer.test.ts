import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { handleSmsCommand } from "../smsCommands";
import { 
  startTranslationSession, 
  stopTranslationSession, 
  getTranslationSessionStatus 
} from "../translationServer";

describe("Live Translation Server & SMS Command Integration", () => {
  beforeEach(() => {
    stopTranslationSession();
  });

  afterEach(() => {
    stopTranslationSession();
  });

  it("aktiverar tolkning via startTranslationSession med angivet målspråk", () => {
    const result = startTranslationSession("en");
    expect(result.success).toBe(true);
    expect(result.language).toBe("en");
    expect(result.replyMessage).toContain("?mode=listen&lang=en");

    const status = getTranslationSessionStatus();
    expect(status.active).toBe(true);
    expect(status.language).toBe("en");
  });

  it("stoppar tolkning via stopTranslationSession", () => {
    startTranslationSession("sv");
    const stopResult = stopTranslationSession();
    expect(stopResult.success).toBe(true);
    expect(stopResult.replyMessage).toContain("avslutad");

    const status = getTranslationSessionStatus();
    expect(status.active).toBe(false);
  });

  it("hanterar SMS-kommandot 'START EN' och returnerar PWA-djuplänk", async () => {
    const res = await handleSmsCommand("+46701112233", "START EN", false, false);
    expect(res.handled).toBe(true);
    expect(res.response?.success).toBe(true);
    expect(res.response?.replyMessage).toContain("?mode=listen&lang=en");

    const status = getTranslationSessionStatus();
    expect(status.active).toBe(true);
    expect(status.language).toBe("en");
  });

  it("hanterar SMS-kommandot '.start en' skiftlägesokänsligt med punktprefix", async () => {
    const res = await handleSmsCommand("+46701112233", ".start en", false, false);
    expect(res.handled).toBe(true);
    expect(res.response?.success).toBe(true);
    expect(res.response?.replyMessage).toContain("?mode=listen&lang=en");
  });

  it("hanterar SMS-kommandot 'STOPP' och stoppar pågående tolksession", async () => {
    startTranslationSession("en");
    const res = await handleSmsCommand("+46701112233", "STOPP", false, false);
    expect(res.handled).toBe(true);
    expect(res.response?.success).toBe(true);
    expect(res.response?.replyMessage).toContain("avslutad");

    const status = getTranslationSessionStatus();
    expect(status.active).toBe(false);
  });
});
