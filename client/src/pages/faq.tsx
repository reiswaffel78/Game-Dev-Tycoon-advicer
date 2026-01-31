import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/components/seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Gamepad2, TrendingUp, Users, Building2, Lightbulb } from "lucide-react";

interface FAQCategory {
  key: string;
  icon: typeof HelpCircle;
  color: string;
  itemKeys: string[];
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

export default function FAQPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <SEO 
        title={t("faq.title")} 
        description={t("faq.subtitle")}
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          {t("faq.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("faq.subtitle")}
        </p>
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
                  {category.itemKeys.map((itemKey, index) => (
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
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
