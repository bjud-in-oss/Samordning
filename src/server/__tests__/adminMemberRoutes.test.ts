import { describe, it, expect, beforeEach } from "vitest";
import express from "express";
import { setupRoutes } from "../routes";
import { adminNumbers, trustedNumbers, API_SECRET } from "../storage";

describe("Admin Member Routes & Security", () => {
  let app: express.Express;

  beforeEach(() => {
    adminNumbers.length = 0;
    trustedNumbers.length = 0;
    adminNumbers.push("+46701111111");
    trustedNumbers.push("+46702222222");

    app = express();
    app.use(express.json());
    setupRoutes(app);
  });

  it("returnerar medlemmar via GET /api/admin/members", async () => {
    const res = await fetchMemberRoute(app, "/api/admin/members");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.admins).toContain("+46701111111");
    expect(data.trusted).toContain("+46702222222");
  });

  it("kräver API_SECRET för GET /api/admin/verified-senders", async () => {
    // Utan hemlighet -> 401
    const resUnauthorized = await fetchMemberRoute(app, "/api/admin/verified-senders");
    expect(resUnauthorized.status).toBe(401);

    // Med Bearer hemlighet -> 200 med E.164-nummer
    const resAuthorized = await fetchMemberRoute(app, "/api/admin/verified-senders", {
      headers: { Authorization: `Bearer ${API_SECRET}` }
    });
    expect(resAuthorized.status).toBe(200);
    const data = await resAuthorized.json();
    expect(data.verifiedSenders).toContain("+46701111111");
  });

  it("tillåter samordnare att lägga till och ta bort 'trusted' utan gateway-hemlighet", async () => {
    // Lägg till betrodd
    const addRes = await fetchMemberRoute(app, "/api/admin/members/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "0703333333", role: "trusted" })
    });
    expect(addRes.status).toBe(200);
    expect(trustedNumbers).toContain("0703333333");

    // Ta bort betrodd
    const removeRes = await fetchMemberRoute(app, "/api/admin/members/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "0703333333", role: "trusted" })
    });
    expect(removeRes.status).toBe(200);
    expect(trustedNumbers).not.toContain("0703333333");
  });

  it("nekar hantering av 'admin'-roll om gateway-behörighet saknas", async () => {
    // Försök lägga till admin utan behörighet -> 403
    const addRes = await fetchMemberRoute(app, "/api/admin/members/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "0704444444", role: "admin" })
    });
    expect(addRes.status).toBe(403);
    expect(adminNumbers).not.toContain("0704444444");

    // Försök ta bort admin utan behörighet -> 403
    const removeRes = await fetchMemberRoute(app, "/api/admin/members/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "+46701111111", role: "admin" })
    });
    expect(removeRes.status).toBe(403);
    expect(adminNumbers).toContain("+46701111111");
  });

  it("tillåter hantering av 'admin'-roll när gateway-behörighet tillhandahålls", async () => {
    // Lägg till admin med gateway header
    const addRes = await fetchMemberRoute(app, "/api/admin/members/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-gateway-secret": API_SECRET
      },
      body: JSON.stringify({ phone: "0704444444", role: "admin" })
    });
    expect(addRes.status).toBe(200);
    expect(adminNumbers).toContain("0704444444");

    // Ta bort admin med gateway header
    const removeRes = await fetchMemberRoute(app, "/api/admin/members/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_SECRET}`
      },
      body: JSON.stringify({ phone: "0704444444", role: "admin" })
    });
    expect(removeRes.status).toBe(200);
    expect(adminNumbers).not.toContain("0704444444");
  });
});

// Enkel in-memory fetcher för Express testapp utan extern serverlyssnare
async function fetchMemberRoute(
  app: express.Express,
  path: string,
  options?: { method?: string; headers?: Record<string, string>; body?: string }
): Promise<{ status: number; json: () => Promise<any> }> {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        return reject(new Error("Kunde inte binda port"));
      }
      const port = address.port;
      fetch(`http://127.0.0.1:${port}${path}`, {
        method: options?.method || "GET",
        headers: options?.headers,
        body: options?.body
      })
        .then(res => {
          server.close(() => {
            resolve({
              status: res.status,
              json: () => res.json()
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
