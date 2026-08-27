import Image from "next/image";
import { IMAGES } from "@/lib/images";

export function BoutiqueHero() {
  return (
    <section className="relative w-full h-[calc(100svh-4rem)] lg:h-[calc(100svh-4.25rem)] min-h-[520px] bg-brand-100">
      <Image
        src={IMAGES.boutiqueHero}
        alt="Boutique Ariane"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-brand-950/25" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-white/90 mb-3">
          Collection luxe
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-white">
          La Boutique
        </h1>
      </div>
    </section>
  );
}
