import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { luxeImage } from "@/lib/images";
import { buildProductSearchWhere } from "@/lib/catalogue";
import {
  buildPublicCategoryTree,
  filterCategoriesByScope,
  flattenPublicCategoryFilters,
  formatCategoryLabel,
  type PublicCategory,
} from "@/lib/categories";
import { BoutiqueCatalog, type BoutiqueProduct } from "@/components/shop/BoutiqueCatalog";
import { BOUTIQUE_CATEGORIES } from "@/lib/boutique";
import { BoutiquePromoBar } from "@/components/shop/BoutiquePromoBar";
import { BoutiqueHero } from "@/components/shop/BoutiqueHero";
import { BoutiqueCollectionTiles } from "@/components/shop/BoutiqueCollectionTiles";
import { BoutiqueEditorialSpotlight } from "@/components/shop/BoutiqueEditorialSpotlight";
import { BoutiqueStory } from "@/components/shop/BoutiqueStory";
import { BoutiqueSubNav } from "@/components/shop/BoutiqueSubNav";
import {
  getBoutiquePageSettings,
  pickSpotlightProductIds,
} from "@/lib/boutique-settings";
import { productDisplayPrice } from "@/lib/shop/variants";
import { BRAND_FULL_NAME } from "@/lib/brand";
import { isShoppingLine, type ShoppingLine } from "@/lib/shopping";

export const metadata: Metadata = {
  title: "La Boutique",
  description:
    `Boutique de luxe ${BRAND_FULL_NAME} — sacs, vêtements, accessoires et parfums sélectionnés avec exigence.`,
};

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string; brand?: string; line?: string }>;
}

async function getCatalogData(params: { q?: string; category?: string; brand?: string; line?: string }) {
  const line = isShoppingLine(params.line) ? params.line : undefined;
  try {
    const where = buildProductSearchWhere({
      q: params.q,
      category: params.category,
      brand: params.brand,
      type: "LUXE",
      line,
    });

    const [products, allCategories, brands] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { include: { parent: true } },
          brandRef: true,
          variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
        },
        orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
      }),
      prisma.category.findMany({
        where: { isActive: true, scope: "LUXE" },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          parentId: true,
          sortOrder: true,
          scope: true,
        },
      }),
      prisma.brand.findMany({
        where: {
          isActive: true,
          products: { some: { productType: "LUXE", isActive: true } },
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: { slug: true, name: true },
      }),
    ]);

    const visibleCategories = filterCategoriesByScope(
      allCategories as PublicCategory[],
      "LUXE"
    );
    const categoryRoots = buildPublicCategoryTree(visibleCategories);
    const categoryFilters = flattenPublicCategoryFilters(categoryRoots);

    if (products.length > 0 || params.q || params.category || params.brand || line) {
      return {
        products: products.map((p) => {
          const shopVariants = p.variants.map((v) => ({
            id: v.id,
            name: v.name,
            size: v.size,
            color: v.color,
            sku: v.sku,
            price: v.price,
            compareAtPrice: v.compareAtPrice,
            stock: v.stock,
            trackInventory: v.trackInventory,
            isActive: v.isActive,
          }));
          const pricing = productDisplayPrice(p.price, shopVariants);
          return {
            id: p.id,
            slug: p.slug,
            name: p.name,
            brand: p.brandRef?.name || p.brand,
            shortDescription: p.shortDescription,
            price: pricing.price,
            images: p.images,
            isFeatured: p.isFeatured,
            categorySlug: p.category.slug,
            categoryName: formatCategoryLabel(p.category),
            hasVariants: shopVariants.length > 0,
            fromPrice: pricing.fromPrice,
          };
        }) satisfies BoutiqueProduct[],
        categoryRoots,
        categoryFilters,
        brands,
      };
    }
  } catch {}

  return {
    products: getFallbackProducts(line),
    categoryRoots: BOUTIQUE_CATEGORIES.map((c) => ({
      id: c.slug,
      slug: c.slug,
      name: c.name,
      description: c.description,
      parentId: null,
      sortOrder: 0,
      scope: "LUXE" as const,
      children: [],
    })),
    categoryFilters: BOUTIQUE_CATEGORIES.map((c) => ({
      slug: c.slug,
      name: c.name,
      depth: 0,
    })),
    brands: [] as { slug: string; name: string }[],
  };
}

