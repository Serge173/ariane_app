"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export function CTASection() {
  return (
    <section className="section-home bg-brand-50 border-t border-brand-100">
      <div className="container-premium max-w-2xl">
        <Reveal>
          <p className="text-overline mb-2.5 sm:mb-4">Une question ?</p>
          <h2 className="heading-section mb-3 sm:mb-5">
            Parlons de votre projet image
          </h2>
          <p className="text-sm sm:text-base text-brand-600 leading-relaxed mb-6 sm:mb-8">
            Notre équipe vous répond sous 24 h pour toute demande d&apos;information
            ou d&apos;accompagnement sur mesure.
          </p>
          <Link
            href="/contact"
            className="link-underline font-sans text-sm uppercase tracking-wide text-brand-800 hover:text-brand-950"
          >
            Nous contacter
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
