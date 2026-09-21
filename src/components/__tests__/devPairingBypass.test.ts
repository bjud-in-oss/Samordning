// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import { createApp } from "../../../server";

describe("Dev Pairing Bypass (/api/admin/check-pairing & /api/check-pairing)", () => {
  let app: express.Express;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    app = createApp();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("returnerar { active: true, status: 'approved' } direkt på localhost / 127.0.0.1 utan token", async () => {
    process.env.NODE_ENV = "production";
    const res = await fetchTestRoute(app, "/api/admin/check-pairing");
    expect(res.status).toBe(200);
    const data = (await res.json()) as Record<string, unknown>;
    expect(data.active).toBe(true);
    expect(data.status).toBe("approved");
    expect(data.paired).toBe(true);
    expect(data.verified).toBe(true);
  });

  it("stöder även /api/check-pairing för direktåtkomst och bypass", async () => {
    const res = await fetchTestRoute(app, "/api/check-pairing");
    expect(res.status).toBe(200);
    const data = (await res.json()) as Record<string, unknown>;
    expect(data.active).toBe(true);
    expect(data.status).toBe("approved");
  });

  it("returnerar { active: true, status: 'approved' } när NODE_ENV === 'development'", async () => {
    process.env.NODE_ENV = "development";
    const res = await fetchTestRoute(app, "/api/admin/check-pairing?token=random_unpaired_token", {
      headers: { Host: "public-remote-domain.com" }
    });
    expect(res.status).toBe(200);
    const data = (await res.json()) as Record<string, unknown>;
    expect(data.active).toBe(true);
    expect(data.status).toBe("approved");
    expect(data.paired).toBe(true);
  });
});

async function fetchTestRoute(
  app: express.Express,
  path: string,
  options?: { headers?: Record<string, string> }
): Promise<{ status: number; json: () => Promise<Record<string, unknown>> }> {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        return reject(new Error("Kunde inte binda port"));
      }
      const port = address.port;
      fetch(`http://127.0.0.1:${port}${path}`, {
        method: "GET",
        headers: options?.headers
      })
        .then(res => {
          server.close(() => {
            resolve({
              status: res.status,
              json: () => res.json() as Promise<Record<string, unknown>>
            });
          });
        })
        .catch(err => {
          server.close();
          reject(err);
        });
    });
  });
}
