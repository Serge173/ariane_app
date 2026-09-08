"use client";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { ProductImage } from "@/components/ui/ProductImage";
import { IMAGES } from "@/lib/images";
import type { HomepageSettings, TestimonialSettings } from "@/lib/homepage-settings";

interface TestimonialsSectionProps {
  testimonials: HomepageSettings["testimonials"];
}

function BeforeAfterFrame({
  label,
  quote,
  image,
  imageAlt,
  tone,
}: {
  label: string;
  quote: string;
  image?: string;
  imageAlt: string;
  tone: "before" | "after";
}) {
  return (
    <div className="min-w-0 flex-1">
      <div className="relative aspect-[3/4] overflow-hidden border border-brand-800 bg-brand-900">
        <ProductImage
          src={image}
          fallback={IMAGES.productFallback}
          alt={imageAlt}
          fill
          className="object-cover object-top"
          sizes="(max-width: 640px) 28vw, 140px"
        />
        <span
          className={cn(
            "absolute bottom-0 inset-x-0 px-1.5 py-1 text-[8px] sm:text-[9px] uppercase tracking-[0.18em] text-center",
            tone === "before" ? "bg-brand-950/85 text-brand-400" : "bg-accent/90 text-brand-950"
          )}
        >
          {label}
        </span>
      </div>
      <p
        className={cn(
          "mt-2 text-[10px] sm:text-[11px] leading-snug line-clamp-4",
          tone === "before" ? "text-brand-400 italic" : "text-brand-100"
        )}
      >
        &ldquo;{quote}&rdquo;
      </p>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialSettings }) {
  const hasBeforeAfter = Boolean(testimonial.before && testimonial.after);

  return (
    <article className="border border-brand-800 bg-brand-900/40 p-2 sm:p-2.5 w-full min-w-0 h-full">
      {hasBeforeAfter ? (
        <>
          <div className="flex gap-2">
            <BeforeAfterFrame
              label="Avant"
              quote={testimonial.before!}
              image={testimonial.beforeImage}
              imageAlt={testimonial.beforeImageAlt ?? "Avant l'accompagnement"}
              tone="before"
            />
            <BeforeAfterFrame
              label="Après"
              quote={testimonial.after!}
              image={testimonial.afterImage}
              imageAlt={testimonial.afterImageAlt ?? "Après l'accompagnement"}
              tone="after"
            />
          </div>
          {testimonial.role && (
            <p className="mt-2.5 pt-2 border-t border-brand-800 text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-brand-400 text-center truncate">
              {testimonial.role}
            </p>
          )}
        </>
      ) : (
        <p className="text-[11px] sm:text-xs text-brand-200 leading-relaxed line-clamp-5">
          &ldquo;{testimonial.content}&rdquo;
        </p>
      )}
    </article>
  );
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="section-home bg-brand-950 text-white overflow-x-hidden">
      <div className="container-premium min-w-0">
        <Reveal className="section-home-intro">
          <p className="text-overline text-brand-400 mb-2.5 sm:mb-4">{testimonials.overline}</p>
          <h2 className="heading-section text-white mb-0 sm:mb-2">{testimonials.title}</h2>
        </Reveal>

        <StaggerReveal className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5 w-full min-w-0">
          {testimonials.items.map((t, index) => (
            <div key={`${t.name}-${t.role}-${index}`} className="min-w-0 w-full">
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
