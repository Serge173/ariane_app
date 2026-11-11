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

  if (isOffers) {
    return (
      <div
        className="offres-app-shell flex min-h-screen flex-col"
        style={{ backgroundColor: "#ffffff" }}
      >
        <Header siteSettings={siteSettings} />
        <main className="flex-1" style={{ backgroundColor: "#ffffff" }}>
          {children}
        </main>
        <WhatsAppButton />
        <CartToast />
        <NewsletterPopup />
      </div>
    );
  }

  return (
    <>
      <Header siteSettings={siteSettings} />
      <main className="flex-1 bg-surface-cream">{children}</main>
      <Footer siteSettings={siteSettings} />
      <WhatsAppButton />
      <CartToast />
      <NewsletterPopup />
    </>
  );
}
