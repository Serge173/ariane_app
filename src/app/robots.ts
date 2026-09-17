import type { MetadataRoute } from "next";
import { resolveAppUrl } from "@/lib/app-url";

export default function robots(): MetadataRoute.Robots {
  const base = resolveAppUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/mon-espace/", "/api/", "/connexion"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
