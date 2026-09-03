"use client";

import { StaggerReveal } from "@/components/motion/StaggerReveal";
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
              <div
                key={step.number}
                className="card-premium bg-white border border-brand-100 p-2.5 sm:p-4 lg:p-5 min-w-0 w-full"
              >
                <span className="block font-display text-lg sm:text-2xl lg:text-3xl font-light text-brand-200 leading-none mb-1.5 sm:mb-2">
                  {step.number}
                </span>
                <h3 className="font-display text-sm sm:text-lg lg:text-xl mb-1 sm:mb-2 text-brand-950 leading-tight">
                  {step.title}
                </h3>
                <p className="text-[10px] sm:text-xs lg:text-sm text-brand-600 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {step.description}
                </p>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}
