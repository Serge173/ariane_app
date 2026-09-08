"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SiteNavLink } from "@/lib/site-settings";
import { SHOPPING_NAV_LABEL_COMPACT } from "@/lib/shopping";

interface PersonalShoppingAccordionProps {
  item: SiteNavLink;
  onNavigate?: () => void;
  className?: string;
}

/** Personal Shopping → sous-menu Luxe / Premium (mobile & tablette). */
export function PersonalShoppingAccordion({
  item,
  onNavigate,
  className,
}: PersonalShoppingAccordionProps) {
  const [open, setOpen] = useState(false);
  const children = item.children?.length
    ? item.children
    : [{ name: item.name, href: item.href }];

  return (
    <div className={cn("pt-4 border-t border-brand-200/70", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group flex w-full items-center justify-between gap-2 py-2.5 sm:py-3 text-left"
        aria-expanded={open}
        aria-controls="personal-shopping-submenu"
      >
        <span className="font-display text-base sm:text-lg leading-tight font-light text-brand-950 tracking-tight">
          {SHOPPING_NAV_LABEL_COMPACT}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 shrink-0 text-brand-500 transition-transform duration-200",
            open && "rotate-180"
          )}
          strokeWidth={1.75}
        />
      </button>

      <ul
        id="personal-shopping-submenu"
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-200 ease-out",
          open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {children.map((child) => (
          <li key={child.href}>
            <Link
              href={child.href}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="flex items-center gap-2 py-2 pl-4 sm:pl-5 border-l-2 border-accent/40 hover:border-accent ml-1 transition-colors"
            >
              <span className="font-display text-sm sm:text-base font-light text-brand-800 tracking-tight">
                {child.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
