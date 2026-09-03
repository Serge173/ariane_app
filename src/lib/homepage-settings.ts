import prisma from "@/lib/prisma";
import { IMAGES, luxeImage } from "@/lib/images";
import type { Prisma } from "@prisma/client";
import { BRAND_FULL_NAME, migrateBrandText } from "@/lib/brand";

export const HOMEPAGE_SETTINGS_KEY = "homepage_settings";

export interface HeroSlideSettings {
  id: string;
  image: string;
  imageAlt: string;
  overline: string;
  title: string;
}

export interface JourneyStepSettings {
  number: string;
  title: string;
  description: string;
}

export interface TestimonialSettings {
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface SectionIntroSettings {
  overline: string;
  title: string;
  intro: string;
}

export interface HomepageSettings {
  hero: {
    primaryCta: { href: string; label: string };
    slides: HeroSlideSettings[];
  };
  journey: SectionIntroSettings & { steps: JourneyStepSettings[] };
  offersSection: SectionIntroSettings;
  boutiquePreview: SectionIntroSettings & {
    linkLabel: string;
    linkHref: string;
    productCount: number;
  };
  testimonials: SectionIntroSettings & { items: TestimonialSettings[] };
  cta: SectionIntroSettings & { linkLabel: string; linkHref: string };
}

function str(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export const DEFAULT_HOMEPAGE_SETTINGS: HomepageSettings = {
  hero: {
    primaryCta: {
      href: "/reservation",
      label: "Cliquez ici pour prendre un rdv",
    },
    slides: [
      {
        id: "coaching",
        image: IMAGES.hero.replace(/w=\d+/, "w=1920"),
        imageAlt: "Mode et style premium",
        overline: BRAND_FULL_NAME,
        title: "Révélez l'image qui vous ressemble",
      },
      {
        id: "boutique",
        image: luxeImage("sac-cabas-cuir", 1920),
        imageAlt: "Collection boutique luxe",
        overline: "Boutique",
        title: "Une sélection exclusive, pensée avec exigence",
      },
      {
        id: "prestations",
        image: IMAGES.coaching.platinum.replace(/w=\d+/, "w=1920"),
        imageAlt: "Accompagnements sur mesure",
        overline: "Accompagnements",
        title: "Un parcours premium, adapté à vos ambitions",
      },
    ],
  },
  journey: {
    overline: "Votre parcours",
    title: "De la découverte à la transformation",
    intro:
      "Un parcours fluide et premium, pensé pour vous accompagner à chaque étape de votre évolution image.",
    steps: [
      { number: "01", title: "Découvrir", description: "Explorez nos accompagnements et notre univers premium" },
      { number: "02", title: "S'orienter", description: "Répondez au questionnaire pour trouver votre formule idéale" },
      { number: "03", title: "Réserver", description: "Choisissez votre créneau et finalisez votre réservation" },
      { number: "04", title: "Payer", description: "Réglez en toute sécurité via Mobile Money ou carte bancaire" },
      { number: "05", title: "Coaching", description: "Vivez votre séance et recevez vos livrables personnalisés" },
      {
        number: "06",
        title: "Suivre",
        description:
          "Accédez à votre espace client pour votre coaching, vos commandes boutique et vos documents",
      },
    ],
  },
  offersSection: {
    overline: "Nos forfaits",
    title: "Choisissez votre forfait",
    intro:
      "Quatre niveaux d'accompagnement pensés pour répondre à chaque ambition, de la découverte à la transformation complète.",
  },
  boutiquePreview: {
    overline: "Boutique de luxe",
    title: "Découvrez la boutique de luxe Ariane",
    intro:
      "Une sélection raffinée de sacs, vêtements, accessoires et parfums, choisis avec la même exigence que nos accompagnements.",
    linkLabel: "Explorer la boutique",
    linkHref: "/boutique",
    productCount: 4,
  },
  testimonials: {
    overline: "Témoignages",
    title: "Ce qu'elles en disent",
    intro: "",
    items: [
      {
        name: "Marie K.",
        role: "Directrice marketing",
        content:
          "Une transformation remarquable. Ariane a su comprendre mes enjeux professionnels et m'a guidée avec une expertise rare.",
        rating: 5,
      },
      {
        name: "Fatou D.",
        role: "Entrepreneure",
        content: "Le parcours Gold a dépassé mes attentes. Mon image reflète enfin qui je suis vraiment.",
        rating: 5,
      },
      {
        name: "Aminata B.",
        role: "Cadre supérieure",
        content:
          "Professionnalisme, écoute et résultats concrets. Je recommande vivement à toute femme ambitieuse.",
        rating: 5,
      },
    ],
  },
  cta: {
    overline: "Une question ?",
    title: "Parlons de votre projet image",
    intro:
      "Notre équipe vous répond sous 24 h pour toute demande d'information ou d'accompagnement sur mesure.",
    linkLabel: "Nous contacter",
    linkHref: "/contact",
  },
};

function parseSlides(raw: unknown): HeroSlideSettings[] {
  if (!Array.isArray(raw)) return DEFAULT_HOMEPAGE_SETTINGS.hero.slides;
  const slides = raw
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const s = item as Partial<HeroSlideSettings>;
      const fallback = DEFAULT_HOMEPAGE_SETTINGS.hero.slides[index];
      if (!fallback) return null;
      return {
        id: str(s.id, fallback.id),
        image: str(s.image, fallback.image),
        imageAlt: str(s.imageAlt, fallback.imageAlt),
        overline: migrateBrandText(str(s.overline, fallback.overline)),
        title: str(s.title, fallback.title),
      };
    })
    .filter((s): s is HeroSlideSettings => s !== null);
  return slides.length > 0 ? slides.slice(0, 5) : DEFAULT_HOMEPAGE_SETTINGS.hero.slides;
}

