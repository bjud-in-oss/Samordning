// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PreviewCard } from "../PreviewCard";

describe("PreviewCard UI & Style Resilience", () => {
  it("applies bg-brand-accent with high contrast and retains visual appearance when consent is checked", () => {
    const handleSend = vi.fn();
    const handleToggleConsent = vi.fn();

    const { rerender } = render(
      <PreviewCard
        selectedTime="18:00"
        locationName="Kapellet"
        selectedAreas={["Kortedala"]}
        selectedAudience={["Alla"]}
        selectedOrganization="Hjälpföreningen"
        organizerPersonName="Karin"
        activityText="Språkkafé"
        isRecurring={false}
        hasReminder={false}
        reminderTime=""
        consentConfirmed={false}
        isAdmin={true}
        onSend={handleSend}
        onToggleConsent={handleToggleConsent}
      />
    );

    // Initial state: consent not confirmed -> disabled styling
    const publishButtonDisabled = screen.getByRole("button", { name: /publicera direkt/i });
    expect(publishButtonDisabled).toBeDisabled();
    expect(publishButtonDisabled.className).toContain("bg-brand-ink/30");

    // Click checkbox to toggle consent
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(handleToggleConsent).toHaveBeenCalledWith(true);

    // Rerender with consentConfirmed = true
    rerender(
      <PreviewCard
        selectedTime="18:00"
        locationName="Kapellet"
        selectedAreas={["Kortedala"]}
        selectedAudience={["Alla"]}
        selectedOrganization="Hjälpföreningen"
        organizerPersonName="Karin"
        activityText="Språkkafé"
        isRecurring={false}
        hasReminder={false}
        reminderTime=""
        consentConfirmed={true}
        isAdmin={true}
        onSend={handleSend}
        onToggleConsent={handleToggleConsent}
      />
    );

    const publishButtonActive = screen.getByRole("button", { name: /publicera direkt/i });
    expect(publishButtonActive).not.toBeDisabled();
    expect(publishButtonActive.className).toContain("bg-brand-accent");
    expect(publishButtonActive.className).toContain("text-white");
    expect(publishButtonActive.className).not.toContain("bg-brand-primary");

    fireEvent.click(publishButtonActive);
    expect(handleSend).toHaveBeenCalledTimes(1);
  });
});
