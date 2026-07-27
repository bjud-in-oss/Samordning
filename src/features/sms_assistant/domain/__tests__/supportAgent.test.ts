// [src/features/sms_assistant/domain/__tests__/supportAgent.test.ts] - Unit Test for Support Agent
import { describe, it, expect } from "vitest";
import { runSupportAgent } from "../supportAgent";

describe("SMS Support Agent Logic", () => {
  it("returns offline fallback message when GEMINI_API_KEY is not configured", async () => {
    delete process.env.GEMINI_API_KEY;
    const response = await runSupportAgent("Hur publicerar jag mitt utkast?");
    expect(response).toContain("Support-tjänsten är tillfälligt offline");
  });
});
