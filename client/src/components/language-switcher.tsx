import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import {
  extractLocaleFromPath,
  buildLocalizedPath,
  type Locale,
} from "@/lib/locale";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages: { code: Locale; name: string; flag: string }[] = [
    { code: "en", name: "English", flag: "EN" },
    { code: "de", name: "Deutsch", flag: "DE" },
    { code: "fr", name: "Français", flag: "FR" },
    { code: "it", name: "Italiano", flag: "IT" },
    { code: "es", name: "Español", flag: "ES" },
    { code: "ko", name: "한국어", flag: "KO" },
    { code: "ja", name: "日本語", flag: "JA" },
    { code: "zh", name: "中文", flag: "ZH" },
    { code: "hi", name: "हिन्दी", flag: "HI" },
    { code: "tr", name: "Türkçe", flag: "TR" },
    { code: "pt", name: "Português", flag: "PT" },
    { code: "ru", name: "Русский", flag: "RU" },
    { code: "cs", name: "Čeština", flag: "CS" },
    { code: "nl", name: "Nederlands", flag: "NL" },
    { code: "ar", name: "العربية", flag: "AR" },
    { code: "el", name: "Ελληνικά", flag: "EL" },
    { code: "hu", name: "Magyar", flag: "HU" },
    { code: "pl", name: "Polski", flag: "PL" },
    { code: "sv", name: "Svenska", flag: "SV" },
  ];

  const switchLocale = (newLocale: Locale) => {
    if (typeof window === "undefined") return;

    const { basePath } = extractLocaleFromPath(window.location.pathname);
    const newPath = buildLocalizedPath(basePath, newLocale);

    try {
      localStorage.setItem("i18nextLng", newLocale);
      document.cookie = `locale=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    } catch {}

    i18n.changeLanguage(newLocale);
    window.history.pushState(null, "", newPath);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          data-testid="button-language-switcher"
        >
          <Languages className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLocale(lang.code)}
            className={i18n.language === lang.code ? "bg-accent/20" : ""}
            data-testid={`menu-item-lang-${lang.code}`}
          >
            <span className="font-mono text-xs mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
