"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SiteNavLink } from "@/lib/site-settings";
import { ShoppingNavLabel } from "@/components/layout/ShoppingNavLabel";

interface ShoppingNavDropdownProps {
  item: SiteNavLink;
  pathname: string;
}

/** Desktop xl+ : survol. Tablette (lg–xl) : liste déroulante au clic. */
export function ShoppingNavDropdown({ item, pathname }: ShoppingNavDropdownProps) {
  const searchParams = useSearchParams();
  const activeLine = searchParams.get("line");
  const children = item.children ?? [];
  const isActive = pathname.startsWith("/boutique");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  const childLinks = children.map((child) => {
    const childLine = child.href.includes("line=")
      ? child.href.split("line=")[1]?.split("&")[0]
      : null;
    const childActive = isActive && activeLine === childLine;
    return (
      <Link
        key={child.href}
        href={child.href}
        onClick={() => setOpen(false)}
        className={cn(
          "block px-3 py-2 font-sans text-[11px] uppercase tracking-[0.14em] text-brand-800 hover:bg-brand-50 hover:text-brand-950 transition-colors",
          childActive && "text-accent"
        )}
      >
        {child.name}
      </Link>
    );
  });

  return (
    <>
      {/* Tablette : Personal Shopping + liste déroulante compacte */}
      <div ref={rootRef} className="relative shrink-0 lg:block xl:hidden">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className={cn(
            "nav-link-highlight inline-flex items-center gap-1 max-w-[11rem] text-[10px] tracking-[0.1em] px-2.5",
            isActive && "bg-accent text-white border-accent"
          )}
          aria-expanded={open}
          aria-haspopup="true"
        >
          <ShoppingNavLabel />
          <ChevronDown
            className={cn("w-3 h-3 shrink-0 transition-transform duration-200", open && "rotate-180")}
            strokeWidth={1.75}
          />
        </button>

        {open && (
          <div className="absolute top-full right-0 mt-1 min-w-[8.5rem] border border-brand-100 bg-white shadow-lg py-0.5 z-50">
            {childLinks}
          </div>
        )}
      </div>

      {/* Grand écran : Shopping + menu au survol */}
      <div className="relative shrink-0 hidden xl:block group">
        <button
          type="button"
          className={cn(
            "nav-link-highlight inline-flex items-center gap-1",
            isActive && "bg-accent text-white border-accent"
          )}
          aria-haspopup="true"
        >
          <ShoppingNavLabel />
          <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" strokeWidth={1.75} />
        </button>

        <div className="absolute top-full right-0 pt-1 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto transition-[opacity,visibility] duration-150 z-50">
          <div className="min-w-[8.5rem] border border-brand-100 bg-white shadow-lg py-0.5">
            {childLinks}
          </div>
        </div>
      </div>
    </>
  );
}
