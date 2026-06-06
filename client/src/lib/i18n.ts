import i18next, { type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import {
  DEFAULT_LOCALE,
  extractLocaleFromPath,
  isLocale,
  type Locale,
} from "./locale";

async function loadLocaleData(locale: string): Promise<Record<string, unknown>> {
  switch (locale) {
    case "en": return (await import("../locales/en.json")).default as Record<string, unknown>;
    case "de": return (await import("../locales/de.json")).default as Record<string, unknown>;
    case "fr": return (await import("../locales/fr.json")).default as Record<string, unknown>;
    case "it": return (await import("../locales/it.json")).default as Record<string, unknown>;
    case "es": return (await import("../locales/es.json")).default as Record<string, unknown>;
    case "ko": return (await import("../locales/ko.json")).default as Record<string, unknown>;
    case "ja": return (await import("../locales/ja.json")).default as Record<string, unknown>;
    case "zh": return (await import("../locales/zh.json")).default as Record<string, unknown>;
    case "hi": return (await import("../locales/hi.json")).default as Record<string, unknown>;
    case "tr": return (await import("../locales/tr.json")).default as Record<string, unknown>;
    case "pt": return (await import("../locales/pt.json")).default as Record<string, unknown>;
    case "ru": return (await import("../locales/ru.json")).default as Record<string, unknown>;
    case "cs": return (await import("../locales/cs.json")).default as Record<string, unknown>;
    case "nl": return (await import("../locales/nl.json")).default as Record<string, unknown>;
    case "ar": return (await import("../locales/ar.json")).default as Record<string, unknown>;
    case "el": return (await import("../locales/el.json")).default as Record<string, unknown>;
    case "hu": return (await import("../locales/hu.json")).default as Record<string, unknown>;
    case "pl": return (await import("../locales/pl.json")).default as Record<string, unknown>;
    case "sv": return (await import("../locales/sv.json")).default as Record<string, unknown>;
    default:   return (await import("../locales/en.json")).default as Record<string, unknown>;
  }
}

export function createI18nInstance(): I18nInstance {
  return i18next.createInstance();
}

export async function initI18n(
  instance: I18nInstance,
  language: Locale,
): Promise<I18nInstance> {
  const resources: Record<string, { translation: Record<string, unknown> }> = {};

  const localeData = await loadLocaleData(language);
  resources[language] = { translation: localeData };

  if (language !== DEFAULT_LOCALE) {
    const fallbackData = await loadLocaleData(DEFAULT_LOCALE);
    resources[DEFAULT_LOCALE] = { translation: fallbackData };
  }

  await instance.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: DEFAULT_LOCALE,
    interpolation: {
      escapeValue: false,
    },
  });

  return instance;
}

export async function ensureLocaleLoaded(
  instance: I18nInstance,
  locale: Locale,
): Promise<void> {
  if (instance.hasResourceBundle(locale, "translation")) {
    return;
  }
  const data = await loadLocaleData(locale);
  instance.addResourceBundle(locale, "translation", data, true, true);
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
