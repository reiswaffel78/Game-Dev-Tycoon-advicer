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
  shortSuffixKey?: string;
  schemaType?: "WebApplication" | "Article";
}

const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 160;

export const SEO_CONFIG: Record<PageKey, SeoPageConfig> = {
  dashboard: {
    path: "/",
    titleKey: "seo.title.dashboard",
    descriptionKey: "seo.description.dashboard",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
  },
  topicRecommender: {
    path: "/recommend/topic",
    titleKey: "seo.title.topicRecommender",
    descriptionKey: "seo.description.topicRecommender",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
  },
  genreRecommender: {
    path: "/recommend/genre",
    titleKey: "seo.title.genreRecommender",
    descriptionKey: "seo.description.genreRecommender",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
  },
  platformRecommender: {
    path: "/recommend/platform",
    titleKey: "seo.title.platformRecommender",
    descriptionKey: "seo.description.platformRecommender",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
  },
  sliders: {
    path: "/sliders",
    titleKey: "seo.title.sliders",
    descriptionKey: "seo.description.sliders",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
  },
  guide: {
    path: "/game-dev-tycoon-guide",
    titleKey: "seo.title.guide",
    descriptionKey: "seo.description.guide",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
    schemaType: "Article",
  },
  bestCombos: {
    path: "/game-dev-tycoon-best-combos",
    titleKey: "seo.title.bestCombos",
    descriptionKey: "seo.description.bestCombos",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
    schemaType: "Article",
  },
  slidersExplained: {
    path: "/game-dev-tycoon-sliders",
    titleKey: "seo.title.slidersExplained",
    descriptionKey: "seo.description.slidersExplained",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
    schemaType: "Article",
  },
  researchOrder: {
    path: "/game-dev-tycoon-research-order",
    titleKey: "seo.title.researchOrder",
    descriptionKey: "seo.description.researchOrder",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
    schemaType: "Article",
  },
  planner: {
    path: "/planner",
    titleKey: "seo.title.planner",
    descriptionKey: "seo.description.planner",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
  },
  research: {
    path: "/research",
    titleKey: "seo.title.research",
    descriptionKey: "seo.description.research",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
  },
  staff: {
    path: "/staff",
    titleKey: "seo.title.staff",
    descriptionKey: "seo.description.staff",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
  },
  timeline: {
    path: "/timeline",
    titleKey: "seo.title.timeline",
    descriptionKey: "seo.description.timeline",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
  },
  checklist: {
    path: "/checklist",
    titleKey: "seo.title.checklist",
    descriptionKey: "seo.description.checklist",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
  },
  faq: {
    path: "/faq",
    titleKey: "seo.title.faq",
    descriptionKey: "seo.description.faq",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
  },
  handbuch: {
    path: "/handbuch",
    titleKey: "seo.title.handbuch",
    descriptionKey: "seo.description.handbuch",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
  },
  appGuide: {
    path: "/app-guide",
    titleKey: "seo.title.appGuide",
    descriptionKey: "seo.description.appGuide",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
  },
  privacy: {
    path: "/privacy",
    titleKey: "seo.title.privacy",
    descriptionKey: "seo.description.privacy",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
  },
  sources: {
    path: "/sources",
    titleKey: "seo.title.sources",
    descriptionKey: "seo.description.sources",
    titleSuffixKey: "seo.brand",
    shortSuffixKey: "seo.shortBrand",
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
