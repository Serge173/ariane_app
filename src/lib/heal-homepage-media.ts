import {
  DEFAULT_HOMEPAGE_SETTINGS,
  DEFAULT_PERSONAL_SHOPPING_BANNER,
  type HomepageSettings,
} from "@/lib/homepage-settings";
import { resolveReachableImageUrl } from "@/lib/remote-image-health";

function defaultHeroImageForId(id: string): string {
  return (
    DEFAULT_HOMEPAGE_SETTINGS.hero.slides.find((s) => s.id === id)?.image ??
    DEFAULT_HOMEPAGE_SETTINGS.hero.slides[0]?.image ??
    ""
  );
}

function defaultJourneyImageForNumber(number: string): string {
  return (
    DEFAULT_HOMEPAGE_SETTINGS.journey.steps.find((s) => s.number === number)?.image ?? ""
  );
}

function defaultTestimonialImages(index: number): { before?: string; after?: string } {
  const t = DEFAULT_HOMEPAGE_SETTINGS.testimonials.items[index];
  return { before: t?.beforeImage, after: t?.afterImage };
}

/** Remplace les URLs Blob / médias morts par les valeurs par défaut (évite 404 en prod). */
export async function healHomepageMedia(settings: HomepageSettings): Promise<HomepageSettings> {
  const heroSlides = await Promise.all(
    settings.hero.slides.map(async (slide) => {
      const fallback = defaultHeroImageForId(slide.id);
      const image = await resolveReachableImageUrl(slide.image, fallback);
      return image === slide.image ? slide : { ...slide, image };
    })
  );

  const journeySteps = await Promise.all(
    settings.journey.steps.map(async (step) => {
      const fallback = defaultJourneyImageForNumber(step.number);
      const image = await resolveReachableImageUrl(step.image, fallback);
      return image === step.image ? step : { ...step, image };
    })
  );

  const testimonialItems = await Promise.all(
    settings.testimonials.items.map(async (item, index) => {
      const defaults = defaultTestimonialImages(index);
      const beforeImage = item.beforeImage
        ? await resolveReachableImageUrl(item.beforeImage, defaults.before ?? item.beforeImage)
        : item.beforeImage;
      const afterImage = item.afterImage
        ? await resolveReachableImageUrl(item.afterImage, defaults.after ?? item.afterImage)
        : item.afterImage;
      if (beforeImage === item.beforeImage && afterImage === item.afterImage) return item;
      return { ...item, beforeImage, afterImage };
    })
  );

  const psImage = await resolveReachableImageUrl(
    settings.personalShopping.image,
    DEFAULT_PERSONAL_SHOPPING_BANNER.image
  );

  return {
    ...settings,
    hero: { ...settings.hero, slides: heroSlides },
    journey: { ...settings.journey, steps: journeySteps },
    testimonials: { ...settings.testimonials, items: testimonialItems },
    personalShopping:
      psImage === settings.personalShopping.image
        ? settings.personalShopping
        : { ...settings.personalShopping, image: psImage },
  };
}
