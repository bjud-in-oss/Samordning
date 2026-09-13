import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MainViewContent } from "../MainViewContent";

vi.mock("../../features/live_translation", () => ({
  LiveTranslationWidget: () => <div data-testid="live-translation-admin-widget">Admin Widget</div>,
  LiveTranslationListenerWidget: () => <div data-testid="live-translation-listener-widget">Listener Widget</div>,
}));

vi.mock("../../features/anpassa", () => ({
  OnboardingWizard: () => <div>Onboarding Wizard</div>,
}));

vi.mock("../../features/inbjudningar", () => ({
  AlertDetail: () => <div>Alert Detail</div>,
  ActiveStream: () => <div>Active Stream</div>,
}));

vi.mock("../../features/skapa_inbjudan", () => ({
  CreateInvitationForm: () => <div>Create Invitation Form</div>,
}));

describe("MainViewContent - translation view RBAC", () => {
  const defaultProps = {
    activeAlertId: null,
    navigateTo: vi.fn(),
    uiLanguage: "sv" as const,
    currentView: "translation" as const,
    setCurrentView: vi.fn(),
    activeTab: "stream" as const,
    setActiveTab: vi.fn(),
    handleSaveTags: vi.fn(),
    savedTags: [],
    pushEnabled: false,
    handleEnablePush: vi.fn(),
    handleDisablePush: vi.fn(),
    handleStreamCountChange: vi.fn(),
    isAdmin: false,
  };

  it("renderar LiveTranslationListenerWidget för vanliga deltagare (isAdmin === false)", () => {
    render(<MainViewContent {...defaultProps} isAdmin={false} />);

    expect(screen.getByText("Listener Widget")).toBeDefined();
    expect(screen.getByTestId("live-translation-listener-widget")).toBeDefined();
    expect(screen.queryByTestId("live-translation-admin-widget")).toBeNull();
  });

  it("renderar LiveTranslationWidget för administratörer (isAdmin === true)", () => {
    render(<MainViewContent {...defaultProps} isAdmin={true} />);

    expect(screen.getByText("Admin Widget")).toBeDefined();
    expect(screen.getByTestId("live-translation-admin-widget")).toBeDefined();
    expect(screen.queryByTestId("live-translation-listener-widget")).toBeNull();
  });
});
