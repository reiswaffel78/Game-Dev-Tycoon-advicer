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
import type { Source } from "@shared/schema";

const trustLabels: Record<number, string> = {
  4: "Very High",
  3: "High",
  2: "Medium",
  1: "Low",
};

const trustColors: Record<number, string> = {
  4: "bg-emerald-500",
  3: "bg-teal-500",
  2: "bg-amber-500",
  1: "bg-slate-500",
};

function SourceCard({ source }: { source: Source }) {
  const lastFetched = source.lastFetchedAt
    ? new Date(source.lastFetchedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Never";

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
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  <XCircle className="h-3 w-3 mr-1" />
                  Inactive
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
                <span className="text-muted-foreground">Trust:</span>
                <Badge
                  className={`${trustColors[source.trustLevel]} text-white border-0 text-xs`}
                >
                  {trustLabels[source.trustLevel] ?? source.trustLevel}
                </Badge>
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Last fetched: {lastFetched}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Sources() {
  const { data: sources, isLoading } = useQuery<Source[]>({
    queryKey: ["/api/sources"],
  });

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <SeoHead pageKey="sources" />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" />
          Data Sources
        </h1>
        <p className="text-muted-foreground">
          View the whitelisted sources used for data ingestion and their trust
          levels
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trust Level Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            When multiple sources provide conflicting data, higher trust sources
            take priority. The scoring formula weighs these accordingly:
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
                  {trustLabels[level]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Configured Sources</h2>
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
              <h3 className="text-lg font-medium mb-2">No Sources Configured</h3>
              <p className="text-muted-foreground">
                Data sources will appear here once configured.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
