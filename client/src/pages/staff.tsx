import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Search, Calendar, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { StaffTip } from "@shared/schema";

const phaseConfig: Record<string, { label: string; description: string }> = {
  garage: { label: "Garage", description: "Starting phase (Years 1-4)" },
  first_office: { label: "First Office", description: "Small team (Years 5-10)" },
  second_office: { label: "Second Office", description: "Growing team (Years 11-20)" },
  rd_lab: { label: "R&D Lab", description: "Advanced development" },
  hardware_lab: { label: "Hardware Lab", description: "Console development" },
};

const categoryIcons: Record<string, string> = {
  hiring: "👥",
  training: "📚",
  skills: "⚡",
  specialists: "🎯",
};

function getPriorityBadge(priority: number | null) {
  switch (priority) {
    case 1:
      return (
        <Badge className="bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/50">
          Critical
        </Badge>
      );
    case 2:
      return (
        <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/50">
          Important
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary">
          Nice to Have
        </Badge>
      );
  }
}

function TipCard({ tip }: { tip: StaffTip }) {
  return (
    <Card data-testid={`staff-tip-${tip.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-lg">{categoryIcons[tip.category] || "📋"}</span>
            <CardTitle className="text-base">{tip.title}</CardTitle>
          </div>
          {getPriorityBadge(tip.priority)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{tip.description}</p>
        
        <div className="flex items-center gap-4 flex-wrap text-sm">
          <Badge variant="outline" className="capitalize">
            <Briefcase className="h-3 w-3 mr-1" />
            {tip.category}
          </Badge>
          
          {(tip.minYear || tip.maxYear) && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {tip.minYear && tip.maxYear
                  ? `Years ${tip.minYear}-${tip.maxYear}`
                  : tip.minYear
                    ? `From Year ${tip.minYear}`
                    : `Until Year ${tip.maxYear}`}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Staff() {
  const [search, setSearch] = useState("");
  const [activePhase, setActivePhase] = useState("all");

  const { data: staffTips, isLoading } = useQuery<StaffTip[]>({
    queryKey: ["/api/staff-tips"],
  });

  const phases = Object.keys(phaseConfig);

  const filteredTips = staffTips?.filter((tip) => {
    const matchesSearch =
      tip.title.toLowerCase().includes(search.toLowerCase()) ||
      tip.description.toLowerCase().includes(search.toLowerCase());
    const matchesPhase = activePhase === "all" || tip.gamePhase === activePhase;
    return matchesSearch && matchesPhase;
  });

  const groupedTips = filteredTips?.reduce((acc, tip) => {
    const phase = tip.gamePhase || "other";
    if (!acc[phase]) acc[phase] = [];
    acc[phase].push(tip);
    return acc;
  }, {} as Record<string, StaffTip[]>);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Staff Guide
        </h1>
        <p className="text-muted-foreground">
          Learn optimal hiring, training, and team management strategies for each game phase
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search staff tips..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-staff-search"
          />
        </div>
      </div>

      <Tabs value={activePhase} onValueChange={setActivePhase}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all" data-testid="tab-all-phases">All Phases</TabsTrigger>
          {phases.map((phase) => (
            <TabsTrigger key={phase} value={phase} data-testid={`tab-${phase}`}>
              {phaseConfig[phase]?.label || phase}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activePhase} className="mt-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTips && filteredTips.length > 0 ? (
            activePhase === "all" && groupedTips ? (
              <Accordion type="multiple" defaultValue={phases} className="space-y-4">
                {Object.entries(groupedTips).map(([phase, tips]) => (
                  <AccordionItem key={phase} value={phase} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline py-4" data-testid={`accordion-${phase}`}>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">
                          {phaseConfig[phase]?.label || phase}
                        </span>
                        <Badge variant="outline">{tips.length} tips</Badge>
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                          {phaseConfig[phase]?.description}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="grid gap-4 md:grid-cols-2 pt-2">
                        {tips
                          .sort((a, b) => (a.priority || 3) - (b.priority || 3))
                          .map((tip) => (
                            <TipCard key={tip.id} tip={tip} />
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredTips
                  .sort((a, b) => (a.priority || 3) - (b.priority || 3))
                  .map((tip) => (
                    <TipCard key={tip.id} tip={tip} />
                  ))}
              </div>
            )
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Tips Found</h3>
                <p className="text-muted-foreground">
                  {search ? "Try a different search term." : "No staff tips available."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
