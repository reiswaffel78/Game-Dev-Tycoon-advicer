import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { buildLocalizedPath } from "@/lib/locale";
import { extractLocaleFromPath } from "@/lib/locale";

interface NextStepCTAProps {
  href: string;
  titleKey: string;
  bodyKey: string;
  dataCdaId: string;
}

export function NextStepCTA({ href, titleKey, bodyKey, dataCdaId }: NextStepCTAProps) {
  const { t } = useTranslation();
  const locale = extractLocaleFromPath(
    typeof window !== "undefined" ? window.location.pathname : "/"
  ).locale;
  const localizedHref = buildLocalizedPath(href, locale);

  return (
    <Link href={localizedHref}>
      <div
        className="group flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 transition-colors hover:bg-primary/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        data-cta-id={dataCdaId}
        role="link"
        aria-label={t(titleKey)}
      >
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">
            {t("nextStep.label")}
          </p>
          <p className="font-semibold text-sm leading-snug">{t(titleKey)}</p>
          <p className="text-sm text-muted-foreground">{t(bodyKey)}</p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
