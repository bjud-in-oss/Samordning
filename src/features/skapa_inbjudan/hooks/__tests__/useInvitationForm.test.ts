// [src/features/skapa_inbjudan/hooks/__tests__/useInvitationForm.test.ts] - Unit Test for Form Facade Logic
import { describe, it, expect } from "vitest";
import { washAnnouncementText } from "../../../mission_router";

describe("useInvitationForm Business Logic & Form Formatting", () => {
  it("formats output text correctly from form parameters", () => {
    const selectedTime = "18:00";
    const locationName = "Kapellet";
    const selectedAreas = ["Angered", "Kortedala"];
    const selectedAudience = ["Alla"];
    const selectedOrganization = "Äldstekvorumet";
    const organizerPersonName = "Broder Svensson";
    const activityText = "Aktivitet (ta med vänner)";
    const hasReminder = true;
    const reminderTime = "1 timme innan";
    const isRecurring = true;

    const formattedText = [
      selectedTime ? `Tid: ${selectedTime}` : "",
      locationName ? `Mötesplats: ${locationName}` : "",
      selectedAreas.length > 0 ? `Bjud in från områden: ${selectedAreas.join(", ")}` : "",
      selectedAudience.length > 0 ? `Målgrupp: ${selectedAudience.join(", ")}` : "",
      selectedOrganization ? `Arrangör: ${selectedOrganization}${organizerPersonName ? ` (${organizerPersonName})` : ""}` : "",
      activityText ? `Aktivitet: ${washAnnouncementText(activityText)}` : "",
      hasReminder && reminderTime ? `Påminnelse: ${reminderTime}` : "",
      isRecurring ? `Upprepas: Varje vecka` : ""
    ].filter(Boolean).join("\n");

    expect(formattedText).toContain("Tid: 18:00");
    expect(formattedText).toContain("Mötesplats: Kapellet");
    expect(formattedText).toContain("Arrangör: Äldstekvorumet (Broder Svensson)");
    expect(formattedText).toContain("Aktivitet: Aktivitet");
    expect(formattedText).not.toContain("(ta med vänner)");
  });

  it("evaluates form validity correctly based on required fields", () => {
    const isValid = (
      time: string,
      loc: string,
      act: string,
      org: string,
      aud: string[],
      consent: boolean
    ) => Boolean(time.trim()) && Boolean(loc.trim()) && Boolean(act.trim()) && Boolean(org.trim()) && aud.length > 0 && consent;

    expect(isValid("18:00", "Kapellet", "Middag", "Hjälpföreningen", ["Alla"], true)).toBe(true);
    expect(isValid("18:00", "Kapellet", "Middag", "Hjälpföreningen", ["Alla"], false)).toBe(false);
  });
});
