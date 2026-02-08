import React from "react";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import type { HelmetServerState } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import App from "./App";
import { extractLocaleFromPath } from "@/lib/locale";
import { createI18nInstance, initI18n } from "@/lib/i18n";

interface RenderResult {
  html: string;
  helmet: HelmetServerState;
  i18nLanguage: string;
}

export async function render(url: string): Promise<RenderResult> {
  const { locale, basePath } = extractLocaleFromPath(url);

  const i18n = await initI18n(createI18nInstance(), locale);

  const staticHook = (): [string, (to: string) => void] => {
    return [basePath, () => {}];
  };

  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <I18nextProvider i18n={i18n}>
        <Router hook={staticHook}>
          <App />
        </Router>
      </I18nextProvider>
    </HelmetProvider>
  );

  return {
    html,
    helmet: helmetContext.helmet!,
    i18nLanguage: i18n.language,
  };
}
