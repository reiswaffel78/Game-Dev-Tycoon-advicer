import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { storage } from "./storage";
import {
  getRecommendationsByTopic,
  getRecommendationsByGenre,
  getRecommendationsByPlatform,
  getSliderPresets,
  getTopCombinations,
} from "./recommendation-engine";

type SSRModule = {
  render: (
    url: string,
    prefetchedQueries?: Record<string, unknown>
  ) => Promise<{
    html: string;
    helmet: any;
    i18nLanguage: string;
    statusCode: number;
    dehydratedState: unknown;
  }>;
};

const SUPPORTED_LOCALES = [
  "en", "de", "fr", "it", "es", "ko", "ja", "zh",
  "hi", "tr", "pt", "ru", "cs", "nl", "ar", "el",
  "hu", "pl", "sv",
] as const;
const DEFAULT_LOCALE = "en";

function normalizeLocalizedUrl(originalUrl: string): string {
  const url = new URL(originalUrl, "http://localhost");
  const pathname = url.pathname;
  const trimmed =
    pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const segments = trimmed.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  const hasLocaleSegment =
    lastSegment && SUPPORTED_LOCALES.includes(lastSegment as (typeof SUPPORTED_LOCALES)[number]);
  const locale = hasLocaleSegment ? lastSegment : DEFAULT_LOCALE;
  const baseSegments = hasLocaleSegment ? segments.slice(0, -1) : segments;
  const basePath = baseSegments.length ? `/${baseSegments.join("/")}` : "/";

  if (hasLocaleSegment && locale !== DEFAULT_LOCALE) {
    const normalized =
      basePath === "/" ? `/${locale}/` : `${basePath}/${locale}/`;
    return `${normalized}${url.search}${url.hash}`;
  }

  const normalizedBase = basePath === "/" ? "/" : basePath;
  return `${normalizedBase}${url.search}${url.hash}`;
}

