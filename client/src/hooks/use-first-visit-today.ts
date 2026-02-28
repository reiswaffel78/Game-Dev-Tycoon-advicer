import { useState, useEffect } from "react";

const STORAGE_KEY = "gdt-last-visit";

export function useFirstVisitToday(): boolean {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const today = new Date().toISOString().slice(0, 10);
    const lastVisit = localStorage.getItem(STORAGE_KEY);
    if (lastVisit !== today) {
      localStorage.setItem(STORAGE_KEY, today);
      setShouldAnimate(true);
    }
  }, []);

  return shouldAnimate;
}
