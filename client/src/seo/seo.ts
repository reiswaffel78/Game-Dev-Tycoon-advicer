import {
  buildLocalizedPath,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/lib/locale";

export const BASE_URL = "https://gamedevtycoonadvisor.com";

export const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  de: "de_DE",
  fr: "fr_FR",
  it: "it_IT",
  es: "es_ES",
  ko: "ko_KR",
  ja: "ja_JP",
  zh: "zh_CN",
  hi: "hi_IN",
  tr: "tr_TR",
  pt: "pt_PT",
  ru: "ru_RU",
  cs: "cs_CZ",
  nl: "nl_NL",
  ar: "ar_SA",
  el: "el_GR",
  hu: "hu_HU",
  pl: "pl_PL",
  sv: "sv_SE",
};

export type PageKey =
  | "dashboard"
  | "topicRecommender"
  | "genreRecommender"
  | "platformRecommender"
  | "sliders"
  | "planner"
  | "research"
  | "staff"
  | "timeline"
  | "checklist"
  | "faq"
  | "handbuch"
  | "appGuide"
  | "privacy"
  | "sources";

export interface SeoPageConfig {
  path: string;
  titleKey: string;
  descriptionKey: string;
}

export const SEO_CONFIG: Record<PageKey, SeoPageConfig> = {
  dashboard: {
    path: "/",
    titleKey: "dashboard.title",
    descriptionKey: "dashboard.subtitle",
  },
  topicRecommender: {
    path: "/recommend/topic",
    titleKey: "nav.topicRecommender",
    descriptionKey: "dashboard.getStartedDesc",
  },
  genreRecommender: {
    path: "/recommend/genre",
    titleKey: "nav.genreRecommender",
    descriptionKey: "dashboard.getStartedDesc",
  },
  platformRecommender: {
    path: "/recommend/platform",
    titleKey: "nav.platformRecommender",
    descriptionKey: "dashboard.getStartedDesc",
  },
  sliders: {
    path: "/sliders",
    titleKey: "sliders.title",
    descriptionKey: "sliders.subtitle",
  },
  planner: {
    path: "/planner",
    titleKey: "planner.title",
    descriptionKey: "planner.subtitle",
  },
  research: {
    path: "/research",
    titleKey: "research.title",
    descriptionKey: "research.subtitle",
  },
  staff: {
    path: "/staff",
    titleKey: "staff.title",
    descriptionKey: "staff.subtitle",
  },
  timeline: {
    path: "/timeline",
    titleKey: "timeline.title",
    descriptionKey: "timeline.subtitle",
  },
  checklist: {
    path: "/checklist",
    titleKey: "checklist.title",
    descriptionKey: "checklist.subtitle",
  },
  faq: {
    path: "/faq",
    titleKey: "faq.title",
    descriptionKey: "faq.subtitle",
  },
  handbuch: {
    path: "/handbuch",
    titleKey: "manual.title",
    descriptionKey: "manual.subtitle",
  },
  appGuide: {
    path: "/app-guide",
    titleKey: "appGuide.title",
    descriptionKey: "appGuide.subtitle",
  },
  privacy: {
    path: "/privacy",
    titleKey: "privacy.title",
    descriptionKey: "privacy.subtitle",
  },
  sources: {
    path: "/sources",
    titleKey: "sources.title",
    descriptionKey: "sources.subtitle",
  },
};

export function getSeoConfig(pageKey: PageKey): SeoPageConfig {
  return SEO_CONFIG[pageKey];
}

export function getCanonicalPath(pageKey: PageKey, locale: Locale): string {
  return buildLocalizedPath(SEO_CONFIG[pageKey].path, locale);
}

export function getCanonicalUrl(pageKey: PageKey, locale: Locale): string {
  return `${BASE_URL}${getCanonicalPath(pageKey, locale)}`;
}

export function getHreflangLinks(pageKey: PageKey): Array<{
  locale: Locale;
  href: string;
}> {
  const { path } = SEO_CONFIG[pageKey];
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
    href: `${BASE_URL}${buildLocalizedPath(path, locale)}`,
  }));
}

export function getXDefaultHref(pageKey: PageKey): string {
  return `${BASE_URL}${buildLocalizedPath(
    SEO_CONFIG[pageKey].path,
    DEFAULT_LOCALE,
  )}`;
}
