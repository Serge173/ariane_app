export const BOUTIQUE_CATEGORY_SLUGS = ["sacs", "vetements", "accessoires", "parfums"] as const;

export const BOUTIQUE_CATEGORIES = [
  { slug: "sacs", name: "Sacs", description: "Maroquinerie et sacs de luxe" },
  { slug: "vetements", name: "Vêtements", description: "Pièces premium et intemporelles" },
  { slug: "accessoires", name: "Accessoires", description: "Bijoux, ceintures, foulards et plus" },
  { slug: "parfums", name: "Parfums", description: "Fragrances exclusives et coffrets" },
] as const;

export type BoutiqueCategorySlug = (typeof BOUTIQUE_CATEGORY_SLUGS)[number];
