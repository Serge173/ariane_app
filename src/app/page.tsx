import { HeroSlider } from "@/components/home/HeroSlider";
import { JourneySection } from "@/components/home/JourneySection";
import { OffersGrid } from "@/components/home/OffersGrid";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { BoutiquePreviewSection } from "@/components/home/BoutiquePreviewSection";
import { CTASection } from "@/components/home/CTASection";
import { OffersSection } from "@/components/home/HomeSections";
import { getHomepageSettings } from "@/lib/homepage-settings";

export default async function HomePage() {
  const homepage = await getHomepageSettings();

  return (
    <>
      <HeroSlider slides={homepage.hero.slides} primaryCta={homepage.hero.primaryCta} />

      <JourneySection journey={homepage.journey} />

      <OffersSection intro={homepage.offersSection}>
        <OffersGrid />
      </OffersSection>

      <TestimonialsSection testimonials={homepage.testimonials} />

      <BoutiquePreviewSection preview={homepage.boutiquePreview} />

      <CTASection cta={homepage.cta} />
    </>
  );
}
