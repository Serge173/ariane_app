"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE_COUTURE, RISE_PX } from "@/lib/motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Durée du titre hero (900 ms), sinon medium (480 ms) */
  duration?: "medium" | "hero";
}

export function Reveal({
  children,
  className,
  delay = 0,
  duration = "medium",
}: RevealProps) {
  const reduced = useReducedMotion();
  const dur = reduced ? 0.15 : duration === "hero" ? DURATION.hero : DURATION.medium;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : RISE_PX }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: dur,
        delay: reduced ? 0 : delay,
        ease: EASE_COUTURE,
      }}
    >
      {children}
    </motion.div>
  );
}
