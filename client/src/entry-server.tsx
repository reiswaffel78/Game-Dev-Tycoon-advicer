import React from "react";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import type { HelmetServerState } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import { QueryClient, QueryClientProvider, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import AppSSR from "./AppSSR";
import { extractLocaleFromPath } from "@/lib/locale";
import { createI18nInstance, initI18n } from "@/lib/i18n";

const KNOWN_ROUTES = new Set([
  "/",
  "/recommend/topic",
  "/recommend/genre",
  "/recommend/platform",
  "/sliders",
  "/game-dev-tycoon-guide",
  "/game-dev-tycoon-best-combos",
  "/game-dev-tycoon-sliders",
  "/game-dev-tycoon-research-order",
  "/planner",
  "/research",
  "/staff",
  "/timeline",
  "/checklist",
  "/faq",
  "/handbuch",
  "/app-guide",
  "/sources",
  "/privacy",
]);

function isKnownRoute(basePath: string): boolean {
  if (KNOWN_ROUTES.has(basePath)) return true;
  if (/^\/recommend\/topic\/[^/]+$/.test(basePath)) return true;
  if (/^\/recommend\/genre\/[^/]+$/.test(basePath)) return true;
  if (/^\/recommend\/platform\/[^/]+$/.test(basePath)) return true;
  if (/^\/sliders\/[^/]+$/.test(basePath)) return true;
  return false;
}

interface RenderResult {
  html: string;
  helmet: HelmetServerState;
  i18nLanguage: string;
  statusCode: number;
  dehydratedState: unknown;
}

export async function render(
  url: string,
  prefetchedQueries?: Record<string, unknown>
): Promise<RenderResult> {
  const { locale, basePath } = extractLocaleFromPath(url);

  const i18n = await initI18n(createI18nInstance(), locale);

  const staticHook = (): [string, (to: string) => void] => {
    return [basePath, () => {}];
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: false,
      },
    },
  });

  if (prefetchedQueries) {
    for (const [key, data] of Object.entries(prefetchedQueries)) {
      let queryKey: unknown[];
      try {
        const parsed = JSON.parse(key);
        queryKey = Array.isArray(parsed) ? parsed : [key];
      } catch {
        queryKey = [key];
      }
      queryClient.setQueryData(queryKey, data);
    }
  }

  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <I18nextProvider i18n={i18n}>
        <Router hook={staticHook}>
          <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <AppSSR />
            </HydrationBoundary>
          </QueryClientProvider>
        </Router>
      </I18nextProvider>
    </HelmetProvider>
  );

  const dehydratedState = dehydrate(queryClient);
  queryClient.clear();

  const statusCode = isKnownRoute(basePath) ? 200 : 404;

  return {
    html,
    helmet: helmetContext.helmet!,
    i18nLanguage: i18n.language,
    statusCode,
    dehydratedState,
  };
}
