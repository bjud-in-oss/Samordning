// [server.ts] - Express Entry Point with Vite Integration & Serverless Cloud Functions support

import express from "express";
import http from "http";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initServerStorage } from "./src/server/storage";
import { setupRoutes } from "./src/server/routes";
import { initWebPush } from "./src/main/services/pushService";
import { setupTranslationWebSocket } from "./src/server/translationServer";

const PORT = 3000;

export function createApp(): express.Express {
  const app = express();
  app.use(express.json());

  // Initialize storage & push notification background timers
  initServerStorage();
  initWebPush();

  // Setup Express API Endpoints
  setupRoutes(app);

  return app;
}

export const app = createApp();
export const httpServer = http.createServer(app);

// Mount WebSocketServer for translation directly on Express HTTP server at /ws/translation
export const translationWss = setupTranslationWebSocket(httpServer);

async function startServer() {
  // Serve Vite frontend in development, static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Ge stöd Server listening on http://0.0.0.0:${PORT} (WS: /ws/translation)`);
  });
}

const isDirectRun = process.argv[1] && (process.argv[1].endsWith("server.ts") || process.argv[1].endsWith("server.cjs") || process.argv[1].endsWith("server.js"));
if (isDirectRun && process.env.FIREBASE_FUNCTION !== "true" && process.env.NODE_ENV !== "test") {
  startServer().catch(err => {
    console.error("Failed to start Express server", err);
  });
}