function parseSteps(raw: unknown): JourneyStepSettings[] {
  if (!Array.isArray(raw)) return DEFAULT_HOMEPAGE_SETTINGS.journey.steps;
  const steps = raw
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const s = item as Partial<JourneyStepSettings>;
      const fallback = DEFAULT_HOMEPAGE_SETTINGS.journey.steps[index];
      if (!fallback) return null;
      return {
        number: str(s.number, fallback.number),
        title: str(s.title, fallback.title),
        description: str(s.description, fallback.description),
      };
    })
    .filter((s): s is JourneyStepSettings => s !== null);
  return steps.length > 0 ? steps.slice(0, 8) : DEFAULT_HOMEPAGE_SETTINGS.journey.steps;
}

function parseTestimonials(raw: unknown): TestimonialSettings[] {
  if (!Array.isArray(raw)) return DEFAULT_HOMEPAGE_SETTINGS.testimonials.items;
  const items = raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const t = item as Partial<TestimonialSettings>;
      if (!t.name || !t.content) return null;
      return {
        name: str(t.name, ""),
        role: str(t.role, ""),
        content: str(t.content, ""),
        rating: typeof t.rating === "number" ? Math.min(5, Math.max(1, t.rating)) : 5,
      };
    })
    .filter((t): t is TestimonialSettings => t !== null);
  return items.length > 0 ? items.slice(0, 6) : DEFAULT_HOMEPAGE_SETTINGS.testimonials.items;
}

function parseSectionIntro(raw: unknown, fallback: SectionIntroSettings): SectionIntroSettings {
  if (!raw || typeof raw !== "object") return fallback;
  const s = raw as Partial<SectionIntroSettings>;
  return {
    overline: str(s.overline, fallback.overline),
    title: str(s.title, fallback.title),
    intro: str(s.intro, fallback.intro),
  };
}

