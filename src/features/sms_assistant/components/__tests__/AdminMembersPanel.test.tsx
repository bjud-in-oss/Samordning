import React from "react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AdminMembersPanel } from "../AdminMembersPanel";

describe("AdminMembersPanel Component", () => {
  beforeEach(() => {
    localStorage.clear();
    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url === "/api/admin/members") {
        return {
          ok: true,
          json: async () => ({
            admins: ["+46701111111"],
            trusted: ["+46702222222"]
          })
        };
      }
      return {
        ok: true,
        json: async () => ({ success: true })
      };
    });
    globalThis.fetch = mockFetch;
  });

  it("renderar administratörer och betrodda skapare korrekt", async () => {
    render(<AdminMembersPanel />);
    await waitFor(() => {
      expect(screen.getByText("+46701111111")).toBeInTheDocument();
      expect(screen.getByText("+46702222222")).toBeInTheDocument();
    });

    // Kontrollera att standardroll är Betrodd Skapare
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("trusted");

    // Kontrollera att admin-alternativet är låst för vanliga samordnare
    const adminOption = screen.getByRole("option", { name: /Kräver Gateway/i }) as HTMLOptionElement;
    expect(adminOption.disabled).toBe(true);
  });

  it("visar låsikon istället för borttagningsknapp för administratörer utan gateway", async () => {
    render(<AdminMembersPanel />);
    await waitFor(() => {
      expect(screen.getByText("+46701111111")).toBeInTheDocument();
    });

    // För admin (+46701111111) ska det finnas en låsikon (titel: Kräver Gateway-behörighet för att ta bort)
    expect(screen.getByTitle("Kräver Gateway-behörighet för att ta bort")).toBeInTheDocument();

    // För betrodd skapare ska papperskorgen finnas
    expect(screen.getByTitle("Ta bort betrodd")).toBeInTheDocument();
  });

  it("låser upp gateway-behörighet när gateway-nyckel matas in", async () => {
    render(<AdminMembersPanel />);
    await waitFor(() => {
      expect(screen.getByText("+46701111111")).toBeInTheDocument();
    });

    const unlockBtn = screen.getByRole("button", { name: /Lås upp Gateway/i });
    fireEvent.click(unlockBtn);

    const secretInput = screen.getByPlaceholderText("Gateway API-secret");
    fireEvent.change(secretInput, { target: { value: "test-secret" } });

    const submitBtn = screen.getByRole("button", { name: "Lås upp" });
    fireEvent.click(submitBtn);

    // Nu ska status indikera Gateway aktiv
    await waitFor(() => {
      expect(screen.getByText("Gateway aktiv")).toBeInTheDocument();
      expect(screen.getByTitle("Ta bort samordnare")).toBeInTheDocument();
    });
  });
});
