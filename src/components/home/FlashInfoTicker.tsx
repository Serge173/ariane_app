"use client";

import { useReducedMotion } from "framer-motion";

interface FlashInfoTickerProps {
  label: string;
  /** Bande horizontale pleine largeur ou diagonale gauche → haut */
  variant?: "bar" | "side-left";
}

export function FlashInfoTicker({ label, variant = "side-left" }: FlashInfoTickerProps) {
  const reduced = useReducedMotion();
  const segment = `${label}   ◆   `;

  const tickerContent = reduced ? (
    <p className="flex h-full items-center px-4 text-[10px] sm:text-xs uppercase tracking-[0.14em] text-white truncate font-medium">
      {label}
    </p>
  ) : (
    <div className="flex h-full flex-1 items-center overflow-hidden">
      <div className="animate-flash-ticker flex whitespace-nowrap will-change-transform">
        <span className="px-4 text-[10px] sm:text-xs uppercase tracking-[0.14em] text-white font-medium">
          {segment}
          {segment}
          {segment}
          {segment}
        </span>
        <span
          className="px-4 text-[10px] sm:text-xs uppercase tracking-[0.14em] text-white font-medium"
          aria-hidden
        >
          {segment}
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
    <div className="flash-info-diagonal pointer-events-none" role="marquee" aria-label={label}>
      <div className="flash-info-diagonal__bar">
        <div className="flash-info-diagonal__badge">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse shadow-sm" aria-hidden />
          <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.32em] text-white">
            Info
          </span>
        </div>
        <div className="flash-info-diagonal__track">{tickerContent}</div>
      </div>
    </div>
  );
}
