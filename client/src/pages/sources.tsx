import { useQuery } from "@tanstack/react-query";
import {
  Database,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SeoHead } from "@/seo/SeoHead";
import { useTranslation } from "react-i18next";
import type { Source } from "@shared/schema";

const trustColors: Record<number, string> = {
  4: "bg-emerald-500",
  3: "bg-teal-500",
  2: "bg-amber-500",
  1: "bg-slate-500",
};

function SourceCard({ source }: { source: Source }) {
  const { t, i18n } = useTranslation();

  const lastFetched = source.lastFetchedAt
    ? new Date(source.lastFetchedAt).toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : t("sources.never");

  const trustLabelKeys: Record<number, string> = {
    4: t("sources.trustLabels.veryHigh"),
    3: t("sources.trustLabels.high"),
    2: t("sources.trustLabels.medium"),
    1: t("sources.trustLabels.low"),
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
              source.isActive ? "bg-primary/10" : "bg-muted"
            }`}
          >
            <Database
              className={`h-5 w-5 ${source.isActive ? "text-primary" : "text-muted-foreground"}`}
            />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold">{source.name}</h3>
              {source.isActive ? (
                <Badge
                  variant="outline"
                  className="text-xs border-emerald-500/50 text-emerald-600 dark:text-emerald-400"
                  data-testid="badge-active"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {t("sources.active")}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs" data-testid="badge-inactive">
                  <XCircle className="h-3 w-3 mr-1" />
                  {t("sources.inactive")}
                </Badge>
              )}
            </div>
            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                {source.url}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{t("sources.trustPrefix")}:</span>
                <Badge
                  className={`${trustColors[source.trustLevel]} text-white border-0 text-xs`}
                >
                  {trustLabelKeys[source.trustLevel] ?? source.trustLevel}
                </Badge>
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {t("sources.lastFetched")}: {lastFetched}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Sources() {
  const { t } = useTranslation();
  const { data: sources, isLoading } = useQuery<Source[]>({
    queryKey: ["/api/sources"],
  });

  const trustLevelKeys: Record<number, string> = {
    4: t("sources.trustLabels.veryHigh"),
    3: t("sources.trustLabels.high"),
    2: t("sources.trustLabels.medium"),
    1: t("sources.trustLabels.low"),
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <SeoHead pageKey="sources" />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2" data-testid="text-sources-title">
          <Database className="h-6 w-6 text-primary" />
          {t("sources.title")}
        </h1>
        <p className="text-muted-foreground" data-testid="text-sources-subtitle">
          {t("sources.subtitle")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("sources.trustPriorityTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {t("sources.trustPriorityBody")}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[4, 3, 2, 1].map((level) => (
              <div
                key={level}
                className="flex items-center gap-2 p-3 rounded-md bg-muted/50"
              >
                <Badge
                  className={`${trustColors[level]} text-white border-0 shrink-0`}
                >
                  {level}
                </Badge>
                <span className="text-sm font-medium">
                  {trustLevelKeys[level]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold" data-testid="text-configured-sources">{t("sources.configuredSources")}</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sources && sources.length > 0 ? (
          <div className="space-y-3">
            {sources.map((source) => (
              <SourceCard key={source.id} source={source} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Database className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium mb-2" data-testid="text-no-sources">{t("sources.noSources")}</h3>
              <p className="text-muted-foreground">
                {t("sources.noSourcesBody")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
