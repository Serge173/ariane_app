"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { isAdmin } from "@/lib/auth";
import { getDashboardPath, publicNav } from "@/lib/navigation";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { MobileNav } from "@/components/layout/MobileNav";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.itemCount());

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const dashboardHref = session ? getDashboardPath(session.user.role) : "/connexion";
  const isUserAdmin = session && isAdmin(session.user.role);
  const accountLabel = isUserAdmin ? "Administration" : "Mon espace";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          "bg-transparent border-b border-transparent backdrop-blur-none",
          "lg:bg-white/70 lg:backdrop-blur-md lg:border-brand-200/40",
          scrolled && "lg:bg-white/88 lg:shadow-sm lg:border-brand-200/60",
          isOpen && "bg-transparent border-transparent"
        )}
      >
        <div className="container-premium">
          <div className="flex items-center justify-between h-16 lg:h-[4.25rem] gap-3 lg:gap-5">
            <Link href="/" className="group shrink-0 min-w-0" onClick={() => setIsOpen(false)}>
              <span className="font-display text-xl lg:text-2xl font-light tracking-wide text-brand-950 leading-tight">
                Conseil en Image
              </span>
              <span className="block text-[10px] uppercase tracking-ultra text-brand-700 -mt-0.5">
                avec Ariane
              </span>
            </Link>

            <nav className="hidden lg:flex items-center justify-center gap-5 xl:gap-6 flex-1 min-w-0 px-2">
              {publicNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "highlight" in item && item.highlight
                      ? "nav-link-highlight shrink-0"
                      : "nav-link shrink-0"
                  }
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              <Link
                href="/panier"
                className="relative p-2 text-black"
                aria-label="Panier"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-950 text-white text-[10px] flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>

              {session ? (
                <Link
                  href={dashboardHref}
                  className="hidden sm:flex p-0.5 rounded-full hover:ring-2 hover:ring-brand-200 transition-all"
                  aria-label={accountLabel}
                  title={session.user.name ?? accountLabel}
                >
                  <ProfileAvatar
                    src={session.user.image}
                    name={session.user.name}
                    size="md"
                  />
                </Link>
              ) : (
                <Link
                  href="/connexion"
                  className="hidden sm:inline-flex font-sans text-xs uppercase tracking-wide font-medium text-black px-3 py-1.5"
                >
                  Connexion
                </Link>
              )}

              <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className="lg:hidden flex items-center gap-2 pl-2 pr-1 py-2 text-black"
                aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={isOpen}
              >
                {!isOpen && (
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em]">
                    Menu
                  </span>
                )}
                {isOpen ? (
                  <X className="w-5 h-5" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-5 h-5" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav
        open={isOpen}
        onClose={() => setIsOpen(false)}
        session={session}
        dashboardHref={dashboardHref}
        accountLabel={accountLabel}
        itemCount={itemCount}
        mounted={mounted}
      />
    </>
  );
}
