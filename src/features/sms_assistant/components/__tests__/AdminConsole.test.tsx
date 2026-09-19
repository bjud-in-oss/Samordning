// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { render, screen, fireEvent, cleanup, waitFor, act } from "@testing-library/react";
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

  it("synkroniserar deviceToken och genererar ny token direkt i localStorage om tom", async () => {
    expect(localStorage.getItem("admin_device_token")).toBeNull();

    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/admin/check-pairing")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ paired: false }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => [],
      });
    });
    global.fetch = fetchMock;

    await act(async () => {
      render(<AdminConsole />);
    });

    const storedToken = localStorage.getItem("admin_device_token");
    expect(storedToken).toBeTruthy();
    expect(storedToken).toMatch(/^dev_tok_/);
    expect(screen.getByText(/Skanna för att logga in som administratör/i)).toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/check-pairing?token=")
    );
  });

  it("anropar /api/admin/check-pairing vid klick på statuskontroll", async () => {
    localStorage.setItem("admin_device_token", "dev_tok_existing_123");

    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/admin/check-pairing")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ paired: false }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => [],
      });
    });
    global.fetch = fetchMock;

    await act(async () => {
      render(<AdminConsole />);
    });

    expect(localStorage.getItem("admin_device_token")).toBe("dev_tok_existing_123");

    const refreshButton = screen.getByRole("button", { name: /Kontrollera status nu/i });
    expect(refreshButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(refreshButton);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/admin/check-pairing?token=dev_tok_existing_123"
    );
  });

  it("visar och hanterar anslag från /api/alerts när parad", async () => {
    localStorage.setItem("isAdmin", "true");
    localStorage.setItem("admin_device_token", "dev_tok_admin_123");

    const mockAlerts = [
      { id: "alt-1", status: "pending", category: "Gudstjänst", area: "Centrum", scrubbedText: "Test pending" },
      { id: "alt-2", status: "active", category: "Fika", area: "Söder", scrubbedText: "Test active" },
      { id: "alt-3", status: "rejected", category: "Borttagen", area: "Norr", scrubbedText: "Test rejected" }
    ];

    const fetchMock = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (url.includes("/api/admin/check-pairing")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ paired: true }),
        });
      }
      if (url === "/api/alerts" && (!options || options.method === "GET")) {
        return Promise.resolve({
          ok: true,
          json: async () => mockAlerts,
        });
      }
      if (url.includes("/api/alerts/") && options?.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => [],
      });
    });
    global.fetch = fetchMock;

    await act(async () => {
      render(<AdminConsole />);
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Väntande förslag \(1\)/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Aktiva anslag \(1\)/i })).toBeInTheDocument();
    });

    const activeTabButton = screen.getByRole("button", { name: /Aktiva anslag/i });
    await act(async () => {
      fireEvent.click(activeTabButton);
    });

    expect(screen.getByText(/Test active/i)).toBeInTheDocument();
  });
});
