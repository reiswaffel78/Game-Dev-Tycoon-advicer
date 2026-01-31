import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  LayoutDashboard,
  Tag,
  Layers,
  Monitor,
  SlidersHorizontal,
  CalendarClock,
  FlaskConical,
  Users,
  Clock,
  ClipboardList,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Lightbulb,
  Target,
  Star,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    path: "/",
    description: "Deine Startseite mit schnellem Ueberblick ueber die besten Topic-Genre-Kombinationen und wichtige Statistiken.",
    tips: [
      "Zeigt die Top 5 besten Kombinationen auf einen Blick",
      "Schneller Zugriff auf alle wichtigen Funktionen",
      "Aktuelle Datenbank-Statistiken werden angezeigt",
    ],
  },
  {
    icon: Tag,
    title: "Topic-Empfehlungen",
    path: "/topic-recommender",
    description: "Waehle ein Genre und erhalte die besten passenden Topics dafuer.",
    tips: [
      "Waehle zuerst ein Genre aus der Liste",
      "Die Topics werden nach Kompatibilitaet sortiert",
      "Gruene Bewertungen zeigen optimale Kombinationen",
    ],
  },
  {
    icon: Layers,
    title: "Genre-Empfehlungen",
    path: "/genre-recommender",
    description: "Waehle ein Topic und finde das perfekte Genre dazu.",
    tips: [
      "Ideal wenn du ein bestimmtes Thema im Kopf hast",
      "Zeigt auch Freischaltjahr und Kosten an",
      "Beachte die Fit-Bewertung fuer beste Ergebnisse",
    ],
  },
  {
    icon: Monitor,
    title: "Plattform-Empfehlungen",
    path: "/platform-recommender",
    description: "Finde die beste Plattform fuer dein Genre und deine Zielgruppe.",
    tips: [
      "Waehle Genre UND Zielgruppe fuer beste Ergebnisse",
      "Beachte Lizenzkosten und Marktanteile",
      "Zeitraum-Filter hilft bei historischen Plattformen",
    ],
  },
  {
    icon: SlidersHorizontal,
    title: "Slider-Voreinstellungen",
    path: "/slider-presets",
    description: "Die optimalen Slider-Einstellungen fuer jedes Genre in allen drei Entwicklungsphasen.",
    tips: [
      "Waehle dein Genre aus der Liste",
      "Kopiere die Werte fuer jede Phase",
      "Hohe Werte = mehr Fokus auf diesen Bereich",
    ],
  },
  {
    icon: CalendarClock,
    title: "Spiel-Planer",
    path: "/planner",
    description: "Plane dein naechstes Spiel mit allen Details und speichere es fuer spaeter.",
    tips: [
      "Kombiniere alle Empfehlungen in einem Plan",
      "Speichere mehrere Spielideen",
      "Exportiere deine Plaene als Referenz",
    ],
  },
  {
    icon: FlaskConical,
    title: "Forschungs-Guide",
    path: "/research",
    description: "Alle Technologien mit Freischaltjahr, Kosten und Voraussetzungen.",
    tips: [
      "Sortiert nach Kategorie und Jahr",
      "Zeigt Abhaengigkeiten zwischen Technologien",
      "Hilft bei der Planung deiner Forschung",
    ],
  },
  {
    icon: Users,
    title: "Mitarbeiter-Guide",
    path: "/staff",
    description: "Tipps zur Mitarbeiter-Einstellung und Team-Management fuer jede Spielphase.",
    tips: [
      "Verschiedene Tipps fuer jede Buero-Phase",
      "Optimale Teamgroessen werden erklaert",
      "Skill-Prioritaeten fuer verschiedene Rollen",
    ],
  },
  {
    icon: Clock,
    title: "Timeline",
    path: "/timeline",
    description: "Jahr-fuer-Jahr Walkthrough mit wichtigen Meilensteinen und Plattform-Releases.",
    tips: [
      "Folge dem Guide chronologisch",
      "Wichtige Plattform-Releases sind markiert",
      "Strategische Tipps fuer jeden Zeitabschnitt",
    ],
  },
  {
    icon: ClipboardList,
    title: "Checkliste",
    path: "/checklist",
    description: "Interaktive Fortschritts-Verfolgung fuer deinen Spieldurchlauf.",
    tips: [
      "Hake erledigte Meilensteine ab",
      "Fuege eigene Aufgaben hinzu",
      "Fortschritt wird lokal gespeichert",
    ],
  },
  {
    icon: HelpCircle,
    title: "FAQ",
    path: "/faq",
    description: "Antworten auf die haeufigsten Fragen zu Game Dev Tycoon.",
    tips: [
      "Nach Kategorien organisiert",
      "Schnelle Antworten auf gaengige Probleme",
      "Klicke auf eine Frage um die Antwort zu sehen",
    ],
  },
  {
    icon: BookOpen,
    title: "Handbuch",
    path: "/handbuch",
    description: "Das vollstaendige Nachschlagewerk zu allen Spielmechaniken.",
    tips: [
      "6 Kategorien mit allen Details",
      "Von Grundlagen bis Fortgeschritten",
      "Ideal zum Nachschlagen waehrend des Spiels",
    ],
  },
];

