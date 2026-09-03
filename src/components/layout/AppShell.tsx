"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CartToast } from "@/components/ui/CartToast";
import type { SiteSettings } from "@/lib/site-settings";

export function AppShell({
  children,
  siteSettings,
}: {
  children: React.ReactNode;
  siteSettings: SiteSettings;
}) {
  const pathname = usePathname();
  const hidePublicChrome =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/mon-espace") ||
    pathname === "/connexion";

  if (hidePublicChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Header siteSettings={siteSettings} />
      <main className="flex-1 bg-white">{children}</main>
      <Footer siteSettings={siteSettings} />
      <WhatsAppButton />
      <CartToast />
    </>
  );
}
