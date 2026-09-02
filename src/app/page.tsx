import Link from "next/link";
import { HeroSlider } from "@/components/home/HeroSlider";
import { OffersGrid } from "@/components/home/OffersGrid";
import { BoutiquePreviewSection } from "@/components/home/BoutiquePreviewSection";
import { CTASection } from "@/components/home/CTASection";
import { getHeroSlides } from "@/lib/home-hero-slides";

export default function HomePage() {
  const heroSlides = getHeroSlides();

  return (
    <>
      <HeroSlider slides={heroSlides} />

      <section className="py-24 lg:py-32 bg-white">
        <div className="container-premium">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-overline mb-4">Nos forfaits</p>
            <h2 className="heading-section mb-6">Choisissez votre forfait</h2>
            <p className="text-brand-600 leading-relaxed">
              Quatre niveaux d&apos;accompagnement pensés pour répondre à chaque ambition,
              de la découverte à la transformation complète.
            </p>
          </div>
          <OffersGrid />
          <div className="text-center mt-12">
            <Link href="/orientation" className="btn-secondary inline-flex items-center gap-2">
              Trouver mon accompagnement
            </Link>
          </div>
        </div>
      </section>

      <BoutiquePreviewSection />

      <CTASection />
    </>
  );
}
