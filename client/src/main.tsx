import { createRoot, hydrateRoot } from "react-dom/client";
import { Router } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { useLocaleLocation } from "@/lib/locale";
import "./index.css";

const container = document.getElementById("root")!;

if (container.hasChildNodes()) {
  hydrateRoot(
    container,
    <HelmetProvider>
      <Router hook={useLocaleLocation}>
        <App />
      </Router>
    </HelmetProvider>
  );
} else {
  createRoot(container).render(
    <HelmetProvider>
      <Router hook={useLocaleLocation}>
        <App />
      </Router>
    </HelmetProvider>
  );
}
