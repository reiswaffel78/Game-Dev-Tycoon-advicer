import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeoHead } from "@/seo/SeoHead";
import { BASE_URL } from "@/seo/seo";
import { buildLocalizedPath, extractLocaleFromPath } from "@/lib/locale";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Gamepad2, TrendingUp, Users, Building2, Lightbulb, ArrowRight } from "lucide-react";

interface FAQCategory {
  key: string;
  icon: typeof HelpCircle;
  color: string;
  itemKeys: string[];
}

interface RelatedLink {
  labelKey: string;
  href: string;
  ctaId: string;
  enOnly?: boolean;
}

const categories: FAQCategory[] = [
  {
    key: "basics",
    icon: Gamepad2,
    color: "bg-blue-600",
    itemKeys: ["basics1", "basics2", "basics3"],
  },
  {
    key: "sliders",
    icon: TrendingUp,
    color: "bg-purple-600",
    itemKeys: ["sliders1", "sliders2"],
  },
  {
    key: "staff",
    icon: Users,
    color: "bg-green-600",
    itemKeys: ["staff1", "staff2"],
  },
  {
    key: "research",
    icon: Lightbulb,
    color: "bg-amber-600",
    itemKeys: ["research1", "research2"],
  },
  {
    key: "platforms",
    icon: Building2,
    color: "bg-cyan-600",
    itemKeys: ["platforms1", "platforms2"],
  },
  {
    key: "strategy",
    icon: TrendingUp,
    color: "bg-rose-600",
    itemKeys: ["strategy1", "strategy2", "strategy3"],
  },
  {
    key: "advanced",
    icon: Lightbulb,
    color: "bg-indigo-600",
    itemKeys: ["advanced1", "advanced2"],
  },
];

const relatedLinks: Record<string, RelatedLink[]> = {
  basics1: [{ labelKey: "faq.links.topicRecommender", href: "/recommend/topic", ctaId: "faq_basics1_topic" }],
  basics2: [{ labelKey: "faq.links.sliders", href: "/sliders", ctaId: "faq_basics2_sliders" }],
  basics3: [{ labelKey: "faq.links.timeline", href: "/timeline", ctaId: "faq_basics3_timeline" }],
  sliders1: [{ labelKey: "faq.links.sliders", href: "/sliders", ctaId: "faq_sliders1_sliders" }],
  sliders2: [
    { labelKey: "faq.links.sliders", href: "/sliders", ctaId: "faq_sliders2_sliders" },
    { labelKey: "faq.links.slidersPage", href: "/game-dev-tycoon-sliders", ctaId: "faq_sliders2_page", enOnly: true },
  ],
  staff1: [{ labelKey: "faq.links.staff", href: "/staff", ctaId: "faq_staff1_staff" }],
  staff2: [{ labelKey: "faq.links.handbuch", href: "/handbuch", ctaId: "faq_staff2_handbuch" }],
  research1: [{ labelKey: "faq.links.researchOrder", href: "/game-dev-tycoon-research-order", ctaId: "faq_research1_order", enOnly: true }],
  research2: [{ labelKey: "faq.links.research", href: "/research", ctaId: "faq_research2_research" }],
  platforms1: [{ labelKey: "faq.links.platformRecommender", href: "/recommend/platform", ctaId: "faq_platforms1_platform" }],
  platforms2: [{ labelKey: "faq.links.timeline", href: "/timeline", ctaId: "faq_platforms2_timeline" }],
  strategy1: [{ labelKey: "faq.links.topicRecommender", href: "/recommend/topic", ctaId: "faq_strategy1_topic" }],
  strategy2: [{ labelKey: "faq.links.planner", href: "/planner", ctaId: "faq_strategy2_planner" }],
  strategy3: [{ labelKey: "faq.links.timeline", href: "/timeline", ctaId: "faq_strategy3_timeline" }],
  advanced1: [{ labelKey: "faq.links.research", href: "/research", ctaId: "faq_advanced1_research" }],
  advanced2: [{ labelKey: "faq.links.planner", href: "/planner", ctaId: "faq_advanced2_planner" }],
};

const allItemKeys = categories.flatMap((c) => c.itemKeys);

export default function FAQPage() {
  const { t } = useTranslation();
  const [pathname] = useLocation();
  const { locale } = extractLocaleFromPath(pathname);
  const isEnglish = locale === "en";

  const faqJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItemKeys.map((key) => ({
      "@type": "Question",
      name: t(`faq.items.${key}.question`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq.items.${key}.answer`),
      },
    })),
    url: `${BASE_URL}/faq`,
    inLanguage: t("lang", { defaultValue: "en" }),
  }), [t]);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <SeoHead pageKey="faq" jsonLdExtra={faqJsonLd} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          {t("faq.h1")}
        </h1>
        <p className="text-muted-foreground">
          {t("faq.subtitle")}
        </p>
      </div>

      <div className="space-y-2 mb-6">
        <h2 className="text-xl font-semibold">{t("faq.h2")}</h2>
        <p className="text-muted-foreground text-sm">{t("faq.seoIntro")}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Badge key={category.key} variant="secondary" className="flex items-center gap-1">
              <Icon className="h-3 w-3" />
              {t(`faq.categories.${category.key}`)}
            </Badge>
          );
        })}
      </div>

      <div className="space-y-6">
        {categories.map((category) => {
          const Icon = category.icon;
          
          return (
            <Card key={category.key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className={`p-1.5 rounded ${category.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  {t(`faq.categories.${category.key}`)}
                  <Badge variant="outline" className="ml-auto">
                    {category.itemKeys.length} {t("faq.questions")}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.itemKeys.map((itemKey, index) => {
                    const links = relatedLinks[itemKey] ?? [];
                    return (
                      <AccordionItem 
                        key={itemKey} 
                        value={`${category.key}-${index}`}
                        data-testid={`faq-item-${category.key}-${index}`}
                      >
                        <AccordionTrigger className="text-left" data-testid={`faq-trigger-${category.key}-${index}`}>
                          {t(`faq.items.${itemKey}.question`)}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {t(`faq.items.${itemKey}.answer`)}
                          {links.length > 0 && (
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 pt-3 border-t border-border/50">
                              <span className="text-xs text-muted-foreground/70 shrink-0">
                                {t("faq.links.moreTo")}
                              </span>
                              {links.map((link) => {
                                const href = link.enOnly
                                  ? link.href
                                  : buildLocalizedPath(link.href, locale);
                                return (
                                  <Link
                                    key={link.ctaId}
                                    href={href}
                                    data-cta-id={link.ctaId}
                                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                                  >
                                    {t(link.labelKey)}
                                    {link.enOnly && !isEnglish && (
                                      <span className="text-muted-foreground font-normal">(EN)</span>
                                    )}
                                    <ArrowRight className="h-3 w-3" />
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
