import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const LS_INTERACTIONS = "gdt_share_interactions";
const LS_LAST_SHOWN = "gdt_share_last_shown_ts";
const SS_DISMISSED = "gdt_share_dismissed_session";
const INTERACTIONS_REQUIRED = 2;
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
const SHOW_DELAY_MS = 5000;

function getInteractions(): number {
  const v = localStorage.getItem(LS_INTERACTIONS);
  return v ? (Number(v) || 0) : 0;
}

function getLastShown(): number {
  const v = localStorage.getItem(LS_LAST_SHOWN);
  return v ? (Number(v) || 0) : 0;
}

function isDismissedThisSession(): boolean {
  return sessionStorage.getItem(SS_DISMISSED) === "1";
}

function isEligible(count?: number): boolean {
  if (isDismissedThisSession()) return false;
  const last = getLastShown();
  if (last && (Date.now() - last) < COOLDOWN_MS) return false;
  const n = count !== undefined ? count : getInteractions();
  return n >= INTERACTIONS_REQUIRED;
}

interface ShareNudgeContextValue {
  registerInteraction: () => void;
  shouldShow: boolean;
  visible: boolean;
  dismiss: () => void;
  handleShare: () => Promise<void>;
}

export const ShareNudgeContext = createContext<ShareNudgeContextValue | null>(null);

export function useShareNudge() {
  const ctx = useContext(ShareNudgeContext);
  if (!ctx) throw new Error("useShareNudge must be used within ShareNudgeProvider");
  return ctx;
}

export function useShareNudgeProvider() {
  const [shouldShow, setShouldShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const delayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      if (delayTimer.current) clearTimeout(delayTimer.current);
    };
  }, []);

  const triggerShow = useCallback(() => {
    if (shouldShow || visible) return;
    setShouldShow(true);
    delayTimer.current = setTimeout(() => {
      setVisible(true);
    }, SHOW_DELAY_MS);
  }, [shouldShow, visible]);

  const registerInteraction = useCallback(() => {
    const n = getInteractions() + 1;
    localStorage.setItem(LS_INTERACTIONS, String(n));
    if (isEligible(n)) {
      triggerShow();
    }
  }, [triggerShow]);

  const dismiss = useCallback(() => {
    sessionStorage.setItem(SS_DISMISSED, "1");
    localStorage.setItem(LS_LAST_SHOWN, String(Date.now()));
    setVisible(false);
    setShouldShow(false);
    if (delayTimer.current) clearTimeout(delayTimer.current);
  }, []);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const title = document.title || "Game Dev Tycoon Advisor";
    const text = t("shareNudge.shareText", { defaultValue: "I used this to optimize my Game Dev Tycoon gameplay:" });

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        localStorage.setItem(LS_LAST_SHOWN, String(Date.now()));
        toast({ description: t("shareNudge.shared") });
        dismiss();
        return;
      }
    } catch {
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      localStorage.setItem(LS_LAST_SHOWN, String(Date.now()));
      toast({ description: t("shareNudge.copied") });
      dismiss();
    } catch {
      window.prompt("Copy this link:", url);
      localStorage.setItem(LS_LAST_SHOWN, String(Date.now()));
      dismiss();
    }
  }, [dismiss, toast, t]);

  return { registerInteraction, shouldShow, visible, dismiss, handleShare };
}

export function ShareNudgeProvider({ children }: { children: ReactNode }) {
  const value = useShareNudgeProvider();
  return (
    <ShareNudgeContext.Provider value={value}>
      {children}
    </ShareNudgeContext.Provider>
  );
}
