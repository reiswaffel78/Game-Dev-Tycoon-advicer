import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { SeoHead } from "@/seo/SeoHead";
import { BASE_URL } from "@/seo/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  ClipboardList,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Circle,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { TimelineMilestone, UserChecklistItem } from "@shared/schema";

function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem("gdtAdvisorSessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("gdtAdvisorSessionId", sessionId);
  }
  return sessionId;
}

interface ChecklistItemWithMilestone extends UserChecklistItem {
  milestone?: TimelineMilestone;
}

function importanceColor(importance: string) {
  switch (importance) {
    case "critical": return "text-red-600 dark:text-red-400";
    case "high": return "text-amber-600 dark:text-amber-400";
    case "medium": return "text-blue-600 dark:text-blue-400";
    default: return "text-muted-foreground";
  }
}

function importanceBadge(importance: string, t: (key: string) => string) {
  switch (importance) {
    case "critical": return <Badge variant="destructive" className="text-xs">{t("timeline.critical")}</Badge>;
    case "high": return <Badge className="bg-amber-600 text-xs">{t("timeline.high")}</Badge>;
    case "medium": return <Badge variant="secondary" className="text-xs">{t("timeline.medium")}</Badge>;
    default: return <Badge variant="outline" className="text-xs">{t("timeline.low")}</Badge>;
  }
}

