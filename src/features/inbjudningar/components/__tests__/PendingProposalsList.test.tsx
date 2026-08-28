// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PendingProposalsList } from "../PendingProposalsList";
import { ActiveAlert } from "../../../mission_router";

describe("PendingProposalsList", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders stored pending proposals with delete button and handles deletion", () => {
    const proposals = [
      {
        id: "prop-1",
        time: "Idag 18:00",
        area: "Kortedala",
        activityText: "Grillkväll och gemenskap",
        responsibleParty: "Äldstekvorumet",
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem("my_pending_proposals", JSON.stringify(proposals));

    render(<PendingProposalsList activeStreamItems={[]} />);

    expect(screen.getByText("DIN INBJUDAN • FÖRBEREDS")).toBeInTheDocument();
    expect(screen.getByText("Kortedala")).toBeInTheDocument();
    expect(screen.getByText("Grillkväll och gemenskap")).toBeInTheDocument();

    const deleteBtn = screen.getByRole("button", { name: /Ta bort utkast/i });
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(deleteBtn);

    expect(screen.queryByText("Grillkväll och gemenskap")).not.toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem("my_pending_proposals") || "[]");
    expect(stored).toHaveLength(0);
  });

  it("auto-cleans proposals that already exist in active stream", () => {
    const proposals = [
      {
        id: "prop-synced",
        time: "Imorgon 19:00",
        area: "Göteborg",
        activityText: "Skriftstudier",
        responsibleParty: "Missionärerna",
        createdAt: new Date().toISOString()
      },
      {
        id: "prop-unsynced",
        time: "Söndag 10:00",
        area: "Utby",
        activityText: "Gudstjänst",
        responsibleParty: "Biskopsdömet",
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem("my_pending_proposals", JSON.stringify(proposals));

    const activeStream = [
      {
        id: "alert-101",
        time: "Imorgon 19:00",
        area: "Göteborg",
        scrubbedText: "Skriftstudier",
        responsibleParty: "Missionärerna",
        status: "active"
      }
    ] as unknown as ActiveAlert[];

    render(<PendingProposalsList activeStreamItems={activeStream} />);

    expect(screen.queryByText("Skriftstudier")).not.toBeInTheDocument();
    expect(screen.getByText("Gudstjänst")).toBeInTheDocument();
  });
});
