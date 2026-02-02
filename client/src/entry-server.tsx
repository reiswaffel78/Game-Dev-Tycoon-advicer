import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import App from "./App";

// Static location hook for wouter SSR
const staticLocationHook = (url: string): [string, (to: string) => void] => {
  return [url, () => {}];
};

interface RenderResult {
  html: string;
  helmet: HelmetServerState;
}

export function render(url: string): RenderResult {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <Router hook={() => staticLocationHook(url)}>
        <App />
      </Router>
    </HelmetProvider>
  );

  return {
    html,
    helmet: helmetContext.helmet!,
  };
}