export async function getHomepageSettings(): Promise<HomepageSettings> {
  try {
    const row = await prisma.siteContent.findUnique({ where: { key: HOMEPAGE_SETTINGS_KEY } });
    if (!row?.value || typeof row.value !== "object") return { ...DEFAULT_HOMEPAGE_SETTINGS };
    const raw = row.value as Partial<HomepageSettings>;
    const heroRaw: Partial<HomepageSettings["hero"]> =
      raw.hero && typeof raw.hero === "object" ? raw.hero : {};
    const primaryRaw =
      heroRaw.primaryCta && typeof heroRaw.primaryCta === "object" ? heroRaw.primaryCta : {};
    return migrateBrandInObject({
      hero: {
        primaryCta: {
          href: str(
            (primaryRaw as { href?: string }).href,
            DEFAULT_HOMEPAGE_SETTINGS.hero.primaryCta.href
          ),
          label: str(
            (primaryRaw as { label?: string }).label,
            DEFAULT_HOMEPAGE_SETTINGS.hero.primaryCta.label
          ),
        },
        slides: parseSlides(heroRaw.slides),
      },
      journey: {
        ...parseSectionIntro(raw.journey, DEFAULT_HOMEPAGE_SETTINGS.journey),
        steps: parseSteps(
          raw.journey && typeof raw.journey === "object"
            ? (raw.journey as { steps?: unknown }).steps
            : undefined
        ),
      },
      offersSection: parseSectionIntro(raw.offersSection, DEFAULT_HOMEPAGE_SETTINGS.offersSection),
      boutiquePreview: {
        ...parseSectionIntro(raw.boutiquePreview, DEFAULT_HOMEPAGE_SETTINGS.boutiquePreview),
        linkLabel: str(
          raw.boutiquePreview && typeof raw.boutiquePreview === "object"
            ? (raw.boutiquePreview as { linkLabel?: string }).linkLabel
            : undefined,
          DEFAULT_HOMEPAGE_SETTINGS.boutiquePreview.linkLabel
        ),
        linkHref: str(
          raw.boutiquePreview && typeof raw.boutiquePreview === "object"
            ? (raw.boutiquePreview as { linkHref?: string }).linkHref
            : undefined,
          DEFAULT_HOMEPAGE_SETTINGS.boutiquePreview.linkHref
        ),
        productCount:
          typeof raw.boutiquePreview === "object" &&
          typeof (raw.boutiquePreview as { productCount?: number }).productCount === "number"
            ? Math.min(8, Math.max(1, (raw.boutiquePreview as { productCount: number }).productCount))
            : DEFAULT_HOMEPAGE_SETTINGS.boutiquePreview.productCount,
      },
      testimonials: {
        ...parseSectionIntro(raw.testimonials, DEFAULT_HOMEPAGE_SETTINGS.testimonials),
        items: parseTestimonials(
          raw.testimonials && typeof raw.testimonials === "object"
            ? (raw.testimonials as { items?: unknown }).items
            : undefined
        ),
      },
      cta: {
        ...parseSectionIntro(raw.cta, DEFAULT_HOMEPAGE_SETTINGS.cta),
        linkLabel: str(
          raw.cta && typeof raw.cta === "object" ? (raw.cta as { linkLabel?: string }).linkLabel : undefined,
          DEFAULT_HOMEPAGE_SETTINGS.cta.linkLabel
        ),
        linkHref: str(
          raw.cta && typeof raw.cta === "object" ? (raw.cta as { linkHref?: string }).linkHref : undefined,
          DEFAULT_HOMEPAGE_SETTINGS.cta.linkHref
        ),
      },
    });
  } catch {
    return { ...DEFAULT_HOMEPAGE_SETTINGS };
  }
}

export async function updateHomepageSettings(
  patch: Partial<HomepageSettings>
): Promise<HomepageSettings> {
  const current = await getHomepageSettings();
  const merged: HomepageSettings = {
    hero: {
      primaryCta: patch.hero?.primaryCta
        ? {
            href: str(patch.hero.primaryCta.href, current.hero.primaryCta.href),
            label: str(patch.hero.primaryCta.label, current.hero.primaryCta.label),
          }
        : current.hero.primaryCta,
      slides: patch.hero?.slides ? parseSlides(patch.hero.slides) : current.hero.slides,
    },
    journey: {
      overline: patch.journey?.overline !== undefined ? str(patch.journey.overline, current.journey.overline) : current.journey.overline,
      title: patch.journey?.title !== undefined ? str(patch.journey.title, current.journey.title) : current.journey.title,
      intro: patch.journey?.intro !== undefined ? str(patch.journey.intro, current.journey.intro) : current.journey.intro,
      steps: patch.journey?.steps ? parseSteps(patch.journey.steps) : current.journey.steps,
    },
    offersSection: patch.offersSection
      ? { ...current.offersSection, ...patch.offersSection }
      : current.offersSection,
    boutiquePreview: patch.boutiquePreview
      ? {
          ...current.boutiquePreview,
          ...patch.boutiquePreview,
          productCount:
            patch.boutiquePreview.productCount !== undefined
              ? Math.min(8, Math.max(1, patch.boutiquePreview.productCount))
              : current.boutiquePreview.productCount,
        }
      : current.boutiquePreview,
    testimonials: {
      overline:
        patch.testimonials?.overline !== undefined
          ? str(patch.testimonials.overline, current.testimonials.overline)
          : current.testimonials.overline,
      title:
        patch.testimonials?.title !== undefined
          ? str(patch.testimonials.title, current.testimonials.title)
          : current.testimonials.title,
      intro:
        patch.testimonials?.intro !== undefined
          ? str(patch.testimonials.intro, current.testimonials.intro)
          : current.testimonials.intro,
      items: patch.testimonials?.items ? parseTestimonials(patch.testimonials.items) : current.testimonials.items,
    },
    cta: patch.cta ? { ...current.cta, ...patch.cta } : current.cta,
  };

  await prisma.siteContent.upsert({
    where: { key: HOMEPAGE_SETTINGS_KEY },
    create: { key: HOMEPAGE_SETTINGS_KEY, value: merged as unknown as Prisma.InputJsonValue },
    update: { value: merged as unknown as Prisma.InputJsonValue },
  });

  return merged;
}
