import { Prisma, ProductType } from "@prisma/client";
import { slugify } from "@/lib/utils";
import { buildCategorySlugProductFilter } from "@/lib/categories";

export interface BoutiqueSearchParams {
  q?: string;
  category?: string;
  brand?: string;
  type?: ProductType;
}

export function buildProductSearchWhere(params: BoutiqueSearchParams): Prisma.ProductWhereInput {
  const { q, category, brand, type = "LUXE" } = params;
  const terms = q?.trim().split(/\s+/).filter(Boolean) ?? [];

  const andClauses: Prisma.ProductWhereInput[] = [
    { isActive: true },
    { productType: type },
  ];

  if (category && category !== "all") {
    andClauses.push(buildCategorySlugProductFilter(category));
  }

  if (brand && brand !== "all") {
    andClauses.push({
      OR: [
        { brandRef: { slug: brand, isActive: true } },
        { brand: { contains: brand, mode: "insensitive" } },
      ],
    });
  }

  if (terms.length > 0) {
    andClauses.push(
      ...terms.map((term) => ({
        OR: [
          { name: { contains: term, mode: "insensitive" as const } },
          { shortDescription: { contains: term, mode: "insensitive" as const } },
          { description: { contains: term, mode: "insensitive" as const } },
          { brand: { contains: term, mode: "insensitive" as const } },
          { sku: { contains: term, mode: "insensitive" as const } },
          { keywords: { has: term.toLowerCase() } },
          { category: { name: { contains: term, mode: "insensitive" as const } } },
          { brandRef: { name: { contains: term, mode: "insensitive" as const } } },
        ],
      }))
    );
  }

  return { AND: andClauses };
}

export function parseKeywordsInput(input: string): string[] {
  return input
    .split(/[,;|\n]+/)
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i);
}

export function parseLinesInput(input: string): string[] {
  return input
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export function uniqueSlug(base: string, existing: string[]): string {
  let slug = slugify(base);
  let counter = 1;
  while (existing.includes(slug)) {
    slug = `${slugify(base)}-${counter++}`;
  }
  return slug;
}

export function buildKeywordsFromProduct(data: {
  name: string;
  brand?: string | null;
  categoryName?: string;
  features?: string[];
  extra?: string[];
}): string[] {
  const raw = [
    data.name,
    data.brand ?? "",
    data.categoryName ?? "",
    ...(data.features ?? []),
    ...(data.extra ?? []),
  ];
  return parseKeywordsInput(raw.join(", "));
}
