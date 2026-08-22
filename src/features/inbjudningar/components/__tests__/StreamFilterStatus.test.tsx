import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { StreamFilterStatus } from "../StreamFilterStatus";

describe("StreamFilterStatus", () => {
  it("renders correct copy when push notifications are turned OFF and handles click event", () => {
    const handleOpenSettings = vi.fn();
    render(
      <StreamFilterStatus savedTags={null} pushEnabled={false} onOpenSettings={handleOpenSettings} />
    );
    expect(screen.getByText("Anpassa din tillgänglighet")).toBeInTheDocument();
    expect(
      screen.getByText(/Du ser direkt när någon behöver ditt stöd/i)
    ).toBeInTheDocument();
    expect(screen.getByText("(Klicka för att anpassa)")).toBeInTheDocument();
    expect(screen.queryByText("AVISERINGAR AV")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Anpassa din tillgänglighet"));
    expect(handleOpenSettings).toHaveBeenCalledTimes(1);
  });

  it("renders standard parish area copy when push is ON and handles click event", () => {
    const handleOpenSettings = vi.fn();
    render(
      <StreamFilterStatus savedTags={{ limitAreas: false }} pushEnabled={true} onOpenSettings={handleOpenSettings} />
    );
    expect(screen.getByText("Begränsa din tillgänglighet")).toBeInTheDocument();
    expect(screen.getByText("Tillgänglig i hela församlingens område")).toBeInTheDocument();
    expect(
      screen.getByText(/Du tar emot inbjudningar från hela församlingsområdet/i)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Tillgänglig i hela församlingens område"));
    expect(handleOpenSettings).toHaveBeenCalledTimes(1);
  });

  it("renders customized areas copy and chips when push is ON and limited areas are selected", () => {
    render(
      <StreamFilterStatus
        savedTags={{
          limitAreas: true,
          limitedAreas: ["Majorna", "Linné"]
        }}
        pushEnabled={true}
      />
    );
    expect(screen.getByText("Anpassat urval")).toBeInTheDocument();
    expect(screen.getByText("Dina valda områden")).toBeInTheDocument();
    expect(screen.getByText("Majorna")).toBeInTheDocument();
    expect(screen.getByText("Linné")).toBeInTheDocument();
  });
});
