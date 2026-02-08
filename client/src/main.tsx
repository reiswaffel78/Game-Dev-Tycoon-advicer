import { createRoot, hydrateRoot } from "react-dom/client";
import { Router } from "wouter";
import HelmetAsync from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import App from "./App";
import { useLocaleLocation } from "@/lib/locale";
import { initClientI18n } from "@/lib/i18n";
import "./index.css";

const { HelmetProvider } = HelmetAsync;

const container = document.getElementById("root")!;

void initClientI18n().then((i18n) => {
  if (container.hasChildNodes()) {
    hydrateRoot(
      container,
      <HelmetProvider>
        <I18nextProvider i18n={i18n}>
          <Router hook={useLocaleLocation}>
            <App />
          </Router>
        </I18nextProvider>
      </HelmetProvider>,
    );
  } else {
    createRoot(container).render(
      <HelmetProvider>
        <I18nextProvider i18n={i18n}>
          <Router hook={useLocaleLocation}>
            <App />
          </Router>
        </I18nextProvider>
      </HelmetProvider>,
    );
  }
});
