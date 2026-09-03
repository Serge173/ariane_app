"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { publicNav } from "@/lib/navigation";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  session: {
    user: { name?: string | null; image?: string | null };
  } | null;
  dashboardHref: string;
  accountLabel: string;
  itemCount: number;
  mounted: boolean;
}

export function MobileNav({
  open,
  onClose,
  session,
  dashboardHref,
  accountLabel,
  itemCount,
  mounted,
}: MobileNavProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const mainLinks = publicNav.filter((item) => !("highlight" in item && item.highlight));
  const boutiqueLink = publicNav.find((item) => "highlight" in item && item.highlight);

  return (
    <div className="lg:hidden fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Menu">
      <button
        type="button"
        className="absolute inset-0 bg-brand-950/20 mobile-nav-backdrop"
        onClick={onClose}
        aria-label="Fermer le menu"
      />

      <aside
        className="absolute top-14 sm:top-16 right-0 bottom-0 w-1/2 min-w-[10.5rem] max-w-[19rem] sm:max-w-[21rem] bg-white border-l border-brand-100 shadow-[-12px_0_40px_-8px_rgba(40,36,31,0.12)] mobile-nav-panel overflow-y-auto overscroll-contain rounded-tl-2xl"
        aria-label="Navigation principale"
      >
        <div className="flex flex-col px-4 sm:px-5 pt-5 pb-6 min-h-full">
          <p className="font-sans text-[9px] uppercase tracking-[0.35em] text-brand-500 mb-4">
            Menu
          </p>

          <nav className="flex-1">
            <ul>
              {mainLinks.map((item, index) => (
                <li
                  key={item.href}
                  className="mobile-nav-item border-b border-brand-200/70 last:border-b-0"
                  style={{ animationDelay: `${index * 55}ms` }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-center justify-between gap-2 py-2.5 sm:py-3"
                  >
                    <span className="font-display text-base sm:text-lg leading-tight font-light text-brand-950 tracking-tight">
                      {item.name}
                    </span>
                    <span className="font-sans text-[8px] sm:text-[9px] tracking-[0.25em] text-brand-400 shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {boutiqueLink && (
              <Link
                href={boutiqueLink.href}
                onClick={onClose}
                className="mobile-nav-item group mt-4 block rounded-xl border border-accent text-accent px-3.5 py-3 hover:bg-accent hover:text-white transition-colors duration-[var(--duration-micro)]"
                style={{ animationDelay: `${mainLinks.length * 55}ms` }}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.28em] text-brand-500 mb-0.5 group-hover:text-white/80">
                      Collection
                    </span>
                    <span className="font-display text-base font-light tracking-tight">
                      {boutiqueLink.name}
                    </span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" strokeWidth={1.25} />
                </span>
              </Link>
            )}
          </nav>

          <div
            className="mobile-nav-item mt-4 pt-4 border-t border-brand-200/70 space-y-3"
            style={{ animationDelay: `${(mainLinks.length + 1) * 55}ms` }}
          >
            <Link
              href="/panier"
              onClick={onClose}
              className="flex items-center justify-between font-sans text-xs text-brand-800"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
                Panier
              </span>
              {mounted && itemCount > 0 && (
                <span className="text-[9px] uppercase tracking-widest text-accent font-medium">
                  {itemCount} article{itemCount > 1 ? "s" : ""}
                </span>
              )}
            </Link>

            {session ? (
              <Link
                href={dashboardHref}
                onClick={onClose}
                className="flex items-center gap-2 font-sans text-xs text-brand-800"
              >
                <ProfileAvatar src={session.user.image} name={session.user.name} size="sm" />
                <span className="truncate">{accountLabel}</span>
              </Link>
            ) : (
              <Link
                href="/connexion"
                onClick={onClose}
                className="block font-sans text-xs text-brand-800"
              >
                Connexion client
              </Link>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