function getLastUpdate(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function prefetchForRoute(basePath: string): Promise<Record<string, unknown>> {
  const queries: Record<string, unknown> = {};
  try {
    if (basePath === "/") {
      const [stats, combos] = await Promise.all([
        storage.getStats(),
        getTopCombinations(),
      ]);
      queries["/api/stats"] = { ...stats, lastUpdate: getLastUpdate() };
      queries["/api/top-combos"] = combos;
    } else if (basePath === "/research") {
      queries["/api/research"] = await storage.getAllResearchItems();
    } else if (basePath === "/staff") {
      queries["/api/staff-tips"] = await storage.getAllStaffTips();
    } else if (basePath === "/timeline") {
      queries["/api/timeline"] = await storage.getAllTimelineMilestones();
    }

    const topicMatch = basePath.match(/^\/recommend\/topic\/([^/]+)$/);
    if (topicMatch) {
      const topicId = topicMatch[1];
      const [recs, topics] = await Promise.all([
        getRecommendationsByTopic(topicId),
        storage.getAllTopics(),
      ]);
      queries[JSON.stringify(["/api/recommend/topic", topicId])] = recs;
      queries[JSON.stringify(["/api/topics"])] = topics;
    }

    const genreMatch = basePath.match(/^\/recommend\/genre\/([^/]+)$/);
    if (genreMatch) {
      const genreId = genreMatch[1];
      const [recs, genres] = await Promise.all([
        getRecommendationsByGenre(genreId),
        storage.getAllGenres(),
      ]);
      queries[JSON.stringify(["/api/recommend/genre", genreId])] = recs;
      queries[JSON.stringify(["/api/genres"])] = genres;
    }

    const platformMatch = basePath.match(/^\/recommend\/platform\/([^/]+)$/);
    if (platformMatch) {
      const platformId = platformMatch[1];
      const [recs, platforms] = await Promise.all([
        getRecommendationsByPlatform(platformId),
        storage.getAllPlatforms(),
      ]);
      queries[JSON.stringify(["/api/recommend/platform", platformId])] = recs;
      queries[JSON.stringify(["/api/platforms"])] = platforms;
    }

    const sliderMatch = basePath.match(/^\/sliders\/([^/]+)$/);
    if (sliderMatch) {
      const genreId = sliderMatch[1];
      const [presets, genres] = await Promise.all([
        getSliderPresets(genreId),
        storage.getAllGenres(),
      ]);
      queries[JSON.stringify(["/api/sliders", genreId])] = presets;
      queries[JSON.stringify(["/api/genres"])] = genres;
    }
  } catch (err) {
    console.error("[SSR] Prefetch error for route", basePath, err);
  }
  return queries;
}

let ssrModule: SSRModule | null = null;
let ssrModuleError: Error | null = null;

export async function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  const ssrBundlePath = path.resolve(__dirname, "entry-server.js");
  
  console.log("[SSR] Initializing static server");
  console.log("[SSR] distPath:", distPath);
  console.log("[SSR] ssrBundlePath:", ssrBundlePath);
  console.log("[SSR] distPath exists:", fs.existsSync(distPath));
  console.log("[SSR] ssrBundle exists:", fs.existsSync(ssrBundlePath));
  
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Load SSR module synchronously before accepting requests
  if (fs.existsSync(ssrBundlePath)) {
    const ssrModuleUrl = pathToFileURL(ssrBundlePath).href;
    console.log("[SSR] Loading SSR module from:", ssrModuleUrl);
    
    try {
      ssrModule = await import(ssrModuleUrl);
      console.log("[SSR] SSR module loaded successfully");
      console.log("[SSR] SSR module has render function:", typeof ssrModule?.render === "function");
    } catch (err) {
      ssrModuleError = err as Error;
      console.error("[SSR] Failed to load SSR module:", err);
    }
  } else {
    console.warn("[SSR] SSR bundle not found, will serve SPA only");
  }

  // Serve static files but disable index to let SSR handle HTML pages
  app.use(express.static(distPath, { index: false }));

  // SSR for content routes
  app.use("/{*path}", async (req, res) => {
    const url = req.originalUrl;
    
    // API routes are handled by their own Express handlers before this middleware
    if (url.startsWith("/api/")) {
      return res.sendStatus(404);
    }

    // Requests with a file extension that weren't served by express.static
    // (i.e. the file doesn't exist) should return a real 404, not the app shell.
    // This prevents soft-404 crawl noise for probes like /ads.txt, /security.txt,
    // broken asset URLs, etc.
    if (url.includes(".")) {
      return res.sendStatus(404);
    }

    const normalizedUrl = normalizeLocalizedUrl(url);
    if (normalizedUrl !== url) {
      return res.redirect(301, normalizedUrl);
    }
    
    try {
      if (ssrModuleError) {
        console.error("[SSR] Using SPA fallback due to module load error:", ssrModuleError.message);
        return res.sendFile(path.resolve(distPath, "index.html"));
      }
      
      if (!ssrModule || typeof ssrModule.render !== "function") {
        console.log("[SSR] Module not available or no render function, serving SPA");
        return res.sendFile(path.resolve(distPath, "index.html"));
      }
      
      const template = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");
      
      console.log("[SSR] Rendering route:", url);

      // Determine basePath for prefetch (strip locale suffix)
      const { pathname } = new URL(url, "http://localhost");
      const segments = pathname.replace(/\/$/, "").split("/").filter(Boolean);
      const last = segments[segments.length - 1];
      const isLocale = SUPPORTED_LOCALES.includes(last as (typeof SUPPORTED_LOCALES)[number]);
      const basePath = isLocale
        ? (segments.slice(0, -1).length ? `/${segments.slice(0, -1).join("/")}` : "/")
        : (segments.length ? `/${segments.join("/")}` : "/");

      // Prefetch route-specific data from storage
      const prefetchedQueries = await prefetchForRoute(basePath);
      
      // Render the app with prefetched data
      const { html: appHtml, helmet, i18nLanguage, statusCode, dehydratedState } =
        await ssrModule.render(url, prefetchedQueries);
      
      console.log("[SSR] Render complete. HTML length:", appHtml?.length || 0);
      
      // Build head tags from helmet
      const helmetHead = [
        helmet?.title?.toString() || "",
        helmet?.meta?.toString() || "",
        helmet?.link?.toString() || "",
        helmet?.script?.toString() || "",
      ].filter(Boolean).join("\n");
      
      let finalHtml = template;
      
      // Inject HTML attributes (e.g., lang)
      const htmlAttrs = helmet?.htmlAttributes?.toString() || "";
      if (htmlAttrs) {
        finalHtml = finalHtml.replace("<html", `<html ${htmlAttrs}`);
      }
      
      // Inject body attributes
      const bodyAttrs = helmet?.bodyAttributes?.toString() || "";
      if (bodyAttrs) {
        finalHtml = finalHtml.replace("<body", `<body ${bodyAttrs}`);
      }
      
      // Inject helmet head tags before </head>
      finalHtml = finalHtml.replace(
        "</head>",
        `${helmetHead}\n</head>`
      );

      const i18nScript = `<script>window.__I18N_INITIAL_LANGUAGE__ = ${JSON.stringify(
        i18nLanguage
      )};</script>`;

      const dehydratedScript = `<script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(
        dehydratedState
      )};</script>`;

      finalHtml = finalHtml.replace("</body>", `${i18nScript}\n${dehydratedScript}\n</body>`);
      
      // Inject the rendered app HTML into the template
      finalHtml = finalHtml.replace(
        `<div id="root"></div>`,
        `<div id="root">${appHtml}</div>`
      );
      
      console.log("[SSR] Sending response for:", url, "- Status:", statusCode, "- Total HTML length:", finalHtml.length);
      res.status(statusCode).set({ "Content-Type": "text/html" }).send(finalHtml);
    } catch (error) {
      console.error("[SSR] Rendering error for URL:", url);
      console.error("[SSR] Error details:", error);
      // Fallback to SPA mode on error
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  });
}
