"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMAGES } from "@/lib/images";
import {
  DURATION,
  EASE_COUTURE,
  RISE_PX,
  STAGGER_HERO_TEXT,
} from "@/lib/motion";
import type { HeroSlideSettings } from "@/lib/homepage-settings";

const AUTOPLAY_MS = 7000;

interface HeroSliderProps {
  slides: HeroSlideSettings[];
  primaryCta: { href: string; label: string };
}

function HeroSlideText({
  slide,
  primaryCta,
  isFirstLoad,
}: {
  slide: HeroSlideSettings;
  primaryCta: { href: string; label: string };
  isFirstLoad: boolean;
}) {
  const reduced = useReducedMotion();

  const base = {
    duration: reduced ? 0.15 : DURATION.medium,
    ease: EASE_COUTURE,
  };

  const titleDuration = reduced ? 0.15 : isFirstLoad ? DURATION.hero : DURATION.medium;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slide.id}
        className="max-w-2xl lg:max-w-3xl"
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, transition: { duration: reduced ? 0.15 : DURATION.short, ease: EASE_COUTURE } }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: reduced ? 0 : STAGGER_HERO_TEXT,
            },
          },
        }}
      >
        <motion.p
          variants={{
            hidden: { opacity: 0, y: reduced ? 0 : RISE_PX },
            visible: { opacity: 1, y: 0, transition: base },
          }}
          className="mb-2.5 sm:mb-5 font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.32em] text-white/75"
        >
          {slide.overline}
        </motion.p>

        <motion.h1
          variants={{
            hidden: { opacity: 0, y: reduced ? 0 : RISE_PX },
            visible: {
              opacity: 1,
              y: 0,
              transition: { ...base, duration: titleDuration },
            },
          }}
          className="font-display text-[1.45rem] leading-[1.12] sm:text-5xl lg:text-6xl font-light text-white"
        >
          {slide.title}
        </motion.h1>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: reduced ? 0 : RISE_PX },
            visible: { opacity: 1, y: 0, transition: base },
          }}
        >
          <Link
            href={primaryCta.href}
            className="btn-primary mt-6 sm:mt-10 inline-flex items-center gap-2 max-w-[16rem] sm:max-w-none text-center leading-snug"
          >
            {primaryCta.label}
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.5} />
          </Link>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function HeroSlider({ slides, primaryCta }: HeroSliderProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [useHeroDuration, setUseHeroDuration] = useState(true);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const reduced = useReducedMotion();
  const count = slides.length;

  useEffect(() => {
    const timer = window.setTimeout(() => setUseHeroDuration(false), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setUseHeroDuration(false);
      setActive((index + count) % count);
    },
    [count]
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);

  const markImageFailed = useCallback((slideId: string) => {
    setFailedImages((prev) => {
      if (prev.has(slideId)) return prev;
      const nextSet = new Set(prev);
      nextSet.add(slideId);
      return nextSet;
    });
  }, []);

  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, count, next, active]);

  if (count === 0) return null;

  const current = slides[active];

  return (
    <section
      className="relative h-[68svh] min-h-[360px] sm:h-[82svh] sm:min-h-[460px] lg:h-[100svh] lg:min-h-[560px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Mise en avant"
    >
      {slides.map((slide, index) => {
        const isActive = index === active;
        return (
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{
              duration: reduced ? 0.15 : DURATION.medium,
              ease: EASE_COUTURE,
            }}
            style={{ zIndex: isActive ? 1 : 0 }}
            aria-hidden={!isActive}
          >
            <div
              className={cn(
                "absolute inset-0 overflow-hidden",
                isActive && !reduced && "animate-ken-burns"
              )}
              key={isActive ? `kb-${slide.id}-${active}` : slide.id}
            >
              <Image
                src={failedImages.has(slide.id) ? IMAGES.hero : slide.image}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                className="object-cover object-center"
                sizes="100vw"
                onError={() => markImageFailed(slide.id)}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/40" />
          </motion.div>
        );
      })}

      <div className="relative z-10 flex h-full items-end sm:items-center">
        <div className="container-premium w-full pt-[4.75rem] pb-9 sm:pt-32 sm:pb-20">
          <HeroSlideText slide={current} primaryCta={primaryCta} isFirstLoad={useHeroDuration} />
        </div>
      </div>

      {count > 1 && (
        <div className="absolute bottom-5 sm:bottom-10 left-0 right-0 z-10 flex justify-center gap-1.5 sm:gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(index)}
              className={cn(
                "h-px transition-[width,background-color] duration-[var(--duration-micro)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                index === active ? "w-10 bg-white" : "w-6 bg-white/35 hover:bg-white/55"
              )}
              style={{ transitionTimingFunction: "var(--ease-couture)" }}
              aria-label={`Slide ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
