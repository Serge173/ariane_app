import Link from "next/link";
import { HeroSection } from "@/components/home/HeroSection";
import { OffersGrid } from "@/components/home/OffersGrid";
import { BoutiquePreviewSection } from "@/components/home/BoutiquePreviewSection";
import { JourneySection } from "@/components/home/JourneySection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <JourneySection />

      <section className="py-24 lg:py-32 bg-white">
        <div className="container-premium">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-overline mb-4">Nos accompagnements</p>
            <h2 className="heading-section mb-6">Choisissez votre formule</h2>
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

      <section className="py-24 lg:py-32 bg-white">
        <div className="container-premium">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: "Expertise premium",
                description: "Un accompagnement personnalisé par une consultante certifiée, alliant savoir-faire et sensibilité esthétique.",
              },
              {
                title: "Parcours fluide",
                description: "De la découverte à la réservation, tout est centralisé pour une expérience sans friction.",
              },
              {
                title: "Suivi continu",
                description: "Accédez à votre espace personnel pour suivre votre coaching, vos documents et vos prochaines étapes.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-8">
                <h3 className="font-display text-xl mb-4">{item.title}</h3>
                <p className="text-sm text-brand-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <CTASection />
    </>
  );
}
