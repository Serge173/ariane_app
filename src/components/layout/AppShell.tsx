"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CartToast } from "@/components/ui/CartToast";

export function AppShell({ children }: { children: React.ReactNode }) {
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
      <Header />
      <main className="flex-1 bg-white">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CartToast />
    </>
  );
}
