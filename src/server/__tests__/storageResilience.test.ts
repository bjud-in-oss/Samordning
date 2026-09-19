import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs";
import path from "path";
import { pairedDevices, pairDeviceToken, loadPairedDevices, loadAdmins, loadTrusted, loadActiveAlerts } from "../storage";

const PAIRED_FILE = path.join(process.cwd(), "data", "paired_devices.json");

describe("Storage Resilience & Local Fallback (TCK-SMS-006)", () => {
  beforeEach(() => {
    pairedDevices.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // Clean up test file if created
    if (fs.existsSync(PAIRED_FILE)) {
      try {
        fs.unlinkSync(PAIRED_FILE);
      } catch {
        // ignore
      }
    }
  });

  it("pairDeviceToken persists tokens to in-memory set and local disk JSON file", () => {
    const token = "MY_SPECIAL_TOKEN_99";
    const result = pairDeviceToken(token);

    expect(result).toBe(true);
    expect(pairedDevices.has(token)).toBe(true);
    expect(pairedDevices.has(token.toLowerCase())).toBe(true);

    expect(fs.existsSync(PAIRED_FILE)).toBe(true);
    const diskContent = JSON.parse(fs.readFileSync(PAIRED_FILE, "utf8"));
    expect(Array.isArray(diskContent)).toBe(true);
    expect(diskContent).toContain(token);
    expect(diskContent).toContain(token.toLowerCase());
  });

  it("loadPairedDevices restores tokens from disk even if Firestore throws permission-denied", async () => {
    // Write pre-existing data to disk
    fs.mkdirSync(path.dirname(PAIRED_FILE), { recursive: true });
    fs.writeFileSync(PAIRED_FILE, JSON.stringify(["preloaded_token", "PRELOADED_TOKEN"]), "utf8");

    await loadPairedDevices();

    expect(pairedDevices.has("preloaded_token")).toBe(true);
    expect(pairedDevices.has("PRELOADED_TOKEN")).toBe(true);
  });

  it("loadAdmins, loadTrusted, and loadActiveAlerts complete gracefully without throwing on permission errors", async () => {
    // Even if firestore throws permission-denied, none of these should throw or crash
    await expect(loadAdmins()).resolves.not.toThrow();
    await expect(loadTrusted()).resolves.not.toThrow();
    await expect(loadActiveAlerts()).resolves.not.toThrow();
  });
});
