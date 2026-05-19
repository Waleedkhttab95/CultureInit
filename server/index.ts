import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import helmet from "helmet";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initSheetHeaders, isGoogleSheetsConfigured } from "./google-sheets";
import { buildSessionMiddleware } from "./auth";

const app = express();

// Express sits behind Render's proxy — required for secure cookies and for
// rate-limit / IP detection to work correctly.
app.set("trust proxy", 1);

// Security headers. CSP is intentionally left off to avoid breaking the
// existing Vite SPA and externally-hosted article images; the other
// protections (no-sniff, frameguard, HSTS, referrer policy) still apply.
// Tightening CSP is a recommended future hardening step.
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

// Session (admin auth + CSRF). Must come before route registration.
app.use(buildSessionMiddleware());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Serve project assets (PDFs, images) for downloads
  app.use(
    "/attached_assets",
    express.static(path.resolve(import.meta.dirname, "..", "attached_assets")),
  );

  // Serve uploaded CVs/resumes from persistent disk
  app.use(
    "/uploads",
    express.static("/uploads"),
  );

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    // Log server-side, but never leak internal error details to clients.
    console.error("[error]", err);
    if (res.headersSent) return;
    const message =
      status >= 500 ? "Internal Server Error" : err.message || "Request failed";
    res.status(status).json({ error: message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '3000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, async () => {
    log(`serving on port ${port}`);
    if (await isGoogleSheetsConfigured()) {
      await initSheetHeaders();
      log("Google Sheets integration active");
    }
  });
})();
