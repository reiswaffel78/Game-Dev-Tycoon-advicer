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

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    category: "Grundlagen",
    question: "Was ist die beste Topic-Genre Kombination?",
    answer: "Es gibt keine universell beste Kombination - jede Topic-Genre Kombination hat einen Fit-Wert von -3 bis +3. Nutze unseren Recommender, um die besten Kombinationen zu finden. Generell gilt: Action passt gut zu Militar, Sci-Fi und Fantasy. RPG funktioniert super mit Fantasy und Mittelalter. Simulation harmoniert mit Transport, Stadt und Business.",
  },
  {
    category: "Grundlagen",
    question: "Wie funktioniert das Punktesystem beim Spieleentwickeln?",
    answer: "Dein Spiel bekommt Punkte basierend auf: 1) Topic-Genre Fit (wie gut passt das Thema zum Genre), 2) Slider-Einstellungen (jedes Genre hat optimale Werte), 3) Plattform-Genre Fit, 4) Zielgruppen-Plattform Fit, 5) Technologie-Level, und 6) Team-Skills. Die Slider sind besonders wichtig - nutze unsere Presets!",
  },
  {
    category: "Grundlagen",
    question: "Wann sollte ich ins naechste Buero umziehen?",
    answer: "Ziehe um, wenn du: 1) Genug Geld hast (mind. 1M$ fuer das erste Buero), 2) Konstant gute Spiele produzierst (8+ Reviews), 3) Eine stabile Fanbasis aufgebaut hast (mind. 100k Fans). Zu frueh umziehen ist riskant - die hoeheren Kosten koennen dich ruinieren!",
  },
  {
    category: "Slider",
    question: "Was bedeuten die Slider beim Spieleentwickeln?",
    answer: "Die Slider verteilen deine Entwicklungszeit auf verschiedene Bereiche: Engine, Gameplay, Story/Quests, Dialoge, Level Design, KI, Weltdesign, Grafik und Sound. Jedes Genre hat optimale Einstellungen. Ein Action-Spiel braucht z.B. mehr Engine und Grafik, waehrend ein RPG mehr Story und Dialoge braucht.",
  },
  {
    category: "Slider",
    question: "Welche Slider sind am wichtigsten?",
    answer: "Das haengt vom Genre ab! Generell: Action-Spiele brauchen hohe Engine und Gameplay. RPGs brauchen hohe Story und Dialoge. Strategiespiele brauchen hohe KI und Gameplay. Simulationen brauchen hohes Weltdesign und Gameplay. Nutze unsere Genre-spezifischen Presets fuer optimale Ergebnisse.",
  },
  {
    category: "Mitarbeiter",
    question: "Wann sollte ich Mitarbeiter einstellen?",
    answer: "Stelle Mitarbeiter ein, wenn: 1) Du im ersten Buero bist, 2) Du mindestens 500k$ hast, 3) Du stabile Einnahmen hast. Beginne mit 1-2 Mitarbeitern und trainiere sie gut. Qualitaet ist wichtiger als Quantitaet - ein gut trainierter Mitarbeiter ist besser als drei untrainierte.",
  },
  {
    category: "Mitarbeiter",
    question: "Welche Skills sollte ich bei Mitarbeitern priorisieren?",
    answer: "Fokussiere auf Skills, die zu deiner Spielstrategie passen. Fuer Action-Spiele: Technologie und Design. Fuer RPGs: Story und Design. Allgemein brauchst du mindestens einen Tech-Spezialisten und einen Design-Spezialisten. Trainiere regelmaessig - auch wenn es teuer ist.",
  },
  {
    category: "Forschung",
    question: "Was sollte ich zuerst erforschen?",
    answer: "Prioritaet 1: Zielgruppen (Young, Everyone, Mature) - erweitert deine Moeglichkeiten massiv. Prioritaet 2: 2D Grafik V2 und besserer Sound. Prioritaet 3: Neue Genre-Features wie Dialoge. Forsche nie etwas, das du dir nicht leisten kannst - halte immer Reserve!",
  },
  {
    category: "Forschung",
    question: "Wann lohnt sich 3D Grafik?",
    answer: "3D Grafik lohnt sich ab ungefaehr Jahr 15-16 (wenn 3D-faehige Konsolen erscheinen). Vorher reicht 2D Grafik V3/V4 voellig aus. Warte mit dem Upgrade, bis du: 1) Ein stabiles Team hast, 2) Genug Forschungspunkte gesammelt hast, 3) Die passenden Plattformen verfuegbar sind.",
  },
  {
    category: "Plattformen",
    question: "Auf welchen Plattformen sollte ich entwickeln?",
    answer: "Entwickle auf Plattformen, die: 1) Zu deinem Genre passen, 2) Aktiv sind (nicht kurz vor Retirement), 3) Zu deiner Zielgruppe passen. PC ist fast immer eine sichere Wahl. Konsolen haben hoehere Lizenzkosten, aber auch mehr Fans. Mobile lohnt sich spaeter im Spiel.",
  },
  {
    category: "Plattformen",
    question: "Wann sollte ich Multi-Plattform entwickeln?",
    answer: "Multi-Plattform lohnt sich, wenn: 1) Du ein groesseres Team hast (4+ Leute), 2) Das Spiel gross genug ist (medium oder large), 3) Die Plattformen zur gleichen Genre-Kategorie passen. Entwickle nie Multi-Plattform in der Garage - der Aufwand ist zu hoch!",
  },
  {
    category: "Strategie",
    question: "Wie bekomme ich bessere Reviews?",
    answer: "Bessere Reviews bekommst du durch: 1) Perfekte Topic-Genre Kombination, 2) Optimale Slider-Einstellungen (nutze unsere Presets!), 3) Gute Technologie passend zur Spielgroesse, 4) Nicht dieselbe Kombination zweimal hintereinander, 5) Genuegend Zeit zwischen Sequels lassen.",
  },
  {
    category: "Strategie",
    question: "Wie vermeide ich Bankrott?",
    answer: "Vermeide Bankrott durch: 1) Immer mindestens 50k$ Reserve halten, 2) Nicht zu schnell expandieren, 3) Kleine Spiele machen, wenn das Geld knapp ist, 4) Contract Work annehmen in Notfaellen, 5) Nie in teure Forschung investieren, wenn du es dir nicht leisten kannst.",
  },
  {
    category: "Strategie",
    question: "Wann sollte ich Sequels machen?",
    answer: "Mache Sequels von erfolgreichen Spielen (9+ Reviews), aber warte mindestens 1-2 Jahre zwischen Teilen. Sequels verkaufen sich besser bei etablierten Fans. Nutze die Zeit dazwischen fuer andere Projekte oder Contract Work.",
  },
  {
    category: "Fortgeschritten",
    question: "Wie funktioniert das F&E Labor?",
    answer: "Das F&E (R&D) Labor schaltest du mit dem dritten Buero frei. Dort kannst du: 1) Eigene Engines entwickeln, 2) Neue Technologien erforschen, 3) Spezialisierte Hardware entwickeln (mit Hardware Lab). Eine eigene Engine ist der Schluessel zu Top-Spielen!",
  },
  {
    category: "Fortgeschritten",
    question: "Wie entwickle ich die beste Game Engine?",
    answer: "Die beste Engine entwickelst du durch: 1) Hohe Tech-Skills im Team, 2) Alle verfuegbaren Features einbauen, 3) Genuegend Zeit und Geld investieren, 4) Regelmaessige Updates. Eine gute Engine kann fuer mehrere Spiele genutzt werden und spart langfristig Zeit.",
  },
];

