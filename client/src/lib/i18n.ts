import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import de from "../locales/de.json";
import fr from "../locales/fr.json";
import it from "../locales/it.json";
import es from "../locales/es.json";
import ko from "../locales/ko.json";
import ja from "../locales/ja.json";
import zh from "../locales/zh.json";
import hi from "../locales/hi.json";
import tr from "../locales/tr.json";
import pt from "../locales/pt.json";
import ru from "../locales/ru.json";
import cs from "../locales/cs.json";
import nl from "../locales/nl.json";
import ar from "../locales/ar.json";
import el from "../locales/el.json";
import hu from "../locales/hu.json";
import pl from "../locales/pl.json";
import sv from "../locales/sv.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    fr: { translation: fr },
    it: { translation: it },
    es: { translation: es },
    ko: { translation: ko },
    ja: { translation: ja },
    zh: { translation: zh },
    hi: { translation: hi },
    tr: { translation: tr },
    pt: { translation: pt },
    ru: { translation: ru },
    cs: { translation: cs },
    nl: { translation: nl },
    ar: { translation: ar },
    el: { translation: el },
    hu: { translation: hu },
    pl: { translation: pl },
    sv: { translation: sv },
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
  const nonDefaultLocales = [
    "de",
    "fr",
    "it",
    "es",
    "ko",
    "ja",
    "zh",
    "hi",
    "tr",
    "pt",
    "ru",
    "cs",
    "nl",
    "ar",
    "el",
    "hu",
    "pl",
    "sv",
  ];
  if (lastSegment && nonDefaultLocales.includes(lastSegment)) {
    i18n.changeLanguage(lastSegment);
  }
}

export default i18n;
