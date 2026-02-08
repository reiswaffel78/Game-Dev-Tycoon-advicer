import HelmetAsync from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/locale";
import {
  BASE_URL,
  OG_LOCALES,
  getCanonicalUrl,
  getHreflangLinks,
  getSeoConfig,
  getXDefaultHref,
  type PageKey,
} from "./seo";

interface SeoHeadProps {
  pageKey: PageKey;
}

const { Helmet } = HelmetAsync;

export function SeoHead({ pageKey }: SeoHeadProps) {
  const { t, i18n } = useTranslation();
  const locale: Locale = isLocale(i18n.language)
    ? i18n.language
    : DEFAULT_LOCALE;
  const { titleKey, descriptionKey } = getSeoConfig(pageKey);
  const title = t(titleKey);
  const description = t(descriptionKey);
  const fullTitle = `${title} | Game Dev Tycoon Advisor`;
  const canonicalUrl = getCanonicalUrl(pageKey, locale);
  const alternates = getHreflangLinks(pageKey);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Game Dev Tycoon Advisor",
    description,
    url: canonicalUrl,
    applicationCategory: "GameApplication",
    operatingSystem: "Web Browser",
    inLanguage: locale,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <Helmet>
      <html lang={locale} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {alternates.map((alternate) => (
        <link
          key={alternate.locale}
          rel="alternate"
          hrefLang={alternate.locale}
          href={alternate.href}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={getXDefaultHref(pageKey)} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Game Dev Tycoon Advisor" />
      <meta property="og:image" content={`${BASE_URL}/og-image.png`} />
      <meta property="og:locale" content={OG_LOCALES[locale]} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}/og-image.png`} />
      <meta name="twitter:url" content={canonicalUrl} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
