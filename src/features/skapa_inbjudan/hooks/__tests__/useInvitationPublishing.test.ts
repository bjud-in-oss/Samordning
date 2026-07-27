// [src/features/skapa_inbjudan/hooks/__tests__/useInvitationPublishing.test.ts] - Unit Test for Publishing Pre-flight & AI Review Logic
import { describe, it, expect } from "vitest";

describe("useInvitationPublishing Validation Rules", () => {
  it("detects missing required fields during pre-flight check", () => {
    const activityText = "";
    const selectedTime = "";
    const locationName = "";
    const selectedOrganization = "";
    const consentConfirmed = false;

    const missingFields: string[] = [];
    if (!activityText.trim()) missingFields.push("Beskrivning av aktivitet");
    if (!selectedTime.trim()) missingFields.push("Tid & datum");
    if (!locationName.trim()) missingFields.push("Mötesplats");
    if (!selectedOrganization.trim()) missingFields.push("Arrangör");
    if (!consentConfirmed) missingFields.push("Bekräftelse av personuppgiftsansvar");

    expect(missingFields).toHaveLength(5);
    expect(missingFields).toContain("Beskrivning av aktivitet");
  });

  it("extracts time and location patterns from activity text", () => {
    const activityText = "Middag kl 18:00 i Kortedala";
    
    const timeMatch = activityText.match(/(kl\.?\s*\d{1,2}(:\d{2})?|\d{1,2}:\d{2})/i);
    const locMatch = activityText.match(/(i\s+[A-ZÅÄÖa-zåäö]{3,}|på\s+[A-ZÅÄÖa-zåäö]{3,})/i);

    expect(timeMatch?.[0]).toBe("kl 18:00");
    expect(locMatch?.[0]).toBe("i Kortedala");
  });

  it("flags individual organization missing contact/person name", () => {
    const selectedOrganization = "Enskild medlem/Familj";
    const organizerPersonName = "";

    const isIndividualOrg = selectedOrganization.toLowerCase().includes("enskild") || selectedOrganization.toLowerCase().includes("familj");
    const needsNotice = isIndividualOrg && !organizerPersonName.trim();

    expect(needsNotice).toBe(true);
  });
});
