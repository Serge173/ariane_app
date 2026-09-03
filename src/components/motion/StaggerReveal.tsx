"use client";

import { Children, isValidElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { staggerDelay } from "@/lib/motion";

interface StaggerRevealProps {
  children: React.ReactNode;
  className?: string;
}

/** Enveloppe les enfants directs avec reveal in-view, stagger 60 ms (max 4). */
export function StaggerReveal({ children, className }: StaggerRevealProps) {
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, index) => {
        if (!isValidElement(child)) return child;
        return (
          <Reveal key={child.key ?? index} delay={staggerDelay(index)} className="min-w-0">
            {child}
          </Reveal>
        );
      })}
    </div>
  );
}
