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
        className="absolute inset-0 bg-brand-950/15 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Fermer le menu"
      />

      <div className="absolute top-[4.25rem] left-3 right-3 max-h-[min(72vh,520px)] overflow-hidden mobile-nav-panel">
        <div className="relative max-h-[min(72vh,520px)] overflow-y-auto rounded-[1.75rem] bg-[#faf9f7] border border-brand-200/70 shadow-[0_24px_60px_-12px_rgba(40,36,31,0.18)]">
          <div className="absolute inset-0 pointer-events-none rounded-[1.75rem] bg-[radial-gradient(ellipse_at_top_right,_rgba(212,205,192,0.28)_0%,_transparent_58%)]" />

          <div className="relative flex flex-col px-5 pt-5 pb-4">
            <p className="font-sans text-[9px] uppercase tracking-[0.35em] text-brand-500 mb-4">
              Menu
            </p>

            <nav>
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
                      className="group flex items-center justify-between py-3"
                    >
                      <span className="font-display text-xl leading-tight font-light text-brand-950 tracking-tight">
                        {item.name}
                      </span>
                      <span className="font-sans text-[9px] tracking-[0.25em] text-brand-400">
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
                  className="mobile-nav-item mt-4 block rounded-2xl border border-brand-950/80 bg-transparent text-brand-950 px-4 py-3.5"
                  style={{ animationDelay: `${mainLinks.length * 55}ms` }}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span>
                      <span className="block font-sans text-[9px] uppercase tracking-[0.28em] text-brand-500 mb-1">
                        Collection
                      </span>
                      <span className="font-display text-lg font-light tracking-tight">
                        {boutiqueLink.name}
                      </span>
                    </span>
                    <ArrowUpRight className="w-4 h-4 shrink-0" strokeWidth={1.25} />
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
                <span className="flex items-center gap-2.5">
                  <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Panier
                </span>
                {mounted && itemCount > 0 && (
                  <span className="text-[9px] uppercase tracking-widest text-brand-500">
                    {itemCount} article{itemCount > 1 ? "s" : ""}
                  </span>
                )}
              </Link>

              {session ? (
                <Link
                  href={dashboardHref}
                  onClick={onClose}
                  className="flex items-center gap-2.5 font-sans text-xs text-brand-800"
                >
                  <ProfileAvatar src={session.user.image} name={session.user.name} size="sm" />
                  {accountLabel}
                </Link>
              ) : (
                <>
                  <Link
                    href="/connexion"
                    onClick={onClose}
                    className="block font-sans text-xs text-brand-800"
                  >
                    Connexion client
                  </Link>
                  <Link
                    href="/admin/connexion"
                    onClick={onClose}
                    className="block font-sans text-[10px] text-brand-500"
                  >
                    Espace administration
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
