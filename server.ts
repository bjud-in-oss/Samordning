// [server.ts] - Express Entry Point with Vite Integration

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initServerStorage } from "./src/server/storage";
import { setupRoutes } from "./src/server/routes";
import { initWebPush } from "./src/main/services/pushService";

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize storage & push notification background timers
  initServerStorage();
  initWebPush();

  // Setup Express API Endpoints
  setupRoutes(app);

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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ge stöd Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start Express server", err);
});
