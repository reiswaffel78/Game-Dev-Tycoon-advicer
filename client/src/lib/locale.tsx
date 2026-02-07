import { useSyncExternalStore, useCallback, useEffect } from "react";
import i18n from "./i18n";

export const SUPPORTED_LOCALES = ["en", "de", "fr"] as const;
export const DEFAULT_LOCALE = "en";
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function isLocale(s: string): s is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(s);
}

export function extractLocaleFromPath(path: string): {
  locale: Locale;
  basePath: string;
} {
  const clean = path.split("?")[0].split("#")[0];
  const noTrailing =
    clean.length > 1 && clean.endsWith("/") ? clean.slice(0, -1) : clean;
  const segs = noTrailing.split("/").filter(Boolean);
  const last = segs[segs.length - 1];
  if (last && isLocale(last) && last !== DEFAULT_LOCALE) {
    const base = segs.slice(0, -1).join("/");
    return { locale: last, basePath: base ? "/" + base : "/" };
  }
  return { locale: DEFAULT_LOCALE, basePath: noTrailing || "/" };
}

export function buildLocalizedPath(
  basePath: string,
  locale: Locale,
): string {
  if (locale === DEFAULT_LOCALE) return basePath;
  return `${basePath === "/" ? "" : basePath}/${locale}/`;
}

const subscribe = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  return () => window.removeEventListener("popstate", cb);
};

export function useLocaleLocation(): [
  string,
  (to: string, options?: { replace?: boolean }) => void,
] {
  const pathname = useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => "/",
  );
  const { locale, basePath } = extractLocaleFromPath(pathname);

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  const navigate = useCallback(
    (to: string, options?: { replace?: boolean }) => {
      const target = buildLocalizedPath(to, locale);
      if (options?.replace) {
        window.history.replaceState(null, "", target);
      } else {
        window.history.pushState(null, "", target);
      }
      window.dispatchEvent(new PopStateEvent("popstate"));
    },
    [locale],
  );

  return [basePath, navigate];
}
