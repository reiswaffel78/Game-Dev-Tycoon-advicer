import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import {
  SUPPORTED_LOCALES,
  buildLocalizedPath,
  type Locale,
  DEFAULT_LOCALE,
  isLocale,
} from "@/lib/locale";

interface SEOProps {
  title: string;
  description?: string;
  path?: string;
}

const BASE_URL = "https://game-dev-tycoon-advicer.com";

const OG_LOCALES: Record<string, string> = {
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
  pt: "pt_BR",
  ru: "ru_RU",
  cs: "cs_CZ",
  nl: "nl_NL",
  ar: "ar_SA",
  el: "el_GR",
  hu: "hu_HU",
  pl: "pl_PL",
  sv: "sv_SE",
};

export function SEO({ title, description, path = "/" }: SEOProps) {
  const { i18n } = useTranslation();
  const fullTitle = `${title} | Game Dev Tycoon Advisor`;
  const currentLang: Locale = isLocale(i18n.language)
    ? i18n.language
    : DEFAULT_LOCALE;
  const canonicalPath = buildLocalizedPath(path, currentLang);
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />

      {SUPPORTED_LOCALES.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`${BASE_URL}${buildLocalizedPath(path, locale)}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}${path}`} />

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Game Dev Tycoon Advisor" />
      <meta property="og:image" content={`${BASE_URL}/og-image.png`} />
      <meta property="og:locale" content={OG_LOCALES[currentLang] || "en_US"} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={`${BASE_URL}/og-image.png`} />
    </Helmet>
  );
}
