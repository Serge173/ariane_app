"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import type { HomepageSettings } from "@/lib/homepage-settings";

interface CTASectionProps {
  cta: HomepageSettings["cta"];
}

export function CTASection({ cta }: CTASectionProps) {
  return (
    <section className="section-home bg-brand-50 border-t border-brand-100">
      <div className="container-premium max-w-2xl">
        <Reveal>
          <p className="text-overline mb-2.5 sm:mb-4">{cta.overline}</p>
          <h2 className="heading-section mb-3 sm:mb-5">{cta.title}</h2>
          <p className="text-sm sm:text-base text-brand-600 leading-relaxed mb-6 sm:mb-8">
            {cta.intro}
          </p>
          <Link
            href={cta.linkHref}
            className="link-underline font-sans text-sm uppercase tracking-wide text-brand-800 hover:text-brand-950"
          >
            {cta.linkLabel}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
