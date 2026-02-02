import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // SSR for content routes
  app.use("/{*path}", async (req, res) => {
    const url = req.originalUrl;
    
    try {
      // Load the SSR bundle (built by vite build --ssr)
      const ssrManifestPath = path.resolve(__dirname, "entry-server.js");
      
      if (fs.existsSync(ssrManifestPath)) {
        // SSR mode - render the app server-side
        const { render } = await import(ssrManifestPath);
        const template = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");
        
        const { html: appHtml, helmet } = render(url);
        
        // Build head tags from helmet
        const helmetHead = [
          helmet?.title?.toString() || "",
          helmet?.meta?.toString() || "",
          helmet?.link?.toString() || "",
        ].filter(Boolean).join("\n");
        
        // Inject helmet head tags before </head>
        let finalHtml = template.replace(
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
        res.sendFile(path.resolve(distPath, "index.html"));
      }
    } catch (error) {
      console.error("SSR Error:", error);
      // Fallback to SPA mode on error
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  });
}
