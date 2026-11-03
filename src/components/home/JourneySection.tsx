"use client";

import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { ProductImage } from "@/components/ui/ProductImage";
import { IMAGES } from "@/lib/images";
import type { HomepageSettings } from "@/lib/homepage-settings";

interface JourneySectionProps {
  journey: HomepageSettings["journey"];
}

export function JourneySection({ journey }: JourneySectionProps) {
  return (
    <section className="section-home bg-brand-50 overflow-x-hidden">
      <div className="container-premium min-w-0">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-16 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28 min-w-0">
            <p className="text-overline mb-2.5 sm:mb-4">{journey.overline}</p>
            <h2 className="heading-section mb-3 sm:mb-5">{journey.title}</h2>
            <p className="text-sm sm:text-base text-brand-600 leading-relaxed">
              {journey.intro}
            </p>
          </div>

          <StaggerReveal className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-2.5 sm:gap-4 lg:gap-x-8 lg:gap-y-6 w-full min-w-0">
            {journey.steps.map((step) => (
              <article
                key={step.number}
                className="relative aspect-[6/5] sm:aspect-[5/4] min-w-0 w-full overflow-hidden border border-brand-200/80 bg-brand-100 shadow-sm"
              >
                <ProductImage
                  src={step.image}
                  fallback={IMAGES.productFallback}
                  alt={step.imageAlt || step.title}
                  fill
                  fit="cover"
                  sizes="(max-width: 640px) 45vw, 25vw"
                  className="transition-transform duration-[900ms] ease-[var(--ease-couture)] group-hover:scale-[1.02]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15 pointer-events-none"
                  aria-hidden
                />
                <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 font-display text-xl sm:text-2xl lg:text-3xl font-light text-white/90 leading-none drop-shadow-md">
                  {step.number}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-4 lg:p-5 text-white">
                  <h3 className="font-display text-sm sm:text-lg lg:text-xl mb-1 sm:mb-1.5 leading-tight drop-shadow-sm">
                    {step.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-white/90 leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}
