import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve static files but disable index to let SSR handle HTML pages
  app.use(express.static(distPath, { index: false }));

  // SSR for content routes
  app.use("/{*path}", async (req, res) => {
    const url = req.originalUrl;
    
    try {
      // Load the SSR bundle (built by vite build --ssr)
      const ssrManifestPath = path.resolve(__dirname, "entry-server.js");
      
      if (fs.existsSync(ssrManifestPath)) {
        // SSR mode - render the app server-side
        // Use file:// URL for proper ESM import from CJS context
        const ssrModuleUrl = pathToFileURL(ssrManifestPath).href;
        const { render } = await import(ssrModuleUrl);
        const template = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");
        
        const { html: appHtml, helmet } = render(url);
        
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
        
        res.status(200).set({ "Content-Type": "text/html" }).send(finalHtml);
      } else {
        // Fallback to SPA mode if SSR bundle not found
        console.warn("[SSR] SSR bundle not found at:", ssrManifestPath, "- serving SPA fallback");
        res.sendFile(path.resolve(distPath, "index.html"));
      }
    } catch (error) {
      console.error("[SSR] Rendering error for URL:", url);
      console.error("[SSR] Error details:", error);
      // Fallback to SPA mode on error
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  });
}
