"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterAccordionSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function FooterAccordionSection({
  title,
  children,
  className,
}: FooterAccordionSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("min-w-0", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 py-3.5 border-b border-brand-800 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950 rounded-sm lg:hidden"
        aria-expanded={open}
      >
        <span className="font-sans text-xs uppercase tracking-wide font-medium text-brand-400">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-brand-500 shrink-0 transition-transform duration-[var(--duration-short)]",
            open && "rotate-180"
          )}
          style={{ transitionTimingFunction: "var(--ease-couture)" }}
          aria-hidden
        />
      </button>

      <p className="hidden lg:block font-sans text-xs uppercase tracking-wide font-medium text-brand-400 mb-4">
        {title}
      </p>

      <div className={cn("pb-4 lg:pb-0", open ? "block" : "hidden lg:block")}>{children}</div>
    </div>
  );
}
