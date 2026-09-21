import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MainViewContent } from "../MainViewContent";

vi.mock("../../features/live_translation", () => ({
  LiveTranslationWidget: () => <div data-testid="live-translation-speaker-widget">Speaker Widget</div>,
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

describe("MainViewContent - Dev Speaker Route Bypass (/tala & /speak)", () => {
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

  const originalLocation = window.location;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });

  it("renderar sändarvyn (LiveTranslationWidget) direkt på localhost vid sökväg /tala även om isAdmin är false", () => {
    Object.defineProperty(window, "location", {
      value: {
        pathname: "/tala",
        hostname: "localhost",
      },
      writable: true,
    });

    render(<MainViewContent {...defaultProps} isAdmin={false} />);

    expect(screen.getByText("Speaker Widget")).toBeDefined();
    expect(screen.getByTestId("live-translation-speaker-widget")).toBeDefined();
    expect(screen.queryByTestId("live-translation-listener-widget")).toBeNull();
  });

  it("renderar sändarvyn (LiveTranslationWidget) direkt på localhost vid sökväg /speak även om isAdmin är false", () => {
    Object.defineProperty(window, "location", {
      value: {
        pathname: "/session/utby/speak",
        hostname: "localhost",
      },
      writable: true,
    });

    render(<MainViewContent {...defaultProps} isAdmin={false} />);

    expect(screen.getByText("Speaker Widget")).toBeDefined();
    expect(screen.getByTestId("live-translation-speaker-widget")).toBeDefined();
    expect(screen.queryByTestId("live-translation-listener-widget")).toBeNull();
  });

  it("renderar lyssnarvyn (LiveTranslationListenerWidget) vid /watch för icke-admin", () => {
    Object.defineProperty(window, "location", {
      value: {
        pathname: "/session/utby/watch",
        hostname: "localhost",
      },
      writable: true,
    });

    render(<MainViewContent {...defaultProps} isAdmin={false} />);

    expect(screen.getByText("Listener Widget")).toBeDefined();
    expect(screen.getByTestId("live-translation-listener-widget")).toBeDefined();
    expect(screen.queryByTestId("live-translation-speaker-widget")).toBeNull();
  });
});