function getFallbackProducts(line?: ShoppingLine): BoutiqueProduct[] {
  const slugs = [
    "sac-cabas-cuir", "sac-bandouliere-iconique", "blazer-soie-noire", "robe-soie-elegance",
    "ceinture-cuir-artisanale", "foulard-soie-signature", "parfum-signature-ariane", "coffret-fragrances",
  ] as const;
  const all = [
    { id: "1", slug: slugs[0], name: "Sac Cabas Cuir", brand: "Maison Élégance", shortDescription: "Maroquinerie artisanale, finitions main", price: 450000, images: [luxeImage(slugs[0])], isFeatured: true, categorySlug: "sacs", categoryName: "Sacs", line: "luxe" as const },
    { id: "2", slug: slugs[1], name: "Sac Bandoulière Iconique", brand: "Atelier Prestige", shortDescription: "Silhouette intemporelle, cuir grainé", price: 380000, images: [luxeImage(slugs[1])], categorySlug: "sacs", categoryName: "Sacs", line: "luxe" as const },
    { id: "3", slug: slugs[2], name: "Blazer Soie Noire", brand: "Collection Ariane", shortDescription: "Coupe structurée, élégance professionnelle", price: 320000, images: [luxeImage(slugs[2])], isFeatured: true, categorySlug: "vetements", categoryName: "Vêtements", line: "luxe" as const },
    { id: "4", slug: slugs[3], name: "Robe Soie Élégance", brand: "Maison Élégance", shortDescription: "Tombe fluide, palette raffinée", price: 280000, images: [luxeImage(slugs[3])], categorySlug: "vetements", categoryName: "Vêtements", line: "luxe" as const },
    { id: "5", slug: slugs[4], name: "Ceinture Cuir Artisanale", brand: "Atelier Prestige", shortDescription: "Boucle dorée, cuir pleine fleur", price: 95000, images: [luxeImage(slugs[4])], categorySlug: "accessoires", categoryName: "Accessoires", line: "premium" as const },
    { id: "6", slug: slugs[5], name: "Foulard Soie Signature", brand: "Collection Ariane", shortDescription: "Imprimé exclusif, 100% soie", price: 75000, images: [luxeImage(slugs[5])], categorySlug: "accessoires", categoryName: "Accessoires", line: "premium" as const },
    { id: "7", slug: slugs[6], name: "Parfum Signature", brand: "Ariane Parfums", shortDescription: "Notes florales et boisées, flacon collector", price: 120000, images: [luxeImage(slugs[6])], isFeatured: true, categorySlug: "parfums", categoryName: "Parfums", line: "premium" as const },
    { id: "8", slug: slugs[7], name: "Coffret Fragrances Premium", brand: "Ariane Parfums", shortDescription: "Trois eaux de parfum en édition limitée", price: 185000, images: [luxeImage(slugs[7])], categorySlug: "parfums", categoryName: "Parfums", line: "premium" as const },
  ];
  return line ? all.filter((p) => p.line === line).map(({ line: _line, ...product }) => product) : all.map(({ line: _line, ...product }) => product);
}

export default async function BoutiquePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const line = isShoppingLine(params.line) ? params.line : undefined;
  const [{ products, categoryRoots, categoryFilters }, boutiqueSettings] = await Promise.all([
    getCatalogData(params),
    getBoutiquePageSettings(),
  ]);

  const hasFilter = Boolean(params.category || params.q || params.brand || line);
  const lineLabel = line === "luxe" ? "Luxe" : line === "premium" ? "Premium" : null;
  const spotlightIds = pickSpotlightProductIds(products, boutiqueSettings);
  const spotlightProducts = spotlightIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is BoutiqueProduct => Boolean(p));
  const sectionTitle = params.category
    ? categoryFilters.find((c) => c.slug === params.category)?.name ?? "Catalogue"
    : params.q
    ? "Résultats"
    : lineLabel
    ? `Shopping ${lineLabel}`
    : boutiqueSettings.catalogue.title;

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      {!hasFilter ? (
        <>
          <BoutiquePromoBar text={boutiqueSettings.promoText} />
          <BoutiqueHero hero={boutiqueSettings.hero} />
          <BoutiqueCollectionTiles roots={categoryRoots} collections={boutiqueSettings.collections} />
          <BoutiqueEditorialSpotlight
            products={spotlightProducts}
            title={boutiqueSettings.spotlightTitle}
            buttonLabel={boutiqueSettings.spotlightButtonLabel}
          />
        </>
      ) : (
        <div className="pt-24 lg:pt-28 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {(params.category || params.q || params.brand) && (
            <Link
              href={line ? `/boutique?line=${line}` : "/boutique"}
              className="font-sans text-xs uppercase tracking-[0.2em] text-brand-600 hover:text-brand-950 transition-colors"
            >
              ← Retour au shopping
            </Link>
          )}
          <Suspense fallback={<div className="h-12 mt-6" />}>
            <BoutiqueSubNav roots={categoryRoots} />
          </Suspense>
        </div>
      )}

      <div id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-light italic text-brand-950 mb-3">
            {sectionTitle}
          </h2>
          {!hasFilter && (
            <p className="font-sans text-sm text-brand-600">
              {boutiqueSettings.catalogue.subtitle}
            </p>
          )}
        </div>

        <BoutiqueCatalog
          products={products}
          categories={categoryFilters}
          hideCategoryFilter
          variant="wix"
        />
      </div>

      {!hasFilter && <BoutiqueStory story={boutiqueSettings.story} />}
    </div>
  );
}
