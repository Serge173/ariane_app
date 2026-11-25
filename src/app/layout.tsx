import "./brand-fonts.css";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { AppShell } from "@/components/layout/AppShell";
import { SiteExtras } from "@/components/layout/SiteExtras";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { DEFAULT_SITE_SETTINGS, getSiteSettings } from "@/lib/site-settings";
import { getRootMetadata } from "@/lib/site-metadata";

export const metadata = getRootMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let siteSettings = DEFAULT_SITE_SETTINGS;
  try {
    siteSettings = await getSiteSettings();
  } catch (error) {
    console.error("[RootLayout] getSiteSettings failed", error);
  }

  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <SiteJsonLd />
        <Providers>
          <AppShell siteSettings={siteSettings}>{children}</AppShell>
          <SiteExtras />
        </Providers>
      </body>
    </html>
  );
}
