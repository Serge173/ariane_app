import { IMAGES, luxeImage } from "@/lib/images";
import { BRAND_FULL_NAME } from "@/lib/brand";

export interface HeroSlide {
  id: string;
  image: string;
  imageAlt: string;
  overline: string;
  title: string;
  href?: string;
  cta?: string;
}

export const HERO_PRIMARY_CTA = {
  href: "/reservation?intent=rdv",
  label: "Démarrer mon parcours de ma découverte",
} as const;

export function getHeroSlides(): HeroSlide[] {
  return [
    {
      id: "coaching",
      image: IMAGES.hero.replace(/w=\d+/, "w=1920"),
      imageAlt: "Mode et style premium",
      overline: BRAND_FULL_NAME,
      title: "Votre image doit être à la hauteur de la dimension que vous souhaitez atteindre.",
      href: "/reservation?intent=rdv",
      cta: "Démarrer mon parcours de ma découverte",
    },
    {
      id: "boutique",
      image: luxeImage("sac-cabas-cuir", 1920),
      imageAlt: "Collection boutique luxe",
      overline: "Boutique",
      title: "Une sélection exclusive, pensée avec exigence",
      href: "/boutique",
      cta: "Explorer la boutique",
    },
    {
      id: "prestations",
      image: IMAGES.coaching.platinum.replace(/w=\d+/, "w=1920"),
      imageAlt: "Accompagnements sur mesure",
      overline: "Accompagnements",
      title: "Un parcours premium, adapté à vos ambitions",
      href: "/offres",
      cta: "Découvrir nos prestations",
    },
  ];
}
