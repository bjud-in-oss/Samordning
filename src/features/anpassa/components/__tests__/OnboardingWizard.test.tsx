// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OnboardingWizard from "../../OnboardingWizard";

describe("OnboardingWizard", () => {
  it("renders new header, subtitle, and enable push button when push is disabled", () => {
    const handleEnablePush = vi.fn();
    const handleSave = vi.fn();

    render(
      <OnboardingWizard
        onSave={handleSave}
        pushEnabled={false}
        onEnablePush={handleEnablePush}
        onDisablePush={vi.fn()}
        uiLanguage="sv"
      />
    );

    // Header & Subtitle
    expect(screen.getByText("Anpassa din tillgänglighet")).toBeInTheDocument();
    expect(
      screen.getByText("Ställ in var och för vem du vill vara tillgänglig. Du är anonym och kan ändra dig eller ta en paus när du vill.")
    ).toBeInTheDocument();

    // Step 1 copy
    expect(screen.getByText("1. Dina områden")).toBeInTheDocument();
    expect(
      screen.getByText("Vilka områden brukar du träffa andra i eller erbjuda stöd i?")
    ).toBeInTheDocument();

    // Activation button & banner text
    expect(
      screen.getByText("Inbjudningar till dig är för tillfället inaktiverade.")
    ).toBeInTheDocument();
    const enableBtn = screen.getByRole("button", { name: /Slå på 'Ta emot inbjudningar'/i });
    expect(enableBtn).toBeInTheDocument();
    fireEvent.click(enableBtn);
    expect(handleEnablePush).toHaveBeenCalledTimes(1);
  });

  it("does not show activation button when push is already enabled", () => {
    render(
      <OnboardingWizard
        onSave={vi.fn()}
        pushEnabled={true}
        onEnablePush={vi.fn()}
        onDisablePush={vi.fn()}
        uiLanguage="sv"
      />
    );

    expect(screen.queryByRole("button", { name: /Slå på 'Ta emot inbjudningar'/i })).not.toBeInTheDocument();
  });
});
