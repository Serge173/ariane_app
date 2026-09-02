import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const BOUTIQUE_SETTINGS_KEY = "boutique_page_settings";

export interface BoutiquePageSettings {
  spotlightTitle: string;
  spotlightButtonLabel: string;
  spotlightProductIds: string[];
}

export const DEFAULT_BOUTIQUE_PAGE_SETTINGS: BoutiquePageSettings = {
  spotlightTitle: "Les plus convoités",
  spotlightButtonLabel: "Découvrir",
  spotlightProductIds: [],
};

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
      spotlightTitle:
        typeof raw.spotlightTitle === "string" && raw.spotlightTitle.trim()
          ? raw.spotlightTitle.trim()
          : DEFAULT_BOUTIQUE_PAGE_SETTINGS.spotlightTitle,
      spotlightButtonLabel:
        typeof raw.spotlightButtonLabel === "string" && raw.spotlightButtonLabel.trim()
          ? raw.spotlightButtonLabel.trim()
          : DEFAULT_BOUTIQUE_PAGE_SETTINGS.spotlightButtonLabel,
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
    spotlightTitle:
      patch.spotlightTitle !== undefined
        ? patch.spotlightTitle.trim() || DEFAULT_BOUTIQUE_PAGE_SETTINGS.spotlightTitle
        : current.spotlightTitle,
    spotlightButtonLabel:
      patch.spotlightButtonLabel !== undefined
        ? patch.spotlightButtonLabel.trim() || DEFAULT_BOUTIQUE_PAGE_SETTINGS.spotlightButtonLabel
        : current.spotlightButtonLabel,
    spotlightProductIds:
      patch.spotlightProductIds !== undefined
        ? patch.spotlightProductIds.filter(Boolean).slice(0, 2)
        : current.spotlightProductIds,
  };

  const jsonValue = merged as unknown as Prisma.InputJsonValue;

  await prisma.siteContent.upsert({
    where: { key: BOUTIQUE_SETTINGS_KEY },
    create: { key: BOUTIQUE_SETTINGS_KEY, value: jsonValue },
    update: { value: jsonValue },
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
