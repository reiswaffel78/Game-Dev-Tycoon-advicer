import { Helmet } from "react-helmet-async";
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
  jsonLdExtra?: Record<string, unknown> | Record<string, unknown>[];
}

const ORGANIZATION_ID = `${BASE_URL}/#organization`;
const WEBSITE_ID = `${BASE_URL}/#website`;

const identityGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Game Dev Tycoon Advisor",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/og-image.png`,
      },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: "Game Dev Tycoon Advisor",
      url: BASE_URL,
      publisher: { "@id": ORGANIZATION_ID },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/recommend/topic?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export function SeoHead({ pageKey, jsonLdExtra }: SeoHeadProps) {
  const { t, i18n } = useTranslation();
  const locale: Locale = isLocale(i18n.language)
    ? i18n.language
    : DEFAULT_LOCALE;
  const { titleKey, descriptionKey, titleSuffixKey, shortSuffixKey, schemaType, datePublished, dateModified, author } = getSeoConfig(pageKey);
  const title = t(titleKey);
  const description = t(descriptionKey);
  const titleSuffix = t(titleSuffixKey);
  const shortSuffix = shortSuffixKey ? t(shortSuffixKey, { defaultValue: titleSuffix }) : titleSuffix;
  const MAX_TITLE = 60;
  const fullTitle = `${title} | ${titleSuffix}`;
  const fullTitleLen = fullTitle.length;
  const shortTitle = `${title} | ${shortSuffix}`;
  const shortTitleLen = shortTitle.length;
  const resolvedTitle =
    fullTitleLen <= MAX_TITLE
      ? fullTitle
      : shortTitleLen <= MAX_TITLE
        ? shortTitle
        : title;
  const canonicalUrl = getCanonicalUrl(pageKey, locale);
  const alternates = getHreflangLinks(pageKey);
  const resolvedSchemaType = schemaType ?? "WebApplication";

  const jsonLd =
    resolvedSchemaType === "Article"
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": `${canonicalUrl}#article`,
          headline: title,
          description,
          url: canonicalUrl,
          inLanguage: locale,
          isPartOf: { "@id": WEBSITE_ID },
          ...(datePublished ? { datePublished } : {}),
          ...(dateModified ? { dateModified } : {}),
          ...(author
            ? {
                author: {
                  "@type": "Organization",
                  "@id": ORGANIZATION_ID,
                  name: author,
                },
              }
            : {}),
          publisher: {
            "@type": "Organization",
            "@id": ORGANIZATION_ID,
            name: "Game Dev Tycoon Advisor",
            url: BASE_URL,
          },
        }
      : {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "@id": `${canonicalUrl}#app`,
          name: "Game Dev Tycoon Advisor",
          description,
          url: canonicalUrl,
          applicationCategory: "GameApplication",
          operatingSystem: "Web Browser",
          inLanguage: locale,
          isPartOf: { "@id": WEBSITE_ID },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        };

  return (
    <Helmet>
      <html lang={locale} />
      <title>{resolvedTitle}</title>
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

      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={resolvedSchemaType === "Article" ? "article" : "website"} />
      <meta property="og:site_name" content="Game Dev Tycoon Advisor" />
      <meta property="og:image" content={`${BASE_URL}/og-image.png`} />
      <meta property="og:locale" content={OG_LOCALES[locale]} />
      {resolvedSchemaType === "Article" && (
        <>
          <meta property="article:section" content="Game Guide" />
          {datePublished && <meta property="article:published_time" content={datePublished} />}
          {dateModified && <meta property="article:modified_time" content={dateModified} />}
          {author && <meta property="article:author" content={author} />}
        </>
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}/og-image.png`} />
      <meta name="twitter:url" content={canonicalUrl} />

      <script type="application/ld+json">{JSON.stringify(identityGraph)}</script>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      {jsonLdExtra && (
        Array.isArray(jsonLdExtra)
          ? jsonLdExtra.map((extra, i) => (
              <script key={`ld-extra-${i}`} type="application/ld+json">{JSON.stringify(extra)}</script>
            ))
          : <script type="application/ld+json">{JSON.stringify(jsonLdExtra)}</script>
      )}
    </Helmet>
  );
}
