import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { AppShell } from "@/components/layout/AppShell";
import { getSiteSettings } from "@/lib/site-settings";

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

export const metadata: Metadata = {
  title: {
    default: "Conseil en Image avec Ariane | Coaching Premium Abidjan",
    template: "%s | Conseil en Image avec Ariane",
  },
  description:
    "Plateforme premium de conseil en image, coaching personnel et professionnel à Abidjan. Découvrez votre accompagnement, réservez et suivez votre parcours de transformation.",
  keywords: [
    "conseil en image",
    "coaching image",
    "Abidjan",
    "Côte d'Ivoire",
    "colorimétrie",
    "personal shopping",
    "image professionnelle",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Conseil en Image avec Ariane",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();

  return (
    <html lang="fr" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <AppShell siteSettings={siteSettings}>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
