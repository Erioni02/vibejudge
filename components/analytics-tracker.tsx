"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { markBrowserInternal, trackPageView } from "@/lib/analytics/client";

/** Records one page view per route change. The private admin area is never tracked. */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin-analytics")) {
      markBrowserInternal();
      return;
    }
    trackPageView();
  }, [pathname]);

  return null;
}
