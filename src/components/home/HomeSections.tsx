"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

interface OffersSectionProps {
  children: React.ReactNode;
}

export function OffersSection({ children }: OffersSectionProps) {
  return (
    <section className="section-home bg-white border-t border-brand-100 overflow-x-hidden">
      <div className="container-premium min-w-0">
        <Reveal className="section-home-intro">
          <p className="text-overline mb-2.5 sm:mb-4">Nos forfaits</p>
          <h2 className="heading-section mb-3 sm:mb-5">Choisissez votre forfait</h2>
          <p className="text-sm sm:text-base text-brand-600 leading-relaxed">
            Quatre niveaux d&apos;accompagnement pensés pour répondre à chaque ambition,
            de la découverte à la transformation complète.
          </p>
        </Reveal>
        {children}
      </div>
    </section>
  );
}

export function BoutiqueSectionLink() {
  return (
    <Link
      href="/boutique"
      className="link-underline font-sans text-sm uppercase tracking-wide text-brand-800 hover:text-brand-950 inline-flex items-center gap-2"
    >
      Explorer la boutique
      <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
    </Link>
  );
}
