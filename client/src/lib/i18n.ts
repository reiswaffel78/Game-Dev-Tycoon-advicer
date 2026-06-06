import i18next, { type i18n as I18nInstance } from "i18next";
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
import {
  DEFAULT_LOCALE,
  extractLocaleFromPath,
  isLocale,
  type Locale,
} from "./locale";

export const I18N_RESOURCES = {
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
} as const;

export function createI18nInstance(): I18nInstance {
  return i18next.createInstance();
}

export async function initI18n(
  instance: I18nInstance,
  language: Locale,
): Promise<I18nInstance> {
  await instance.use(initReactI18next).init({
    resources: I18N_RESOURCES,
    lng: language,
    fallbackLng: DEFAULT_LOCALE,
    interpolation: {
      escapeValue: false,
    },
  });

  return instance;
}

export function getInitialLanguage(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const initialLanguage = window.__I18N_INITIAL_LANGUAGE__;
  if (initialLanguage && isLocale(initialLanguage)) {
    return initialLanguage;
  }

  const { locale } = extractLocaleFromPath(window.location.pathname);
  return locale;
}

export async function initClientI18n(): Promise<I18nInstance> {
  const instance = createI18nInstance();
  const language = getInitialLanguage();
  return initI18n(instance, language);
}

declare global {
  interface Window {
    __I18N_INITIAL_LANGUAGE__?: string;
  }
}

export {};