const workflows = [
  {
    title: "Neues Spiel planen",
    icon: Target,
    steps: [
      "Gehe zu 'Genre-Empfehlungen' und waehle dein Wunsch-Topic",
      "Notiere dir das beste Genre fuer dein Topic",
      "Wechsle zu 'Plattform-Empfehlungen' und waehle Genre + Zielgruppe",
      "Oeffne 'Slider-Voreinstellungen' und kopiere die Werte fuer dein Genre",
      "Nutze den 'Spiel-Planer' um alles zusammenzufassen",
    ],
  },
  {
    title: "Optimale Slider finden",
    icon: SlidersHorizontal,
    steps: [
      "Gehe zu 'Slider-Voreinstellungen'",
      "Waehle dein Genre aus der Liste",
      "Lese die Werte fuer alle drei Phasen ab",
      "Stelle die Slider im Spiel entsprechend ein",
    ],
  },
  {
    title: "Spielfortschritt tracken",
    icon: ClipboardList,
    steps: [
      "Oeffne die 'Checkliste' Seite",
      "Gehe die Meilensteine durch",
      "Hake ab was du bereits erreicht hast",
      "Fuege eigene Ziele hinzu falls gewuenscht",
    ],
  },
];

export default function AppGuidePage() {
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <SEO 
        title="App-Anleitung" 
        description="Erfahre wie du den Game Dev Tycoon Advisor optimal nutzt. Schritt-fuer-Schritt Anleitungen fuer alle Funktionen."
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <Compass className="h-8 w-8 text-primary" />
          So nutzt du diese App
        </h1>
        <p className="text-muted-foreground">
          Eine kurze Einfuehrung in alle Funktionen des Game Dev Tycoon Advisors.
          Finde schnell was du brauchst und optimiere dein Spielerlebnis.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-amber-500" />
            Schnellstart-Workflows
          </h2>
          <p className="text-muted-foreground mb-4">
            Die haeufigsten Aufgaben Schritt fuer Schritt erklaert:
          </p>
          
          <div className="grid gap-4 md:grid-cols-3">
            {workflows.map((workflow) => (
              <Card key={workflow.title} data-testid={`workflow-card-${workflow.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <workflow.icon className="h-5 w-5 text-primary" />
                    {workflow.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {workflow.steps.map((step, index) => (
                      <li key={index} className="flex gap-2 text-sm">
                        <Badge variant="outline" className="h-5 w-5 flex items-center justify-center p-0 shrink-0">
                          {index + 1}
                        </Badge>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Star className="h-6 w-6 text-amber-500" />
            Alle Funktionen im Ueberblick
          </h2>
          <p className="text-muted-foreground mb-4">
            Klicke auf einen Menuepunkt in der Seitenleiste um zur jeweiligen Funktion zu gelangen:
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.path} data-testid={`feature-card-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                    {feature.title}
                    <Badge variant="secondary" className="ml-auto text-xs font-normal">
                      {feature.path}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  <div className="space-y-1">
                    {feature.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <Card className="bg-primary/5">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Profi-Tipps
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Nutze die App parallel zum Spielen - halte sie auf einem zweiten Monitor oder Geraet offen.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Die Slider-Voreinstellungen sind der wichtigste Teil - falsche Slider ruinieren selbst die beste Kombination.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Speichere die Checkliste regelmaessig - sie hilft dir den Ueberblick zu behalten.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Bei Fragen: Schau zuerst ins FAQ, dann ins Handbuch fuer detaillierte Erklaerungen.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
