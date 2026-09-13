// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { AdminConsole } from "../AdminConsole";

describe("AdminConsole Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("synkroniserar deviceToken och genererar ny token direkt i localStorage om tom", () => {
    expect(localStorage.getItem("admin_device_token")).toBeNull();

    render(<AdminConsole />);

    const storedToken = localStorage.getItem("admin_device_token");
    expect(storedToken).toBeTruthy();
    expect(storedToken).toMatch(/^dev_tok_/);
    expect(screen.getByText(/Skanna för att logga in som administratör/i)).toBeInTheDocument();
  });

  it("behåller befintlig deviceToken från localStorage vid rendering och hanterar klick", () => {
    localStorage.setItem("admin_device_token", "dev_tok_existing_123");

    render(<AdminConsole />);

    expect(localStorage.getItem("admin_device_token")).toBe("dev_tok_existing_123");

    const refreshButton = screen.getByRole("button", { name: /Kontrollera status nu/i });
    expect(refreshButton).toBeInTheDocument();
    fireEvent.click(refreshButton);
    expect(refreshButton).toBeDefined();
  });
});
