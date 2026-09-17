"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SiteNavLink } from "@/lib/site-settings";
import { PersonalShoppingAccordion } from "@/components/layout/PersonalShoppingAccordion";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  navLinks: SiteNavLink[];
}

export function MobileNav({ open, onClose, navLinks }: MobileNavProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const [shoppingReset, setShoppingReset] = useState(0);

  useEffect(() => {
    if (!open) setShoppingReset((value) => value + 1);
  }, [open]);

  if (!open) return null;

  const mainLinks = navLinks.filter((item) => !item.highlight);
  const shoppingLink = navLinks.find((item) => item.highlight);

  return (
    <div className="lg:hidden fixed inset-0 z-[45]" role="dialog" aria-modal="true" aria-label="Menu">
      <button
        type="button"
        className="absolute inset-0 bg-brand-950/55 mobile-nav-backdrop"
        onClick={onClose}
        aria-label="Fermer le menu"
      />

      <aside
        className="absolute top-14 sm:top-16 left-0 z-10 h-[50vh] w-[50vw] max-w-[50vw] bg-white border border-brand-100 shadow-[16px_0_48px_-8px_rgba(40,36,31,0.22)] mobile-nav-panel overflow-y-auto overscroll-contain rounded-tr-2xl rounded-br-2xl"
        aria-label="Navigation principale"
      >
        <div className="flex flex-col px-4 sm:px-5 pt-4 pb-6 min-h-full">
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

            {shoppingLink && (
              <div
                className="mobile-nav-item"
                style={{ animationDelay: `${mainLinks.length * 55}ms` }}
              >
                <PersonalShoppingAccordion key={shoppingReset} item={shoppingLink} onNavigate={onClose} />
              </div>
            )}
          </nav>
        </div>
      </aside>
    </div>
  );
}
