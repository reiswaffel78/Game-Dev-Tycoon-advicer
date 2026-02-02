import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface SEOProps {
  title: string;
  description?: string;
  path?: string;
}

const BASE_URL = "https://game-dev-tycoon-advicer.com";

export function SEO({ title, description, path = "/" }: SEOProps) {
  const { i18n } = useTranslation();
  const fullTitle = `${title} | Game Dev Tycoon Advisor`;
  const canonicalUrl = `${BASE_URL}${path}`;
  const currentLang = i18n.language || "en";

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Game Dev Tycoon Advisor" />
      <meta property="og:image" content={`${BASE_URL}/og-image.png`} />
      <meta property="og:locale" content={currentLang === "de" ? "de_DE" : "en_US"} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={`${BASE_URL}/og-image.png`} />
      
      {/* Hreflang */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="de" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
    </Helmet>
  );
}
