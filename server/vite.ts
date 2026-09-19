import express, { type Express } from "express";
import fs from "fs";
import path from "path";

import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { injectHead, resolveHead } from "./seo";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const seo = await resolveHead(pathOf(req.originalUrl));
      if (seo.redirect) {
        return res.redirect(301, seo.redirect + queryOf(req.originalUrl));
      }
      const page = await vite.transformIndexHtml(url, injectHead(template, seo));
      res.status(seo.status).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

// NB: inside app.use("*", …) Express strips the mount path, so req.path is
// always "/". The real pathname has to come from originalUrl.
function pathOf(originalUrl: string): string {
  const i = originalUrl.indexOf("?");
  return i === -1 ? originalUrl : originalUrl.slice(0, i);
}

function queryOf(originalUrl: string): string {
  const i = originalUrl.indexOf("?");
  return i === -1 ? "" : originalUrl.slice(i);
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  const template = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");

  // `index: false` so "/" goes through the SEO handler below instead of
  // serving the raw, un-injected index.html.
  app.use(
    express.static(distPath, {
      index: false,
      setHeaders: (res, filePath) => {
        // Vite fingerprints everything under /assets, so it is safe to cache forever.
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    }),
  );

  // Anything with a file extension that static serving did not find is a real
  // 404 — not the app shell. (Otherwise /missing.png answers 200 with HTML.)
  app.use((req, res, next) => {
    if (/\.[a-z0-9]{1,8}$/i.test(pathOf(req.originalUrl))) {
      return res.status(404).type("text/plain").send("Not found");
    }
    next();
  });

  // Every other URL is an SPA route: inject its <head>, and answer with the
  // correct status (200 / 301 / 404) so crawlers never index soft-404s.
  app.use("*", async (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    try {
      const seo = await resolveHead(pathOf(req.originalUrl));
      if (seo.redirect) {
        return res.redirect(301, seo.redirect + queryOf(req.originalUrl));
      }
      res
        .status(seo.status)
        .set({
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache",
          Vary: "Accept-Encoding",
        })
        .send(injectHead(template, seo));
    } catch (err) {
      next(err);
    }
  });
}
