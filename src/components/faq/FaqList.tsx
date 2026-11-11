"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="public-faq-list space-y-3 sm:space-y-4">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.q} className="public-card public-faq-item">
            <button
              type="button"
              className="public-faq-trigger"
              onClick={() => setOpen(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span className="font-display text-base sm:text-lg text-brand-950 text-left pr-4">
                {item.q}
              </span>
              <ChevronDown
                className={cn(
                  "w-5 h-5 shrink-0 text-accent transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
                strokeWidth={1.5}
                aria-hidden
              />
            </button>
            <div
              className={cn(
                "public-faq-answer grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p className="public-faq-answer-text">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
