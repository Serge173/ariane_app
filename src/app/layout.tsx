import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { AppShell } from "@/components/layout/AppShell";
import { SiteExtras } from "@/components/layout/SiteExtras";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { getSiteSettings } from "@/lib/site-settings";
import { getRootMetadata } from "@/lib/site-metadata";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata = getRootMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();

  return (
    <html lang="fr" className={`${inter.variable} ${cormorant.variable}`}>
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
