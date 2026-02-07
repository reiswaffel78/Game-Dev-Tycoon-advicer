import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import de from "../locales/de.json";
import fr from "../locales/fr.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    fr: { translation: fr },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

if (typeof window !== "undefined") {
  const path = window.location.pathname;
  const normalized =
    path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  const lastSegment = normalized.split("/").filter(Boolean).pop();
  const nonDefaultLocales = ["de", "fr"];
  if (lastSegment && nonDefaultLocales.includes(lastSegment)) {
    i18n.changeLanguage(lastSegment);
  }
}

export default i18n;
