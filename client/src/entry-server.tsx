import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import App from "./App";
import { extractLocaleFromPath } from "@/lib/locale";
import i18n from "@/lib/i18n";

interface RenderResult {
  html: string;
  helmet: HelmetServerState;
}

export function render(url: string): RenderResult {
  const { locale, basePath } = extractLocaleFromPath(url);

  i18n.changeLanguage(locale);

  const staticHook = (): [string, (to: string) => void] => {
    return [basePath, () => {}];
  };

  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <Router hook={staticHook}>
        <App />
      </Router>
    </HelmetProvider>
  );

  return {
    html,
    helmet: helmetContext.helmet!,
  };
}
