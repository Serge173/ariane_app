"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard =
    pathname.startsWith("/admin") || pathname.startsWith("/mon-espace");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
