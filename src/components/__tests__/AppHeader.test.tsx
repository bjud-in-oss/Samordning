import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { AppHeader } from "../AppHeader";

describe("AppHeader Component", () => {
  it("renders translation button and calls onToggleTranslation on click", () => {
    const onToggleTranslation = vi.fn();
    const onToggleSettings = vi.fn();
    const onTogglePush = vi.fn();
    const onCreateInvitation = vi.fn();

    render(
      <AppHeader
        currentView="stream"
        onToggleSettings={onToggleSettings}
        onToggleTranslation={onToggleTranslation}
        pushEnabled={false}
        isToggling={false}
        onTogglePush={onTogglePush}
        onCreateInvitation={onCreateInvitation}
      />
    );

    const translationBtn = screen.getByRole("button", { name: /direktöversättning/i });
    expect(translationBtn).toBeDefined();

    fireEvent.click(translationBtn);
    expect(onToggleTranslation).toHaveBeenCalledTimes(1);
  });

  it("applies active styles when currentView is translation", () => {
    const onToggleTranslation = vi.fn();

    const { rerender } = render(
      <AppHeader
        currentView="stream"
        onToggleSettings={vi.fn()}
        onToggleTranslation={onToggleTranslation}
        pushEnabled={false}
        isToggling={false}
        onTogglePush={vi.fn()}
        onCreateInvitation={vi.fn()}
      />
    );

    let translationBtn = screen.getByRole("button", { name: /direktöversättning/i });
    expect(translationBtn.className).not.toContain("text-brand-accent");

    rerender(
      <AppHeader
        currentView="translation"
        onToggleSettings={vi.fn()}
        onToggleTranslation={onToggleTranslation}
        pushEnabled={false}
        isToggling={false}
        onTogglePush={vi.fn()}
        onCreateInvitation={vi.fn()}
      />
    );

    translationBtn = screen.getByRole("button", { name: /direktöversättning/i });
    expect(translationBtn.className).toContain("text-brand-accent");
  });
});
