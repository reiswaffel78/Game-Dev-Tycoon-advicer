import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CalendarClock,
  Save,
  Gamepad2,
  Users,
  DollarSign,
  Calendar,
  Sparkles,
  FlaskConical,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Platform, PlannerRecommendation } from "@shared/schema";

const saveStateSchema = z.object({
  year: z.number().min(1).max(50),
  month: z.number().min(1).max(12),
  week: z.number().min(1).max(4),
  cash: z.number().min(0),
  fans: z.number().min(0),
  unlockedOnly: z.boolean(),
});

type SaveStateForm = z.infer<typeof saveStateSchema>;

const sizeLabels = {
  small: "Small",
  medium: "Medium",
  large: "Large",
  aaa: "AAA",
};

const sizeColors = {
  small: "bg-slate-500",
  medium: "bg-blue-500",
  large: "bg-purple-500",
  aaa: "bg-amber-500",
};

function ReleaseCard({
  release,
  index,
}: {
  release: PlannerRecommendation["releases"][0];
  index: number;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">{release.topic.name}</span>
              <span className="text-muted-foreground">+</span>
              <span className="font-semibold">{release.genre.name}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{release.platform.name}</Badge>
              <Badge variant="secondary">{release.audience.name}</Badge>
              <Badge
                className={`${sizeColors[release.size]} text-white border-0`}
              >
                {sizeLabels[release.size]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{release.rationale}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResearchCard({
  item,
  index,
}: {
  item: PlannerRecommendation["researchItems"][0];
  index: number;
}) {
  const typeColors = {
    topic: "bg-violet-500",
    genre: "bg-teal-500",
    feature: "bg-orange-500",
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold text-sm">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{item.name}</span>
              <Badge
                className={`${typeColors[item.type]} text-white border-0 text-xs`}
              >
                {item.type}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <FlaskConical className="h-3.5 w-3.5" />
                {item.cost.toLocaleString()} RP
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{item.rationale}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Planner() {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<PlannerRecommendation | null>(null);

  const form = useForm<SaveStateForm>({
    resolver: zodResolver(saveStateSchema),
    defaultValues: {
      year: 1,
      month: 1,
      week: 1,
      cash: 70000,
      fans: 0,
      unlockedOnly: false,
    },
  });

  const planMutation = useMutation({
    mutationFn: async (data: SaveStateForm) => {
      const res = await apiRequest("POST", "/api/planner", data);
      return res.json() as Promise<PlannerRecommendation>;
    },
    onSuccess: (data) => {
      setRecommendations(data);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SaveStateForm) => {
    planMutation.mutate(data);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <CalendarClock className="h-6 w-6 text-primary" />
          Game Planner
        </h1>
        <p className="text-muted-foreground">
          Enter your current save state to get personalized recommendations for
          your next releases and research priorities
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[400px,1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save State
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Year</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 1)
                            }
                            data-testid="input-year"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="month"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Month</FormLabel>
                        <FormControl>
                          <Select
                            value={String(field.value)}
                            onValueChange={(v) => field.onChange(parseInt(v))}
                          >
                            <SelectTrigger data-testid="select-month">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[...Array(12)].map((_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1)}>
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="week"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Week</FormLabel>
                        <FormControl>
                          <Select
                            value={String(field.value)}
                            onValueChange={(v) => field.onChange(parseInt(v))}
                          >
                            <SelectTrigger data-testid="select-week">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4].map((w) => (
                                <SelectItem key={w} value={String(w)}>
                                  {w}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="cash"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5" />
                        Cash
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          data-testid="input-cash"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fans"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        Fans
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          data-testid="input-fans"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unlockedOnly"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-md border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">Unlocked Only</FormLabel>
                        <FormDescription className="text-xs">
                          Only recommend items you've already researched
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-unlocked-only"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={planMutation.isPending}
                  data-testid="btn-generate-plan"
                >
                  {planMutation.isPending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Plan
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {!recommendations && !planMutation.isPending ? (
            <Card>
              <CardContent className="py-16 text-center">
                <CalendarClock className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Configure Your Save State
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Enter your current game progress to receive personalized
                  recommendations for the next 10 releases and 5 research
                  priorities
                </p>
              </CardContent>
            </Card>
          ) : planMutation.isPending ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : recommendations ? (
            <>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  Recommended Releases
                  <Badge variant="secondary">
                    {recommendations.releases.length}
                  </Badge>
                </h2>
                <div className="grid gap-3">
                  {recommendations.releases.map((release, i) => (
                    <ReleaseCard key={i} release={release} index={i} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-accent" />
                  Research Priorities
                  <Badge variant="secondary">
                    {recommendations.researchItems.length}
                  </Badge>
                </h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {recommendations.researchItems.map((item, i) => (
                    <ResearchCard key={i} item={item} index={i} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarClock className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No Recommendations Available
                </h3>
                <p className="text-muted-foreground">
                  Unable to generate recommendations. Please try again.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
