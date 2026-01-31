import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Users, Search, Calendar, Briefcase, GraduationCap, Zap, Target, ClipboardList } from "lucide-react";
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

const phaseKeys: Record<string, { label: string; desc: string }> = {
  garage: { label: "staff.garage", desc: "staff.garageDesc" },
  first_office: { label: "staff.firstOffice", desc: "staff.firstOfficeDesc" },
  second_office: { label: "staff.secondOffice", desc: "staff.secondOfficeDesc" },
  rd_lab: { label: "staff.rdLab", desc: "staff.rdLabDesc" },
  hardware_lab: { label: "staff.hardwareLab", desc: "staff.hardwareLabDesc" },
};

const categoryIcons: Record<string, typeof Users> = {
  hiring: Users,
  training: GraduationCap,
  skills: Zap,
  specialists: Target,
};

function getPriorityBadge(priority: number | null, t: (key: string) => string) {
  switch (priority) {
    case 1:
      return (
        <Badge className="bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/50">
          {t("staff.critical")}
        </Badge>
      );
    case 2:
      return (
        <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/50">
          {t("staff.important")}
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary">
          {t("staff.niceToHave")}
        </Badge>
      );
  }
}

const getCategoryLabel = (category: string, t: (key: string) => string) => {
  const labels: Record<string, string> = {
    hiring: t("staff.categories.hiring"),
    training: t("staff.categories.training"),
    skills: t("staff.categories.skills"),
    specialists: t("staff.categories.specialists"),
  };
  return labels[category] || category;
};

function TipCard({ tip, t }: { tip: StaffTip; t: (key: string) => string }) {
  const CategoryIcon = categoryIcons[tip.category] || ClipboardList;
  
  return (
    <Card data-testid={`staff-tip-${tip.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <CategoryIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{tip.title}</CardTitle>
          </div>
          {getPriorityBadge(tip.priority, t)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{tip.description}</p>
        
        <div className="flex items-center gap-4 flex-wrap text-sm">
          <Badge variant="outline" className="capitalize">
            <Briefcase className="h-3 w-3 mr-1" />
            {getCategoryLabel(tip.category, t)}
          </Badge>
          
          {(tip.minYear || tip.maxYear) && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {tip.minYear && tip.maxYear
                  ? `${t("staff.years")} ${tip.minYear}-${tip.maxYear}`
                  : tip.minYear
                    ? `${t("staff.fromYear")} ${tip.minYear}`
                    : `${t("staff.untilYear")} ${tip.maxYear}`}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Staff() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [activePhase, setActivePhase] = useState("all");

  const { data: staffTips, isLoading } = useQuery<StaffTip[]>({
    queryKey: ["/api/staff-tips"],
  });

  const phases = Object.keys(phaseKeys);

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
          {t("staff.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("staff.subtitle")}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("staff.searchStaffTips")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-staff-search"
          />
        </div>
      </div>

      <Tabs value={activePhase} onValueChange={setActivePhase}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all" data-testid="tab-all-phases">{t("staff.allPhases")}</TabsTrigger>
          {phases.map((phase) => (
            <TabsTrigger key={phase} value={phase} data-testid={`tab-${phase}`}>
              {t(phaseKeys[phase]?.label) || phase}
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
                          {t(phaseKeys[phase]?.label) || phase}
                        </span>
                        <Badge variant="outline">{tips.length} {t("staff.tips")}</Badge>
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                          {t(phaseKeys[phase]?.desc)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="grid gap-4 md:grid-cols-2 pt-2">
                        {tips
                          .sort((a, b) => (a.priority || 3) - (b.priority || 3))
                          .map((tip) => (
                            <TipCard key={tip.id} tip={tip} t={t} />
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
                    <TipCard key={tip.id} tip={tip} t={t} />
                  ))}
              </div>
            )
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("staff.noTipsFound")}</h3>
                <p className="text-muted-foreground">
                  {search ? t("research.tryDifferentSearch") : t("staff.noTipsAvailable")}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
