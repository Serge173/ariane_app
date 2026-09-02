"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/lib/home-hero-slides";

const AUTOPLAY_MS = 7000;

interface HeroSliderProps {
  slides: HeroSlide[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActive((index + count) % count);
    },
    [count]
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, count, next, active]);

  if (count === 0) return null;

  const current = slides[active];

  return (
    <section
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Mise en avant"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={current.image}
            alt={current.imageAlt}
            fill
            priority={active === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-brand-950/30" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full items-center">
        <div className="container-premium w-full pt-24 pb-20 sm:pt-28 lg:pt-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-2xl lg:max-w-3xl"
            >
              <p className="mb-5 font-sans text-[10px] uppercase tracking-[0.35em] text-white/75">
                {current.overline}
              </p>
              <h1 className="font-display text-[2rem] leading-[1.08] sm:text-5xl lg:text-6xl font-light text-white">
                {current.title}
              </h1>
              {current.href && current.cta && (
                <Link
                  href={current.href}
                  className="mt-10 inline-flex items-center gap-2 border-b border-white/60 pb-1 font-sans text-xs uppercase tracking-[0.2em] text-white transition-colors hover:border-white"
                >
                  {current.cta}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {count > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-2 sm:bottom-10">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(index)}
              className={cn(
                "h-px transition-all duration-500",
                index === active ? "w-10 bg-white" : "w-6 bg-white/35 hover:bg-white/55"
              )}
              aria-label={`Slide ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
