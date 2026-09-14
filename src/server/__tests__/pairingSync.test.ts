import { describe, it, expect, beforeEach, vi } from "vitest";
import { pairedDevices, pairDeviceToken } from "../storage";

describe("pairingSync Logic and Firestore Fallback", () => {
  beforeEach(() => {
    pairedDevices.clear();
    vi.restoreAllMocks();
  });

  it("registers both original and lowercase token in pairedDevices", () => {
    expect(pairedDevices.has("Token_ABC_123")).toBe(false);
    expect(pairedDevices.has("token_abc_123")).toBe(false);

    const success = pairDeviceToken("Token_ABC_123");
    expect(success).toBe(true);
    expect(pairedDevices.has("Token_ABC_123")).toBe(true);
    expect(pairedDevices.has("token_abc_123")).toBe(true);
  });

  it("handles whitespace trimming and rejects empty tokens", () => {
    expect(pairDeviceToken("")).toBe(false);
    expect(pairDeviceToken("   ")).toBe(false);

    const success = pairDeviceToken("  TOKEN_SPACED  ");
    expect(success).toBe(true);
    expect(pairedDevices.has("TOKEN_SPACED")).toBe(true);
    expect(pairedDevices.has("token_spaced")).toBe(true);
  });

  it("validates case-insensitive membership", () => {
    pairDeviceToken("AdminToken-XYZ");
    const query = "admintoken-xyz";
    const isPaired = pairedDevices.has(query) || pairedDevices.has(query.toLowerCase());
    expect(isPaired).toBe(true);
  });
});
