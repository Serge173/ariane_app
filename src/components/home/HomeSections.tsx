"use client";

import { Reveal } from "@/components/motion/Reveal";
import type { SectionIntroSettings } from "@/lib/homepage-settings";

interface OffersSectionProps {
  intro: SectionIntroSettings;
  children: React.ReactNode;
}

export function OffersSection({ intro, children }: OffersSectionProps) {
  return (
    <section className="section-home bg-white border-t border-brand-100 overflow-x-hidden">
      <div className="container-premium min-w-0">
        <Reveal className="section-home-intro">
          <p className="text-overline mb-2.5 sm:mb-4">{intro.overline}</p>
          <h2 className="heading-section mb-3 sm:mb-5">{intro.title}</h2>
          <p className="text-sm sm:text-base text-brand-600 leading-relaxed">
            {intro.intro}
          </p>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
