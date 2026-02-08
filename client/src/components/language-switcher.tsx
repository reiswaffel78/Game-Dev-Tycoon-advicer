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
  SUPPORTED_LOCALES,
  type Locale,
} from "@/lib/locale";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languageLabels: Record<Locale, { name: string; flag: string }> = {
    en: { name: "English", flag: "EN" },
    de: { name: "Deutsch", flag: "DE" },
    fr: { name: "Français", flag: "FR" },
  };

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
        {SUPPORTED_LOCALES.map((code) => {
          const lang = languageLabels[code];
          return (
          <DropdownMenuItem
            key={code}
            onClick={() => switchLocale(code)}
            className={i18n.language === code ? "bg-accent/20" : ""}
            data-testid={`menu-item-lang-${code}`}
          >
            <span className="font-mono text-xs mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
