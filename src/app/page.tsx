import { HeroSlider } from "@/components/home/HeroSlider";
import { JourneySection } from "@/components/home/JourneySection";
import { OffersGrid } from "@/components/home/OffersGrid";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { BoutiquePreviewSection } from "@/components/home/BoutiquePreviewSection";
import { CTASection } from "@/components/home/CTASection";
import { OffersSection } from "@/components/home/HomeSections";
import { getHeroSlides } from "@/lib/home-hero-slides";

export default function HomePage() {
  const heroSlides = getHeroSlides();

  return (
    <>
      <HeroSlider slides={heroSlides} />

      <JourneySection />

      <OffersSection>
        <OffersGrid />
      </OffersSection>

      <TestimonialsSection />

      <BoutiquePreviewSection />

      <CTASection />
    </>
  );
}
