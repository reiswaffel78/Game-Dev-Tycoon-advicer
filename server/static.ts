import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

type SSRModule = { render: (url: string) => { html: string; helmet: any } };

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
    
    // Skip SSR for API routes and static assets
    if (url.startsWith("/api/") || url.includes(".")) {
      return res.sendFile(path.resolve(distPath, "index.html"));
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
      
      // Render the app
      const { html: appHtml, helmet } = ssrModule.render(url);
      
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
      
      // Inject the rendered app HTML into the template
      finalHtml = finalHtml.replace(
        `<div id="root"></div>`,
        `<div id="root">${appHtml}</div>`
      );
      
      console.log("[SSR] Sending response for:", url, "- Total HTML length:", finalHtml.length);
      res.status(200).set({ "Content-Type": "text/html" }).send(finalHtml);
    } catch (error) {
      console.error("[SSR] Rendering error for URL:", url);
      console.error("[SSR] Error details:", error);
      // Fallback to SPA mode on error
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  });
}
