"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { isAdmin } from "@/lib/auth";
import { getDashboardPath, publicNav } from "@/lib/navigation";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { MobileNav } from "@/components/layout/MobileNav";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.itemCount());
  const pulseAt = useCartStore((s) => s.pulseAt);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!pulseAt) return;
    setPulse(true);
    const timer = window.setTimeout(() => setPulse(false), 280);
    return () => window.clearTimeout(timer);
  }, [pulseAt]);

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

  const headerSurface =
    isHome || scrolled || isOpen
      ? "bg-white/95 backdrop-blur-sm border-b border-brand-100 shadow-sm"
      : "lg:bg-white/95 lg:backdrop-blur-sm lg:border-b lg:border-brand-100 lg:shadow-sm bg-transparent border-transparent";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow] duration-[var(--duration-short)]",
          headerSurface
        )}
      >
        <div className="container-premium">
          <div className="flex items-center h-14 sm:h-16 lg:h-[4.25rem] gap-2 lg:gap-0">
            <Link href="/" className="group shrink-0 min-w-0" onClick={() => setIsOpen(false)}>
              <span className="font-display text-lg sm:text-xl lg:text-2xl font-light tracking-wide text-brand-950 leading-tight">
                Conseil en Image
              </span>
              <span className="block text-[9px] sm:text-[10px] uppercase tracking-ultra text-brand-600 -mt-0.5">
                avec Ariane
              </span>
            </Link>

            <div className="hidden lg:block flex-1 min-w-10 xl:min-w-16" aria-hidden />

            <nav className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0 mr-5 xl:mr-8">
              {publicNav.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      "highlight" in item && item.highlight
                        ? "nav-link-highlight shrink-0"
                        : cn("nav-link shrink-0", isActive && "nav-link-active")
                    }
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1 sm:gap-3 shrink-0 ml-auto lg:ml-0">
              <Link
                href="/panier"
                className="relative p-2 text-brand-800 hover:text-brand-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
                aria-label="Panier"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {mounted && itemCount > 0 && (
                  <span
                    className={cn(
                      "absolute -top-0.5 -right-0.5 min-w-[1rem] h-4 px-1 bg-accent text-white text-[10px] flex items-center justify-center rounded-full",
                      pulse && "animate-cart-pulse"
                    )}
                  >
                    {itemCount}
                  </span>
                )}
              </Link>

              {session ? (
                <Link
                  href={dashboardHref}
                  className="hidden sm:flex p-0.5 rounded-full hover:ring-2 hover:ring-accent/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
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
                  className="hidden sm:inline-flex font-sans text-xs uppercase tracking-wide font-medium text-brand-800 hover:text-brand-950 px-3 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  Connexion
                </Link>
              )}

              <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className="lg:hidden flex items-center gap-2 pl-2 pr-1 py-2 text-brand-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
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
