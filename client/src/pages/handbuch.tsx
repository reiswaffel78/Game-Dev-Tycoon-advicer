import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Gamepad2,
  TrendingUp,
  Users,
  Building2,
  Lightbulb,
  Target,
  Zap,
  Star,
  AlertTriangle,
} from "lucide-react";

export default function HandbuchPage() {
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <SEO 
        title="Handbuch - Vollstaendige Spielanleitung" 
        description="Das komplette Game Dev Tycoon Handbuch: Spielmechaniken, Bewertungssystem, Team-Management, Forschung und fortgeschrittene Strategien."
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Game Dev Tycoon Handbuch
        </h1>
        <p className="text-muted-foreground">
          Das vollstaendige Handbuch zu Game Dev Tycoon. Lerne alle Spielmechaniken,
          Strategien und Tipps fuer den perfekten Spieledurchlauf.
        </p>
      </div>

      <Tabs defaultValue="basics" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="basics" className="flex items-center gap-1" data-testid="tab-basics">
            <Gamepad2 className="h-4 w-4" />
            Grundlagen
          </TabsTrigger>
          <TabsTrigger value="development" className="flex items-center gap-1" data-testid="tab-development">
            <Zap className="h-4 w-4" />
            Entwicklung
          </TabsTrigger>
          <TabsTrigger value="scoring" className="flex items-center gap-1" data-testid="tab-scoring">
            <Star className="h-4 w-4" />
            Bewertung
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-1" data-testid="tab-team">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center gap-1" data-testid="tab-research">
            <Lightbulb className="h-4 w-4" />
            Forschung
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-1" data-testid="tab-advanced">
            <Target className="h-4 w-4" />
            Fortgeschritten
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-primary" />
                Willkommen bei Game Dev Tycoon
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                In Game Dev Tycoon startest du als unabhaengiger Spieleentwickler in den 1980er Jahren
                und baust dein eigenes Spieleimperium auf. Du entwickelst Spiele, stellst Mitarbeiter ein,
                erforschst neue Technologien und versuchst, der erfolgreichste Spieleentwickler der Welt zu werden.
              </p>
              
              <h3 className="flex items-center gap-2 mt-6">
                <Building2 className="h-4 w-4" />
                Die Spielphasen
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 not-prose mt-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">1. Garage (Jahr 1-4)</h4>
                    <p className="text-sm text-muted-foreground">
                      Du arbeitest allein und machst kleine Spiele. Fokus auf Lernen und erste Erfolge.
                      Spare Geld fuer den Umzug ins erste Buero.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">2. Erstes Buero (Jahr 4-10)</h4>
                    <p className="text-sm text-muted-foreground">
                      Stelle erste Mitarbeiter ein. Entwickle mittlere Spiele.
                      Beginne mit Forschung und baue deine Fanbasis aus.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">3. Zweites Buero (Jahr 10-20)</h4>
                    <p className="text-sm text-muted-foreground">
                      Groesseres Team, groessere Spiele. Zugang zum F&E Labor.
                      Entwickle eigene Engines und AAA-Titel.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">4. Endgame (Jahr 20+)</h4>
                    <p className="text-sm text-muted-foreground">
                      Hardware Lab, eigene Konsolen, MMOs.
                      Dominiere den Markt mit deinem Spieleimperium.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="flex items-center gap-2 mt-6">
                <Target className="h-4 w-4" />
                Deine Ziele
              </h3>
              <ul>
                <li>Entwickle erfolgreiche Spiele mit guten Reviews (8+)</li>
                <li>Baue eine treue Fanbasis auf</li>
                <li>Erweitere dein Unternehmen und Team</li>
                <li>Erforsche neue Technologien</li>
                <li>Vermeide den Bankrott!</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="development" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Spieleentwicklung verstehen
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <h3>Die drei Entwicklungsphasen</h3>
              <p>Jedes Spiel durchlaeuft drei Phasen mit jeweils eigenen Slidern:</p>
              
              <div className="not-prose grid gap-4 mt-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Badge className="bg-blue-600">Phase 1</Badge>
                      Engine & Gameplay
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Hier legst du das technische Fundament. Die Slider sind:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Engine</Badge>
                      <Badge variant="outline">Gameplay</Badge>
                      <Badge variant="outline">Story/Quests</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Badge className="bg-green-600">Phase 2</Badge>
                      Dialoge & Design
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Inhaltliche Ausarbeitung des Spiels:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Dialoge</Badge>
                      <Badge variant="outline">Level Design</Badge>
                      <Badge variant="outline">KI</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Badge className="bg-purple-600">Phase 3</Badge>
                      Praesentation
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Visuelle und auditive Qualitaet:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Weltdesign</Badge>
                      <Badge variant="outline">Grafik</Badge>
                      <Badge variant="outline">Sound</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h3 className="mt-6">Topic-Genre Kombinationen</h3>
              <p>
                Nicht jedes Thema passt zu jedem Genre. Ein Kriegsspiel als Casual Game?
                Ein Kinderthema als Horror-Spiel? Das funktioniert nicht gut.
              </p>
              <p>
                Die Passgenauigkeit wird mit Werten von -3 (sehr schlecht) bis +3 (perfekt) bewertet.
                Nutze unseren <strong>Recommender</strong>, um die besten Kombinationen zu finden!
              </p>

              <div className="not-prose mt-4">
                <Card className="bg-amber-500/10 border-amber-500/30">
                  <CardContent className="p-4 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Wichtig: Wiederholungen vermeiden!</h4>
                      <p className="text-sm text-muted-foreground">
                        Wenn du dieselbe Topic-Genre Kombination zweimal hintereinander nutzt,
                        bekommst du schlechtere Reviews. Variiere deine Spiele!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Das Bewertungssystem
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                Die Qualitaet deines Spiels (und damit die Reviews) wird durch mehrere Faktoren bestimmt:
              </p>

              <div className="not-prose grid gap-4 mt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Topic-Genre Fit</h4>
                      <Badge>40% Gewichtung</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Wie gut passt dein Thema zum Genre? Fantasy + RPG = perfekt.
                      Horror + Kinderthema = katastrophal.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Slider-Einstellungen</h4>
                      <Badge>30% Gewichtung</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Jedes Genre hat optimale Slider-Werte. Ein Action-Spiel braucht mehr Engine,
                      ein RPG mehr Story. Nutze unsere Presets!
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Plattform & Zielgruppe</h4>
                      <Badge>15% Gewichtung</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Casual Games auf PC? Hardcore auf Mobile? Waehle die richtige Plattform
                      fuer deine Zielgruppe.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Technologie-Level</h4>
                      <Badge>15% Gewichtung</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Nutze Technologie passend zur Spielgroesse. AAA-Spiele brauchen
                      die neueste Engine, kleine Spiele koennen mit weniger auskommen.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="mt-6">Review-Skala verstehen</h3>
              <div className="not-prose mt-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="text-center p-3 rounded-lg bg-red-500/20">
                    <div className="text-2xl font-bold text-red-500">1-4</div>
                    <div className="text-xs text-muted-foreground">Flop</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-orange-500/20">
                    <div className="text-2xl font-bold text-orange-500">5-6</div>
                    <div className="text-xs text-muted-foreground">Mittelmass</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-green-500/20">
                    <div className="text-2xl font-bold text-green-500">7-8</div>
                    <div className="text-xs text-muted-foreground">Gut</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-primary/20">
                    <div className="text-2xl font-bold text-primary">9-10</div>
                    <div className="text-xs text-muted-foreground">Hit!</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Team-Management
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                Im ersten Buero kannst du Mitarbeiter einstellen. Jeder Mitarbeiter hat 
                Skills in verschiedenen Bereichen und kann trainiert werden.
              </p>

              <h3>Die Skill-Kategorien</h3>
              <div className="not-prose grid gap-3 sm:grid-cols-2 mt-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge className="bg-blue-600">T</Badge>
                  <div>
                    <div className="font-medium">Technology</div>
                    <div className="text-xs text-muted-foreground">Engine, KI, Optimierung</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge className="bg-green-600">D</Badge>
                  <div>
                    <div className="font-medium">Design</div>
                    <div className="text-xs text-muted-foreground">Gameplay, Level, Weltdesign</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge className="bg-purple-600">S</Badge>
                  <div>
                    <div className="font-medium">Speed</div>
                    <div className="text-xs text-muted-foreground">Entwicklungsgeschwindigkeit</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge className="bg-amber-600">R</Badge>
                  <div>
                    <div className="font-medium">Research</div>
                    <div className="text-xs text-muted-foreground">Forschungspunkte generieren</div>
                  </div>
                </div>
              </div>

              <h3 className="mt-6">Einstellungstipps</h3>
              <ul>
                <li><strong>Qualitaet vor Quantitaet:</strong> Ein gut trainierter Mitarbeiter ist besser als drei schlechte</li>
                <li><strong>Balance:</strong> Mindestens ein Tech-Spezialist und ein Design-Spezialist</li>
                <li><strong>Training:</strong> Investiere regelmaessig in Training - es zahlt sich langfristig aus</li>
                <li><strong>Gehalt:</strong> Glueckliche Mitarbeiter arbeiten besser. Zahle fair!</li>
              </ul>

              <h3 className="mt-6">Spezialisten</h3>
              <p>
                Im zweiten Buero kannst du Spezialisten fuer bestimmte Bereiche ausbilden:
                Sound, Grafik, Gameplay. Diese boosten die entsprechenden Slider.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="research" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Forschung & Entwicklung
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                Forschung ist der Schluessel zum langfristigen Erfolg. Neue Technologien
                ermoeglichen bessere Spiele und mehr Optionen.
              </p>

              <h3>Forschungs-Prioritaeten</h3>
              <div className="not-prose space-y-3 mt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="destructive">Prioritaet 1</Badge>
                      <span className="font-semibold">Zielgruppen</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Young, Everyone, Mature - diese erweitern deine Moeglichkeiten massiv.
                      Erforsche so frueh wie moeglich!
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-amber-600">Prioritaet 2</Badge>
                      <span className="font-semibold">Grafik & Sound Updates</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      2D Grafik V2/V3 und Sound-Upgrades verbessern alle deine Spiele.
                      Besonders wichtig fuer groessere Produktionen.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-600">Prioritaet 3</Badge>
                      <span className="font-semibold">Genre-Features</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Dialoge, Tutorial-System, etc. Diese machen deine Spiele vielfaeltiger
                      und ermoeglichen neue Spieltypen.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="mt-6">Forschungspunkte (RP)</h3>
              <p>
                Du verdienst RP durch Spieleentwicklung und durch Mitarbeiter mit hohem Research-Skill.
                Spare RP fuer wichtige Forschungen - teure Forschung ohne genuegend RP ist Verschwendung.
              </p>

              <div className="not-prose mt-4">
                <Card className="bg-amber-500/10 border-amber-500/30">
                  <CardContent className="p-4 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Goldene Regel</h4>
                      <p className="text-sm text-muted-foreground">
                        Forsche nie etwas, das mehr als 50% deines Geldes kostet.
                        Halte immer Reserve fuer Notfaelle!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Fortgeschrittene Strategien
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <h3>Eigene Game Engine</h3>
              <p>
                Im F&E Labor (ab dem zweiten Buero) kannst du eigene Engines entwickeln.
                Eine gute Engine ist der Schluessel zu 10/10 Spielen!
              </p>
              <ul>
                <li>Investiere genuegend Zeit und Ressourcen</li>
                <li>Nutze Mitarbeiter mit hohem Tech-Skill</li>
                <li>Update deine Engine regelmaessig</li>
                <li>Eine Engine kann fuer mehrere Spiele genutzt werden</li>
              </ul>

              <h3 className="mt-6">AAA-Spiele</h3>
              <p>
                Grosse (Large) und AAA-Spiele brauchen:
              </p>
              <ul>
                <li>Ein grosses Team (6+ Mitarbeiter)</li>
                <li>Eine eigene, aktuelle Engine</li>
                <li>Viel Zeit und Geld</li>
                <li>Die neuesten Technologien</li>
              </ul>

              <h3 className="mt-6">Hardware Lab</h3>
              <p>
                Im dritten Buero schaltest du das Hardware Lab frei. Hier kannst du:
              </p>
              <ul>
                <li>Eigene Konsolen entwickeln</li>
                <li>Controller und Zubehoer herstellen</li>
                <li>Den Markt dominieren</li>
              </ul>

              <h3 className="mt-6">MMOs</h3>
              <p>
                MMOs sind die Koenigsdisziplin. Sie brauchen:
              </p>
              <ul>
                <li>Ein vollstaendig trainiertes Team</li>
                <li>Massive Investitionen</li>
                <li>Laufende Serverkosten</li>
                <li>Regelmaessige Content-Updates</li>
              </ul>
              <p>
                Aber wenn sie erfolgreich sind, bringen sie dauerhaft Einnahmen!
              </p>

              <div className="not-prose mt-6">
                <Card className="bg-primary/10 border-primary/30">
                  <CardContent className="p-4 flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Pro-Tipp: Sequels</h4>
                      <p className="text-sm text-muted-foreground">
                        Erfolgreiche Spiele koennen Sequels bekommen. Diese profitieren
                        von der bestehenden Fanbasis, aber warte mindestens 1-2 Jahre
                        zwischen den Teilen!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