const categoryTranslationKeys: Record<string, string> = {
  "Grundlagen": "basics",
  "Slider": "sliders",
  "Mitarbeiter": "staff",
  "Forschung": "research",
  "Plattformen": "platforms",
  "Strategie": "strategy",
  "Fortgeschritten": "advanced",
};

const categoryIcons: Record<string, typeof HelpCircle> = {
  "Grundlagen": Gamepad2,
  "Slider": TrendingUp,
  "Mitarbeiter": Users,
  "Forschung": Lightbulb,
  "Plattformen": Building2,
  "Strategie": TrendingUp,
  "Fortgeschritten": Lightbulb,
};

const categoryColors: Record<string, string> = {
  "Grundlagen": "bg-blue-600",
  "Slider": "bg-purple-600",
  "Mitarbeiter": "bg-green-600",
  "Forschung": "bg-amber-600",
  "Plattformen": "bg-cyan-600",
  "Strategie": "bg-rose-600",
  "Fortgeschritten": "bg-indigo-600",
};

export default function FAQPage() {
  const { t, i18n } = useTranslation();
  const categories = Array.from(new Set(faqItems.map((item) => item.category)));

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
          const Icon = categoryIcons[category] || HelpCircle;
          const translationKey = categoryTranslationKeys[category] || "basics";
          return (
            <Badge key={category} variant="secondary" className="flex items-center gap-1">
              <Icon className="h-3 w-3" />
              {t(`faq.categories.${translationKey}`)}
            </Badge>
          );
        })}
      </div>

      <div className="space-y-6">
        {categories.map((category) => {
          const Icon = categoryIcons[category] || HelpCircle;
          const items = faqItems.filter((item) => item.category === category);
          
          return (
            <Card key={category}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className={`p-1.5 rounded ${categoryColors[category]}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  {t(`faq.categories.${categoryTranslationKeys[category] || "basics"}`)}
                  <Badge variant="outline" className="ml-auto">{items.length} {t("faq.questions")}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {items.map((item, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`${category}-${index}`}
                      data-testid={`faq-item-${category.toLowerCase()}-${index}`}
                    >
                      <AccordionTrigger className="text-left" data-testid={`faq-trigger-${category.toLowerCase()}-${index}`}>
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
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