export default function ChecklistPage() {
  const { t } = useTranslation();
  // Initialize empty for SSR, set real ID after hydration
  const [sessionId, setSessionId] = useState("");
  const [newItemText, setNewItemText] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
  
  // Load sessionId after hydration to avoid SSR mismatch
  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  const { data: rawChecklistItems, isLoading: isLoadingChecklist } = useQuery<UserChecklistItem[]>({
    queryKey: ["/api/checklist", sessionId],
    enabled: !!sessionId, // Wait until sessionId is set after hydration
  });

  const { data: milestones, isLoading: isLoadingMilestones } = useQuery<TimelineMilestone[]>({
    queryKey: ["/api/timeline"],
  });

  const milestoneMap = useMemo(() => {
    if (!milestones) return new Map<string, TimelineMilestone>();
    return new Map(milestones.map(m => [m.id, m]));
  }, [milestones]);

  const checklistItems = useMemo<ChecklistItemWithMilestone[] | undefined>(() => {
    if (!rawChecklistItems) return undefined;
    return rawChecklistItems.map(item => ({
      ...item,
      milestone: item.milestoneId ? milestoneMap.get(item.milestoneId) : undefined,
    }));
  }, [rawChecklistItems, milestoneMap]);

  const createItemMutation = useMutation({
    mutationFn: async (data: { sessionId: string; milestoneId?: string; customText?: string }) => {
      return apiRequest("POST", "/api/checklist", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/checklist", sessionId] });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      return apiRequest("PATCH", `/api/checklist/${id}`, { isCompleted });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/checklist", sessionId] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/checklist/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/checklist", sessionId] });
    },
  });

  const addCustomItem = () => {
    if (!newItemText.trim()) return;
    createItemMutation.mutate({ sessionId, customText: newItemText.trim() });
    setNewItemText("");
  };

  const addMilestoneToChecklist = (milestoneId: string) => {
    createItemMutation.mutate({ sessionId, milestoneId });
  };

  const toggleItem = (id: string, currentStatus: boolean) => {
    updateItemMutation.mutate({ id, isCompleted: !currentStatus });
  };

  const resetProgress = () => {
    if (checklistItems) {
      checklistItems.forEach(item => {
        if (item.isCompleted) {
          updateItemMutation.mutate({ id: item.id, isCompleted: false });
        }
      });
    }
  };

  const completedCount = checklistItems?.filter(item => item.isCompleted).length ?? 0;
  const totalCount = checklistItems?.length ?? 0;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const existingMilestoneIds = new Set(checklistItems?.map(item => item.milestoneId).filter(Boolean));

  const criticalMilestones = milestones?.filter(
    m => (m.importance === "critical" || m.importance === "high") && !existingMilestoneIds.has(m.id)
  ).slice(0, 10);

  const sortedItems = checklistItems
    ?.slice()
    .sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
      const yearA = a.milestone?.year ?? 0;
      const yearB = b.milestone?.year ?? 0;
      return yearA - yearB;
    });

  const visibleItems = showCompleted ? sortedItems : sortedItems?.filter(item => !item.isCompleted);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <SeoHead pageKey="checklist" jsonLdExtra={useMemo(() => ({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: t("checklist.title"),
        description: t("checklist.subtitle"),
        url: `${BASE_URL}/checklist`,
        inLanguage: t("lang", { defaultValue: "en" }),
        step: (t("schema.checklist.steps", { returnObjects: true }) as string[]).map((text, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: (t("schema.checklist.stepNames", { returnObjects: true }) as string[])[i],
          text,
        })),
      }), [t])} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <ClipboardList className="h-8 w-8 text-primary" />
          {t("checklist.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("checklist.subtitle")}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            {t("checklist.progressOverview")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-2">
            <Progress value={progressPercent} className="flex-1" />
            <span className="text-sm font-medium min-w-[80px] text-right">
              {completedCount} / {totalCount}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {progressPercent === 100 && totalCount > 0
              ? t("checklist.allCompleted")
              : progressPercent > 50
              ? t("checklist.makingProgress")
              : t("checklist.keepGoing")}
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex-1 flex items-center gap-2">
          <Input
            placeholder={t("checklist.addTask")}
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomItem()}
            className="max-w-xs"
            data-testid="input-custom-task"
          />
          <Button
            onClick={addCustomItem}
            disabled={!newItemText.trim() || createItemMutation.isPending}
            size="icon"
            data-testid="button-add-task"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCompleted(!showCompleted)}
            data-testid="button-toggle-completed"
          >
            {showCompleted ? <CheckCircle2 className="h-4 w-4 mr-1" /> : <Circle className="h-4 w-4 mr-1" />}
            {showCompleted ? t("checklist.hideCompleted") : t("checklist.showCompleted")}
          </Button>
          {completedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetProgress}
              disabled={updateItemMutation.isPending}
              data-testid="button-reset-progress"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              {t("common.reset")}
            </Button>
          )}
        </div>
      </div>

      {isLoadingChecklist || isLoadingMilestones ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : visibleItems && visibleItems.length > 0 ? (
        <Card>
          <CardContent className="divide-y p-0">
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 ${item.isCompleted ? "opacity-60" : ""}`}
                data-testid={`checklist-item-${item.id}`}
              >
                <Checkbox
                  checked={item.isCompleted ?? false}
                  onCheckedChange={() => toggleItem(item.id, item.isCompleted ?? false)}
                  data-testid={`checkbox-${item.id}`}
                />
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${item.isCompleted ? "line-through text-muted-foreground" : ""}`}>
                    {item.customText || (item.milestone ? (() => { const k = `timeline.items.${item.milestone.id}.title`; return t(k) !== k ? t(k) : item.milestone.title; })() : null)}
                  </p>
                  {item.milestone && (
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {t("common.year")} {item.milestone.year}
                      {item.milestone.month && ` ${t("common.monthPrefix")}${item.milestone.month}`}
                      {importanceBadge(item.milestone.importance || "medium", t)}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteItemMutation.mutate(item.id)}
                  disabled={deleteItemMutation.isPending}
                  data-testid={`button-delete-${item.id}`}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">{t("checklist.noItemsYet")}</h3>
            <p className="text-muted-foreground">
              {t("checklist.addItemsHint")}
            </p>
          </CardContent>
        </Card>
      )}

      {criticalMilestones && criticalMilestones.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {t("checklist.suggestedMilestones")}
          </h2>
          <p className="text-muted-foreground mb-4 text-sm">
            {t("checklist.suggestedMilestonesHint")}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {criticalMilestones.map((milestone) => (
              <Card
                key={milestone.id}
                className="hover-elevate cursor-pointer"
                onClick={() => addMilestoneToChecklist(milestone.id)}
                data-testid={`milestone-suggestion-${milestone.id}`}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <Plus className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{(() => { const k = `timeline.items.${milestone.id}.title`; return t(k) !== k ? t(k) : milestone.title; })()}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{t("common.year")} {milestone.year}</span>
                      {importanceBadge(milestone.importance || "medium", t)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
