const UNSPLASH_BASE = "https://images.unsplash.com";

/** Build a verified Unsplash URL (photos tested — avoid dead links). */
export function unsplash(photoId: string, width = 800): string {
  return `${UNSPLASH_BASE}/${photoId}?w=${width}&q=80&auto=format&fit=crop`;
}

/** Shared placeholders */
export const IMAGES = {
  hero: unsplash("photo-1490481651871-ab68de25d43d", 1920),
  about: unsplash("photo-1573496359142-b8d87734a5a2", 800),
  boutiqueHero: unsplash("photo-1445205170230-053b83016050", 900),
  productFallback: unsplash("photo-1490481651871-ab68de25d43d", 800),
  blogCover: unsplash("photo-1573496359142-b8d87734a5a2", 800),

  coaching: {
    standard: unsplash("photo-1490481651871-ab68de25d43d", 800),
    gold: unsplash("photo-1515886657613-9f3515b0c78f", 800),
    platinum: unsplash("photo-1469334031218-e382a71b716b", 800),
    surMesure: unsplash("photo-1509631179647-0177331693ae", 800),
  },

  luxe: {
    "sac-cabas-cuir": unsplash("photo-1584917865442-de89df76afd3", 800),
    "sac-bandouliere-iconique": unsplash("photo-1548036328-c9fa89d128fa", 800),
    "blazer-soie-noire": unsplash("photo-1434389677669-e08b4cac3105", 800),
    "robe-soie-elegance": unsplash("photo-1515886657613-9f3515b0c78f", 800),
    "ceinture-cuir-artisanale": unsplash("photo-1611652022419-a9419f74343d", 800),
    "foulard-soie-signature": unsplash("photo-1520903920243-00d872a2d1c9", 800),
    "parfum-signature-ariane": unsplash("photo-1541643600914-78b084683601", 800),
    "coffret-fragrances": unsplash("photo-1592945403244-b3fbafd7f539", 800),
  },
} as const;

export function luxeImage(slug: string, width = 800): string {
  const known = IMAGES.luxe[slug as keyof typeof IMAGES.luxe];
  return known ? known.replace(/w=\d+/, `w=${width}`) : IMAGES.productFallback;
}

export function coachingImage(slug: string, width = 800): string {
  const map: Record<string, string> = IMAGES.coaching;
  const known = map[slug === "sur-mesure" ? "surMesure" : slug];
  return known ? known.replace(/w=\d+/, `w=${width}`) : IMAGES.productFallback;
}

export function firstProductImage(images: string[] | undefined | null, fallback = IMAGES.productFallback): string {
  const src = images?.[0];
  if (!src) return fallback;
  return src;
}
