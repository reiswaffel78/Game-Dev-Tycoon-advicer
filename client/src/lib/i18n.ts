import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import de from "../locales/de.json";

// Initialize i18n with English as default for SSR consistency
// Language detection happens after hydration via changeLanguage()
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
  },
  lng: "en", // Always start with English for SSR consistency
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// Detect and apply user's preferred language after hydration (client-side only)
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("i18nextLng");
  const browserLang = navigator.language?.split("-")[0];
  const detectedLang = stored || (browserLang === "de" ? "de" : "en");
  
  if (detectedLang !== "en") {
    // Use setTimeout to defer language change until after hydration
    setTimeout(() => {
      i18n.changeLanguage(detectedLang);
    }, 0);
  }
}

export default i18n;
