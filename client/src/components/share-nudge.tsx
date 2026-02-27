import { useTranslation } from "react-i18next";
import { useShareNudge } from "@/hooks/use-share-nudge";
import { Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareNudge() {
  const { visible, dismiss, handleShare } = useShareNudge();
  const { t } = useTranslation();

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-[875ms]"
      role="dialog"
      aria-label="Share this tool"
      data-testid="share-nudge"
    >
      <div className="rounded-xl border bg-card text-card-foreground shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 mt-0.5">
            <Share2 className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium leading-snug">{t("shareNudge.text")}</p>
            <Button
              size="sm"
              onClick={handleShare}
              className="gap-2"
              data-testid="button-share-nudge"
            >
              <Share2 className="h-3.5 w-3.5" />
              {t("shareNudge.shareButton")}
            </Button>
          </div>
          <button
            onClick={dismiss}
            className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
            data-testid="button-share-nudge-close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
