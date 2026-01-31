import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FlaskConical, Search, Lightbulb, Calendar, Coins, Target, Link2, Palette, Volume2, Gamepad2, Bot, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ResearchItem } from "@shared/schema";

const categoryConfig: Record<string, { label: string; Icon: typeof Palette }> = {
  graphics: { label: "Graphics", Icon: Palette },
  sound: { label: "Sound", Icon: Volume2 },
  game_features: { label: "Game Features", Icon: Gamepad2 },
  ai: { label: "AI", Icon: Bot },
  hardware: { label: "Hardware", Icon: Cpu },
};

function getPriorityBadge(priority: number | null) {
  switch (priority) {
    case 1:
      return (
        <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/50">
          Essential
        </Badge>
      );
    case 2:
      return (
        <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/50">
          Recommended
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary">
          Optional
        </Badge>
      );
  }
}

function ResearchCard({ item }: { item: ResearchItem }) {
  return (
    <Card data-testid={`research-card-${item.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{item.name}</CardTitle>
          {getPriorityBadge(item.priority)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              Y{item.unlockYear}
              {item.unlockMonth ? ` M${item.unlockMonth}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-muted-foreground" />
            <span>${item.researchCost.toLocaleString()}</span>
          </div>
          {item.researchPoints && (
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span>{item.researchPoints} RP</span>
            </div>
          )}
        </div>

        {item.prerequisiteIds && item.prerequisiteIds.length > 0 && (
          <div className="flex items-start gap-2 rounded-md bg-muted/50 p-2">
            <Link2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="text-muted-foreground">Requires: </span>
              <span>{item.prerequisiteIds.join(", ")}</span>
            </div>
          </div>
        )}

        {item.tip && (
          <div className="flex items-start gap-2 rounded-md bg-primary/5 p-3 border border-primary/10">
            <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-sm">{item.tip}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Research() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: researchItems, isLoading } = useQuery<ResearchItem[]>({
    queryKey: ["/api/research"],
  });

  const categories = Object.keys(categoryConfig);

  const filteredItems = researchItems?.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedItems = filteredItems?.reduce((acc, item) => {
    const category = item.category || "other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ResearchItem[]>);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FlaskConical className="h-6 w-6 text-primary" />
          Research Guide
        </h1>
        <p className="text-muted-foreground">
          Discover available research technologies and their optimal unlock timings
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search research..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-research-search"
          />
        </div>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
          {categories.map((cat) => {
            const config = categoryConfig[cat];
            const IconComponent = config?.Icon;
            return (
              <TabsTrigger key={cat} value={cat} data-testid={`tab-${cat}`} className="flex items-center gap-1">
                {IconComponent && <IconComponent className="h-4 w-4" />}
                {config?.label || cat}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredItems && filteredItems.length > 0 ? (
            activeCategory === "all" && groupedItems ? (
              <div className="space-y-8">
                {Object.entries(groupedItems).map(([category, items]) => {
                  const config = categoryConfig[category];
                  const IconComponent = config?.Icon;
                  return (
                  <div key={category} className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      {IconComponent && <IconComponent className="h-5 w-5" />}
                      {config?.label || category}
                      <Badge variant="outline">{items.length}</Badge>
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {items
                        .sort((a, b) => a.unlockYear - b.unlockYear)
                        .map((item) => (
                          <ResearchCard key={item.id} item={item} />
                        ))}
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems
                  .sort((a, b) => a.unlockYear - b.unlockYear)
                  .map((item) => (
                    <ResearchCard key={item.id} item={item} />
                  ))}
              </div>
            )
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Research Found</h3>
                <p className="text-muted-foreground">
                  {search ? "Try a different search term." : "No research items available."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
