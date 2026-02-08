import i18next, { type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import de from "../locales/de.json";
import fr from "../locales/fr.json";
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
