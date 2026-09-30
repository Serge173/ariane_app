import { HeroSlider } from "@/components/home/HeroSlider";
import { JourneySection } from "@/components/home/JourneySection";
import { OffersGrid } from "@/components/home/OffersGrid";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { OffersSection } from "@/components/home/HomeSections";
import {
  DEFAULT_HOMEPAGE_SETTINGS,
  getActiveHeroSlides,
  getHomepageSettings,
} from "@/lib/homepage-settings";

/** Les forfaits viennent de la base — pas de HTML figé avec d’anciens prix. */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  let homepage = DEFAULT_HOMEPAGE_SETTINGS;
  try {
    homepage = await getHomepageSettings();
  } catch (error) {
    console.error("[HomePage] getHomepageSettings failed", error);
  }

  return (
    <>
      <HeroSlider
        slides={getActiveHeroSlides(homepage.hero.slides)}
        primaryCta={homepage.hero.primaryCta}
        scarcityLabel={homepage.hero.scarcityLabel}
      />

      <JourneySection journey={homepage.journey} />

      <OffersSection intro={homepage.offersSection}>
        <OffersGrid />
      </OffersSection>

      <TestimonialsSection testimonials={homepage.testimonials} />

      <CTASection cta={homepage.cta} />
    </>
  );
}
