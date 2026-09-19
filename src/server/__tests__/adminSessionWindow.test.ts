// [src/server/__tests__/adminSessionWindow.test.ts] - TDD for Admin 5-Minute Session Window
import { describe, it, expect, beforeEach, vi } from "vitest";
import { 
  isWithinAdminSession, 
  touchAdminSession, 
  clearAdminSessions, 
  ADMIN_SESSION_TTL_MS,
  handleIncomingSms 
} from "../smsRoutes";
import { adminNumbers, API_SECRET, normalizePhone } from "../storage";
import { Request, Response } from "express";

describe("Admin 5-Minute Session Window (TCK-013)", () => {
  beforeEach(() => {
    clearAdminSessions();
    vi.restoreAllMocks();
  });

  it("registers and detects active admin sessions correctly within TTL", () => {
    const adminPhone = "+46701234567";
    const startTime = 1000000;

    expect(isWithinAdminSession(adminPhone, startTime)).toBe(false);

    // Touch session
    touchAdminSession(adminPhone, startTime);
    expect(isWithinAdminSession(adminPhone, startTime)).toBe(true);

    // 4 minutes later -> still active
    const fourMinutesLater = startTime + (4 * 60 * 1000);
    expect(isWithinAdminSession(adminPhone, fourMinutesLater)).toBe(true);

    // Exactly at TTL (5 minutes) -> expired
    const fiveMinutesLater = startTime + ADMIN_SESSION_TTL_MS;
    expect(isWithinAdminSession(adminPhone, fiveMinutesLater)).toBe(false);

    // 6 minutes later -> expired
    const sixMinutesLater = startTime + (6 * 60 * 1000);
    expect(isWithinAdminSession(adminPhone, sixMinutesLater)).toBe(false);
  });

  it("allows admin messages without prefix (# or .) when session is active and updates TTL", async () => {
    const adminPhone = adminNumbers[0] || "+46700000001";
    if (!adminNumbers.includes(adminPhone)) {
      adminNumbers.push(adminPhone);
    }

    // Step 1: Admin sends an initial command with dot prefix (e.g. .status)
    let jsonResult: Record<string, unknown> | null = null;
    let statusCode: number = 200;

    const createMockRes = () => {
      const res: Partial<Response> = {
        status: (code: number) => {
          statusCode = code;
          return res as Response;
        },
        json: (data: unknown) => {
          jsonResult = data as Record<string, unknown>;
          return res as Response;
        }
      };
      return res as Response;
    };

    const initialReq = {
      headers: { "x-api-secret": API_SECRET },
      body: { sender: adminPhone, text: ".status" }
    } as unknown as Request;

    await handleIncomingSms(initialReq, createMockRes());
    expect(jsonResult).toBeDefined();
    expect(isWithinAdminSession(adminPhone)).toBe(true);

    // Step 2: Admin sends a follow-up message without prefix within 5 minutes
    const followUpReq = {
      headers: { "x-api-secret": API_SECRET },
      body: { sender: adminPhone, text: "status" } // no prefix!
    } as unknown as Request;

    jsonResult = null;
    await handleIncomingSms(followUpReq, createMockRes());

    // Should NOT be ignored by privacy filter
    expect(jsonResult?.replyMessage).not.toContain("saknar prompt-tecken");
    expect(isWithinAdminSession(adminPhone)).toBe(true);
  });

  it("strictly enforces prefix (# or .) for non-admin senders regardless of timing", async () => {
    const nonAdminPhone = "+46709999999";
    let jsonResult: Record<string, unknown> | null = null;

    const mockRes = {
      headers: {},
      status: () => mockRes,
      json: (data: unknown) => {
        jsonResult = data as Record<string, unknown>;
        return mockRes;
      }
    } as unknown as Response;

    const req = {
      headers: { "x-api-secret": API_SECRET },
      body: { sender: nonAdminPhone, text: "hej jag vill bjuda in till fika" }
    } as unknown as Request;

    await handleIncomingSms(req, mockRes);
    expect(jsonResult?.replyMessage).toContain("Starta en inbjudan genom att skriva ett meddelande som börjar med # eller .");
    expect(isWithinAdminSession(nonAdminPhone)).toBe(false);
  });
});
