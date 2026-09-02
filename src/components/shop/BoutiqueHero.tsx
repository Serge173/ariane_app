import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/lib/images";

export function BoutiqueHero() {
  return (
    <section className="relative min-h-[78vh] lg:min-h-[88vh] flex items-end bg-brand-100">
      <Image
        src={IMAGES.boutiqueHero}
        alt="Boutique Ariane"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/55 via-brand-950/15 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16 pt-32">
        <div className="max-w-xl">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light italic text-white leading-[1.1] mb-5">
            Le style,
            <br />
            réinventé
          </h1>
          <p className="font-sans text-sm sm:text-base text-white/90 leading-relaxed mb-8 max-w-md">
            Des pièces essentielles et raffinées, sélectionnées avec exigence pour
            sublimer votre image au quotidien.
          </p>
          <Link
            href="#catalogue"
            className="inline-flex items-center justify-center px-8 py-3 border border-white text-white font-sans text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-brand-950 transition-colors duration-300"
          >
            Voir tout
          </Link>
        </div>
      </div>
    </section>
  );
}
