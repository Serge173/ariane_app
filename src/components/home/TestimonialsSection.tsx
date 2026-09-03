"use client";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerReveal } from "@/components/motion/StaggerReveal";

const testimonials = [
  {
    name: "Marie K.",
    role: "Directrice marketing",
    content: "Une transformation remarquable. Ariane a su comprendre mes enjeux professionnels et m'a guidée avec une expertise rare.",
    rating: 5,
  },
  {
    name: "Fatou D.",
    role: "Entrepreneure",
    content: "Le parcours Gold a dépassé mes attentes. Mon image reflète enfin qui je suis vraiment.",
    rating: 5,
  },
  {
    name: "Aminata B.",
    role: "Cadre supérieure",
    content: "Professionnalisme, écoute et résultats concrets. Je recommande vivement à toute femme ambitieuse.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="section-home bg-brand-950 text-white overflow-x-hidden">
      <div className="container-premium min-w-0">
        <Reveal className="section-home-intro">
          <p className="text-overline text-brand-400 mb-2.5 sm:mb-4">Témoignages</p>
          <h2 className="heading-section text-white mb-0 sm:mb-2">Ce qu&apos;elles en disent</h2>
        </Reveal>

        <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-8 w-full min-w-0">
          {testimonials.map((t, index) => (
            <div
              key={t.name}
              className={cn(
                "border border-brand-800 p-3.5 sm:p-5 lg:p-8 min-w-0 w-full",
                index === 2 && "sm:col-span-2 lg:col-span-1 sm:max-w-md sm:mx-auto lg:max-w-none lg:mx-0"
              )}
            >
              <div className="flex gap-0.5 mb-2.5 sm:mb-4 lg:mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-accent text-xs sm:text-sm">★</span>
                ))}
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-brand-200 leading-relaxed mb-3 sm:mb-5 lg:mb-8 line-clamp-4 sm:line-clamp-none">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">{t.name}</p>
                <p className="text-[10px] sm:text-xs lg:text-sm text-brand-400 truncate">{t.role}</p>
              </div>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
