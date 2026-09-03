import prisma from "@/lib/prisma";
import { IMAGES } from "@/lib/images";
import type { Prisma } from "@prisma/client";

export const BOUTIQUE_SETTINGS_KEY = "boutique_page_settings";

function str(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export interface BoutiquePageSettings {
  promoText: string;
  hero: {
    titleLine1: string;
    titleLine2: string;
    intro: string;
    ctaLabel: string;
    image: string;
    imageAlt: string;
  };
  collections: {
    title: string;
    intro: string;
    tileLabel: string;
  };
  catalogue: {
    title: string;
    subtitle: string;
  };
  story: {
    title: string;
    body: string;
  };
  spotlightTitle: string;
  spotlightButtonLabel: string;
  spotlightProductIds: string[];
}

export const DEFAULT_BOUTIQUE_PAGE_SETTINGS: BoutiquePageSettings = {
  promoText: "Nouvelle sélection disponible — pièces exclusives en édition limitée",
  hero: {
    titleLine1: "Le style,",
    titleLine2: "réinventé",
    intro:
      "Des pièces essentielles et raffinées, sélectionnées avec exigence pour sublimer votre image au quotidien.",
    ctaLabel: "Voir tout",
    image: IMAGES.boutiqueHero,
    imageAlt: "Boutique Ariane",
  },
  collections: {
    title: "Les collections",
    intro:
      "Sacs, vêtements, accessoires et parfums — une sélection pensée pour une garde-robe d'exception.",
    tileLabel: "Collection",
  },
  catalogue: {
    title: "Composer votre look",
    subtitle: "Une sélection épurée pour un shopping fluide et élégant.",
  },
  story: {
    title: "Notre histoire",
    body:
      "La boutique Ariane est née d'une conviction : l'élégance se vit dans le détail. Chaque pièce — sac, vêtement, accessoire ou parfum — est choisie avec la même exigence que nos accompagnements en conseil en image, pour vous offrir une sélection intemporelle et authentique.",
  },
  spotlightTitle: "Les plus convoités",
  spotlightButtonLabel: "Découvrir",
  spotlightProductIds: [],
};

function parseHero(raw: unknown, fallback: BoutiquePageSettings["hero"]): BoutiquePageSettings["hero"] {
  if (!raw || typeof raw !== "object") return fallback;
  const h = raw as Partial<BoutiquePageSettings["hero"]>;
  return {
    titleLine1: str(h.titleLine1, fallback.titleLine1),
    titleLine2: str(h.titleLine2, fallback.titleLine2),
    intro: str(h.intro, fallback.intro),
    ctaLabel: str(h.ctaLabel, fallback.ctaLabel),
    image: str(h.image, fallback.image),
    imageAlt: str(h.imageAlt, fallback.imageAlt),
  };
}

function parseSection<T extends { title: string }>(
  raw: unknown,
  fallback: T,
  extraKeys: (keyof T)[]
): T {
  if (!raw || typeof raw !== "object") return fallback;
  const s = raw as Partial<T>;
  const result = { ...fallback };
  for (const key of ["title", ...extraKeys] as (keyof T)[]) {
    if (key in s) {
      result[key] = str(s[key], fallback[key] as string) as T[keyof T];
    }
  }
  return result;
}

export async function getBoutiquePageSettings(): Promise<BoutiquePageSettings> {
  try {
    const row = await prisma.siteContent.findUnique({
      where: { key: BOUTIQUE_SETTINGS_KEY },
    });
    if (!row?.value || typeof row.value !== "object") {
      return { ...DEFAULT_BOUTIQUE_PAGE_SETTINGS };
    }
    const raw = row.value as Partial<BoutiquePageSettings>;
    return {
      promoText: str(raw.promoText, DEFAULT_BOUTIQUE_PAGE_SETTINGS.promoText),
      hero: parseHero(raw.hero, DEFAULT_BOUTIQUE_PAGE_SETTINGS.hero),
      collections: parseSection(raw.collections, DEFAULT_BOUTIQUE_PAGE_SETTINGS.collections, ["intro", "tileLabel"]),
      catalogue: parseSection(raw.catalogue, DEFAULT_BOUTIQUE_PAGE_SETTINGS.catalogue, ["subtitle"]),
      story: parseSection(raw.story, DEFAULT_BOUTIQUE_PAGE_SETTINGS.story, ["body"]),
      spotlightTitle: str(raw.spotlightTitle, DEFAULT_BOUTIQUE_PAGE_SETTINGS.spotlightTitle),
      spotlightButtonLabel: str(
        raw.spotlightButtonLabel,
        DEFAULT_BOUTIQUE_PAGE_SETTINGS.spotlightButtonLabel
      ),
      spotlightProductIds: Array.isArray(raw.spotlightProductIds)
        ? raw.spotlightProductIds.filter((id): id is string => typeof id === "string").slice(0, 2)
        : [],
    };
  } catch {
    return { ...DEFAULT_BOUTIQUE_PAGE_SETTINGS };
  }
}

export async function updateBoutiquePageSettings(
  patch: Partial<BoutiquePageSettings>
): Promise<BoutiquePageSettings> {
  const current = await getBoutiquePageSettings();
  const merged: BoutiquePageSettings = {
    promoText: patch.promoText !== undefined ? str(patch.promoText, current.promoText) : current.promoText,
    hero: patch.hero ? parseHero({ ...current.hero, ...patch.hero }, current.hero) : current.hero,
    collections: patch.collections
      ? { ...current.collections, ...patch.collections }
      : current.collections,
    catalogue: patch.catalogue ? { ...current.catalogue, ...patch.catalogue } : current.catalogue,
    story: patch.story ? { ...current.story, ...patch.story } : current.story,
    spotlightTitle:
      patch.spotlightTitle !== undefined
        ? str(patch.spotlightTitle, current.spotlightTitle)
        : current.spotlightTitle,
    spotlightButtonLabel:
      patch.spotlightButtonLabel !== undefined
        ? str(patch.spotlightButtonLabel, current.spotlightButtonLabel)
        : current.spotlightButtonLabel,
    spotlightProductIds:
      patch.spotlightProductIds !== undefined
        ? patch.spotlightProductIds.filter(Boolean).slice(0, 2)
        : current.spotlightProductIds,
  };

  await prisma.siteContent.upsert({
    where: { key: BOUTIQUE_SETTINGS_KEY },
    create: { key: BOUTIQUE_SETTINGS_KEY, value: merged as unknown as Prisma.InputJsonValue },
    update: { value: merged as unknown as Prisma.InputJsonValue },
  });

  return merged;
}

export function pickSpotlightProductIds(
  products: { id: string; isFeatured?: boolean }[],
  settings: BoutiquePageSettings
): string[] {
  if (settings.spotlightProductIds.length > 0) {
    return settings.spotlightProductIds.slice(0, 2);
  }
  return products
    .filter((p) => p.isFeatured)
    .slice(0, 2)
    .map((p) => p.id);
}
