"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Menu, X, ShoppingBag, User, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { isAdmin } from "@/lib/auth";
import { getDashboardPath, publicNav } from "@/lib/navigation";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";

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

  const dashboardHref = session ? getDashboardPath(session.user.role) : "/connexion";
  const isUserAdmin = session && isAdmin(session.user.role);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container-premium">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="group">
            <span className="font-display text-xl lg:text-2xl font-light tracking-wide text-brand-950">
              Conseil en Image
            </span>
            <span className="block text-[10px] uppercase tracking-ultra text-brand-500 -mt-0.5">
              avec Ariane
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {publicNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "highlight" in item && item.highlight
                    ? "text-xs uppercase tracking-widest px-4 py-2 border border-brand-950 text-brand-950 hover:bg-brand-950 hover:text-white transition-all duration-300"
                    : "text-xs uppercase tracking-widest text-brand-700 link-underline hover:text-brand-950 transition-colors"
                }
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/panier" className="relative p-2 text-brand-700 hover:text-brand-950 transition-colors" aria-label="Panier">
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-950 text-white text-[10px] flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {session ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href={dashboardHref}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-700 hover:text-brand-950"
                >
                  {session.user.image ? (
                    <ProfileAvatar src={session.user.image} name={session.user.name} size="sm" />
                  ) : (
                    isUserAdmin ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" strokeWidth={1.5} />
                  )}
                  {isUserAdmin ? "Administration" : "Mon espace"}
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/connexion" className="btn-ghost text-[10px]">Connexion</Link>
              </div>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-brand-700" aria-label="Menu">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-t border-brand-100 animate-slide-in">
          <nav className="container-premium py-6 flex flex-col gap-4">
            {publicNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`text-sm uppercase tracking-widest py-2 ${
                  "highlight" in item && item.highlight ? "font-medium text-brand-950" : "text-brand-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <hr className="border-brand-100" />
            {session ? (
              <Link href={dashboardHref} onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-widest py-2">
                {isUserAdmin ? "Administration" : "Mon espace"}
              </Link>
            ) : (
              <>
                <Link href="/connexion" onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-widest py-2">
                  Connexion client
                </Link>
                <Link href="/admin/connexion" onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-widest py-2 text-brand-400">
                  Connexion admin
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
