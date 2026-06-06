import { useState } from "react";

const LS_KEY = "gdt_last_visit_date";

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useFirstVisitToday(): boolean {
  const [isFirst] = useState<boolean>(() => {
    try {
      const today = getTodayString();
      const last = localStorage.getItem(LS_KEY);
      if (last !== today) {
        localStorage.setItem(LS_KEY, today);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });

  return isFirst;
}
