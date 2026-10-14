"use client";

import { useReducedMotion } from "framer-motion";
interface FlashInfoTickerProps {
  label: string;
  /** Bande horizontale (legacy) ou ruban oblique à gauche du hero */
  variant?: "bar" | "side-left";
}

export function FlashInfoTicker({ label, variant = "side-left" }: FlashInfoTickerProps) {
  const reduced = useReducedMotion();
  const segment = `${label}   ◆   `;

  const tickerContent = reduced ? (
    <p className="flex h-full min-h-[2.25rem] items-center px-3 text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-white/95 line-clamp-3 leading-snug">
      {label}
    </p>
  ) : (
    <div className="flex h-full min-h-[2.25rem] items-center overflow-hidden">
      <div className="animate-flash-ticker flex whitespace-nowrap will-change-transform">
        <span className="px-3 text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-white/95">
          {segment}
          {segment}
          {segment}
        </span>
        <span
          className="px-3 text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-white/95"
          aria-hidden
        >
          {segment}
          {segment}
          {segment}
        </span>
      </div>
    </div>
  );

  if (variant === "bar") {
    return (
      <div
        className="w-full overflow-hidden border-y border-white/15 bg-black/45 backdrop-blur-md"
        role="marquee"
        aria-label={label}
      >
        <div className="flex h-9 sm:h-10 items-stretch">
          <div className="flex flex-shrink-0 items-center gap-2 bg-accent px-3 sm:px-4">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" aria-hidden />
            <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.28em] text-white">
              Info
            </span>
          </div>
          <div className="relative min-w-0 flex-1 overflow-hidden">{tickerContent}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flash-info-side pointer-events-none"
      role="marquee"
      aria-label={label}
    >
      <div className="flash-info-side__ribbon">
        <div className="flash-info-side__badge">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" aria-hidden />
          <span className="text-[8px] sm:text-[9px] font-medium uppercase tracking-[0.32em] text-white">
            Info
          </span>
        </div>
        <div className="flash-info-side__track">{tickerContent}</div>
      </div>
    </div>
  );
}
