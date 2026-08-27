import { Metadata } from "next";
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
import { BoutiqueHero } from "@/components/shop/BoutiqueHero";
import { BoutiqueSubNav } from "@/components/shop/BoutiqueSubNav";
import { BoutiqueFeaturedRow } from "@/components/shop/BoutiqueFeaturedRow";

export const metadata: Metadata = {
  title: "La Boutique",
  description:
    "Boutique de luxe Conseil en Image avec Ariane — sacs, vêtements, accessoires et parfums sélectionnés avec exigence.",
};

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string; brand?: string }>;
}

async function getCatalogData(params: { q?: string; category?: string; brand?: string }) {
  try {
    const where = buildProductSearchWhere({
      q: params.q,
      category: params.category,
      brand: params.brand,
      type: "LUXE",
    });

    const [products, allCategories, brands] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { include: { parent: true } }, brandRef: true },
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

    if (products.length > 0 || params.q || params.category || params.brand) {
      return {
        products: products.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          brand: p.brandRef?.name || p.brand,
          shortDescription: p.shortDescription,
          price: p.price,
          images: p.images,
          isFeatured: p.isFeatured,
          categorySlug: p.category.slug,
          categoryName: formatCategoryLabel(p.category),
        })) satisfies BoutiqueProduct[],
        categoryRoots,
        categoryFilters,
        brands,
      };
    }
  } catch {}

  return {
    products: getFallbackProducts(),
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

function getFallbackProducts(): BoutiqueProduct[] {
  const slugs = [
    "sac-cabas-cuir", "sac-bandouliere-iconique", "blazer-soie-noire", "robe-soie-elegance",
    "ceinture-cuir-artisanale", "foulard-soie-signature", "parfum-signature-ariane", "coffret-fragrances",
  ] as const;
  return [
    { id: "1", slug: slugs[0], name: "Sac Cabas Cuir", brand: "Maison Élégance", shortDescription: "Maroquinerie artisanale, finitions main", price: 450000, images: [luxeImage(slugs[0])], isFeatured: true, categorySlug: "sacs", categoryName: "Sacs" },
    { id: "2", slug: slugs[1], name: "Sac Bandoulière Iconique", brand: "Atelier Prestige", shortDescription: "Silhouette intemporelle, cuir grainé", price: 380000, images: [luxeImage(slugs[1])], categorySlug: "sacs", categoryName: "Sacs" },
    { id: "3", slug: slugs[2], name: "Blazer Soie Noire", brand: "Collection Ariane", shortDescription: "Coupe structurée, élégance professionnelle", price: 320000, images: [luxeImage(slugs[2])], isFeatured: true, categorySlug: "vetements", categoryName: "Vêtements" },
    { id: "4", slug: slugs[3], name: "Robe Soie Élégance", brand: "Maison Élégance", shortDescription: "Tombe fluide, palette raffinée", price: 280000, images: [luxeImage(slugs[3])], categorySlug: "vetements", categoryName: "Vêtements" },
    { id: "5", slug: slugs[4], name: "Ceinture Cuir Artisanale", brand: "Atelier Prestige", shortDescription: "Boucle dorée, cuir pleine fleur", price: 95000, images: [luxeImage(slugs[4])], categorySlug: "accessoires", categoryName: "Accessoires" },
    { id: "6", slug: slugs[5], name: "Foulard Soie Signature", brand: "Collection Ariane", shortDescription: "Imprimé exclusif, 100% soie", price: 75000, images: [luxeImage(slugs[5])], categorySlug: "accessoires", categoryName: "Accessoires" },
    { id: "7", slug: slugs[6], name: "Parfum Signature", brand: "Ariane Parfums", shortDescription: "Notes florales et boisées, flacon collector", price: 120000, images: [luxeImage(slugs[6])], isFeatured: true, categorySlug: "parfums", categoryName: "Parfums" },
    { id: "8", slug: slugs[7], name: "Coffret Fragrances Premium", brand: "Ariane Parfums", shortDescription: "Trois eaux de parfum en édition limitée", price: 185000, images: [luxeImage(slugs[7])], categorySlug: "parfums", categoryName: "Parfums" },
  ];
}

export default async function BoutiquePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { products, categoryRoots, categoryFilters } = await getCatalogData(params);

  const sectionTitle = params.category
    ? categoryFilters.find((c) => c.slug === params.category)?.name ?? "Catalogue"
    : params.q
    ? "Résultats"
    : "Tous les articles";

  return (
    <div className="min-h-screen bg-white">
      <BoutiqueHero />

      <Suspense fallback={<div className="h-12 border-b border-brand-100 bg-white" />}>
        <BoutiqueSubNav roots={categoryRoots} />
      </Suspense>

      <div id="catalogue" className="max-w-[1600px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        {!params.category && !params.q && !params.brand && (
          <BoutiqueFeaturedRow products={products} />
        )}

        <section>
          <h2 className="font-sans text-xs uppercase tracking-[0.2em] text-brand-500 text-center mb-10">
            {sectionTitle}
          </h2>
          <BoutiqueCatalog
            products={products}
            categories={categoryFilters}
            hideCategoryFilter
            variant="lancel"
          />
        </section>
      </div>
    </div>
  );
}
