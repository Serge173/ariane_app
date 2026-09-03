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
    <div className={cn("lg:col-span-2 min-w-0", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 py-3.5 lg:py-0 border-b border-brand-800 lg:border-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950 rounded-sm lg:pointer-events-none lg:cursor-default"
        aria-expanded={open}
      >
        <span className="font-sans text-xs uppercase tracking-wide font-medium text-brand-400">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-brand-500 shrink-0 transition-transform duration-[var(--duration-short)] lg:hidden",
            open && "rotate-180"
          )}
          style={{ transitionTimingFunction: "var(--ease-couture)" }}
          aria-hidden
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-[var(--duration-short)] lg:grid-rows-[1fr]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
        style={{ transitionTimingFunction: "var(--ease-couture)" }}
      >
        <div className="overflow-hidden lg:overflow-visible">
          <div className="pb-4 pt-1 lg:pt-0 lg:pb-0 lg:mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
