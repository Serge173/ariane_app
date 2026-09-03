import Image from "next/image";
import type { BoutiquePageSettings } from "@/lib/boutique-settings";

export function BoutiquePromoBar({ text }: { text: string }) {
  return (
    <div className="bg-brand-950 text-white text-center py-2.5 px-4">
      <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em]">{text}</p>
    </div>
  );
}

export function BoutiqueHero({ hero }: { hero: BoutiquePageSettings["hero"] }) {
  return (
    <section className="relative min-h-[78vh] lg:min-h-[88vh] flex items-end bg-brand-100">
      <Image
        src={hero.image}
        alt={hero.imageAlt}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/55 via-brand-950/15 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16 pt-32">
        <div className="max-w-xl">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light italic text-white leading-[1.1] mb-5">
            {hero.titleLine1}
            <br />
            {hero.titleLine2}
          </h1>
          <p className="font-sans text-sm sm:text-base text-white/90 leading-relaxed mb-8 max-w-md">
            {hero.intro}
          </p>
          <a
            href="#catalogue"
            className="inline-flex items-center justify-center px-8 py-3 border border-white text-white font-sans text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-brand-950 transition-colors duration-300"
          >
            {hero.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

export function BoutiqueStory({ story }: { story: BoutiquePageSettings["story"] }) {
  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
      <h2 className="font-display text-3xl sm:text-4xl font-light italic text-brand-950 mb-6">
        {story.title}
      </h2>
      <p className="font-sans text-sm sm:text-base text-brand-600 leading-relaxed">{story.body}</p>
    </section>
  );
}
