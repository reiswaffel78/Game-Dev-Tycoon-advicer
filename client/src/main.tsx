import { createRoot, hydrateRoot } from "react-dom/client";
import { Router } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import { QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import App from "./App";
import { queryClient } from "@/lib/queryClient";
import { useLocaleLocation } from "@/lib/locale";
import { initClientI18n } from "@/lib/i18n";
import "./index.css";

const container = document.getElementById("root")!;

declare global {
  interface Window {
    __REACT_QUERY_STATE__?: unknown;
    __I18N_INITIAL_LANGUAGE__?: string;
  }
}

const dehydratedState = window.__REACT_QUERY_STATE__;

void initClientI18n().then((i18n) => {
  const tree = (
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <Router hook={useLocaleLocation}>
          <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydratedState}>
              <App />
            </HydrationBoundary>
          </QueryClientProvider>
        </Router>
      </I18nextProvider>
    </HelmetProvider>
  );

  if (container.hasChildNodes()) {
    hydrateRoot(container, tree);
  } else {
    createRoot(container).render(tree);
  }
});
