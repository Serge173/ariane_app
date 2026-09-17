"use client";

import { Analytics } from "@vercel/analytics/react";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { CookieConsent } from "@/components/legal/CookieConsent";

export function SiteExtras() {
  return (
    <>
      <Analytics />
      <AnalyticsScripts />
      <CookieConsent />
    </>
  );
}
