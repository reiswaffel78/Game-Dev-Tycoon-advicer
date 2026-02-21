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
  | "guide"
  | "bestCombos"
  | "slidersExplained"
  | "researchOrder"
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
  titleSuffixKey: string;
  schemaType?: "WebApplication" | "Article";
}

export const SEO_CONFIG: Record<PageKey, SeoPageConfig> = {
  dashboard: {
    path: "/",
    titleKey: "dashboard.title",
    descriptionKey: "dashboard.subtitle",
    titleSuffixKey: "seo.suffix.dashboard",
  },
  topicRecommender: {
    path: "/recommend/topic",
    titleKey: "nav.topicRecommender",
    descriptionKey: "dashboard.getStartedDesc",
    titleSuffixKey: "seo.suffix.topicRecommender",
  },
  genreRecommender: {
    path: "/recommend/genre",
    titleKey: "nav.genreRecommender",
    descriptionKey: "dashboard.getStartedDesc",
    titleSuffixKey: "seo.suffix.genreRecommender",
  },
  platformRecommender: {
    path: "/recommend/platform",
    titleKey: "nav.platformRecommender",
    descriptionKey: "dashboard.getStartedDesc",
    titleSuffixKey: "seo.suffix.platformRecommender",
  },
  sliders: {
    path: "/sliders",
    titleKey: "sliders.title",
    descriptionKey: "sliders.subtitle",
    titleSuffixKey: "seo.suffix.sliders",
  },
  guide: {
    path: "/game-dev-tycoon-guide",
    titleKey: "guide.title",
    descriptionKey: "guide.subtitle",
    titleSuffixKey: "seo.suffix.guide",
    schemaType: "Article",
  },
  bestCombos: {
    path: "/game-dev-tycoon-best-combos",
    titleKey: "bestCombos.title",
    descriptionKey: "bestCombos.subtitle",
    titleSuffixKey: "seo.suffix.bestCombos",
    schemaType: "Article",
  },
  slidersExplained: {
    path: "/game-dev-tycoon-sliders",
    titleKey: "slidersExplained.title",
    descriptionKey: "slidersExplained.subtitle",
    titleSuffixKey: "seo.suffix.slidersExplained",
    schemaType: "Article",
  },
  researchOrder: {
    path: "/game-dev-tycoon-research-order",
    titleKey: "researchOrder.title",
    descriptionKey: "researchOrder.subtitle",
    titleSuffixKey: "seo.suffix.researchOrder",
    schemaType: "Article",
  },
  planner: {
    path: "/planner",
    titleKey: "planner.title",
    descriptionKey: "planner.subtitle",
    titleSuffixKey: "seo.suffix.planner",
  },
  research: {
    path: "/research",
    titleKey: "research.title",
    descriptionKey: "research.subtitle",
    titleSuffixKey: "seo.suffix.research",
  },
  staff: {
    path: "/staff",
    titleKey: "staff.title",
    descriptionKey: "staff.subtitle",
    titleSuffixKey: "seo.suffix.staff",
  },
  timeline: {
    path: "/timeline",
    titleKey: "timeline.title",
    descriptionKey: "timeline.subtitle",
    titleSuffixKey: "seo.suffix.timeline",
  },
  checklist: {
    path: "/checklist",
    titleKey: "checklist.title",
    descriptionKey: "checklist.subtitle",
    titleSuffixKey: "seo.suffix.checklist",
  },
  faq: {
    path: "/faq",
    titleKey: "faq.title",
    descriptionKey: "faq.subtitle",
    titleSuffixKey: "seo.suffix.faq",
  },
  handbuch: {
    path: "/handbuch",
    titleKey: "manual.title",
    descriptionKey: "manual.subtitle",
    titleSuffixKey: "seo.suffix.handbuch",
  },
  appGuide: {
    path: "/app-guide",
    titleKey: "appGuide.title",
    descriptionKey: "appGuide.subtitle",
    titleSuffixKey: "seo.suffix.appGuide",
  },
  privacy: {
    path: "/privacy",
    titleKey: "privacy.title",
    descriptionKey: "privacy.subtitle",
    titleSuffixKey: "seo.suffix.privacy",
  },
  sources: {
    path: "/sources",
    titleKey: "sources.title",
    descriptionKey: "sources.subtitle",
    titleSuffixKey: "seo.suffix.sources",
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
