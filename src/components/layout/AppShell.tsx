"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import type { SiteSettings } from "@/lib/site-settings";

const CartToast = dynamic(
  () => import("@/components/ui/CartToast").then((m) => m.CartToast),
  { ssr: false }
);
const NewsletterPopup = dynamic(
  () => import("@/components/newsletter/NewsletterPopup").then((m) => m.NewsletterPopup),
  { ssr: false }
);

export function AppShell({
  children,
  siteSettings,
}: {
  children: React.ReactNode;
  siteSettings: SiteSettings;
}) {
  const pathname = usePathname();
  const isOffers = pathname.startsWith("/offres");
  const hidePublicChrome =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/mon-espace") ||
    pathname === "/connexion";

  if (hidePublicChrome) {
    return <>{children}</>;
  }

  return (
    <div
      className={
        isOffers
          ? "offres-app-shell flex min-h-screen min-h-[100dvh] flex-col"
          : "public-app-shell flex min-h-screen min-h-[100dvh] flex-col"
      }
      style={isOffers ? { backgroundColor: "#ffffff" } : undefined}
    >
      <Header siteSettings={siteSettings} />
      <main
        className={`relative z-0 flex-1 ${isOffers ? "offres-surface" : "bg-surface-cream"}`}
        style={isOffers ? { backgroundColor: "#ffffff" } : undefined}
      >
        {children}
      </main>
      <Footer siteSettings={siteSettings} />
      <WhatsAppButton />
      <CartToast />
      <NewsletterPopup />
    </div>
  );
}
