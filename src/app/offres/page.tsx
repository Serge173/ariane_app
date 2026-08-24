import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { buildProductSearchWhere } from "@/lib/catalogue";
import {
  buildPublicCategoryTree,
  filterCategoriesByScope,
  flattenPublicCategoryFilters,
  type PublicCategory,
} from "@/lib/categories";
import { CatalogCategoryGrid } from "@/components/shop/BoutiqueCategoryGrid";
import { CatalogSearch } from "@/components/shop/BoutiqueSearch";
import { mapDbOfferProducts, OffersCatalog } from "@/components/shop/OffersCatalog";

export const metadata: Metadata = {
  title: "Nos Offres",
  description: "Découvrez nos formules de conseil en image : Standard, Gold, Platinum et Sur-mesure.",
};

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

async function getOffersData(params: { q?: string; category?: string }) {
  try {
    const where = buildProductSearchWhere({
      q: params.q,
      category: params.category,
      type: "SERVICE",
    });

    const [products, allCategories] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { include: { parent: true } } },
        orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
      }),
      prisma.category.findMany({
        where: { isActive: true, scope: "SERVICE" },
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
    ]);

    const visibleCategories = filterCategoriesByScope(
      allCategories as PublicCategory[],
      "SERVICE"
    );
    const categoryRoots = buildPublicCategoryTree(visibleCategories);
    const categoryFilters = flattenPublicCategoryFilters(categoryRoots);

    return {
      products: mapDbOfferProducts(products),
      categoryRoots,
      categoryFilters,
    };
  } catch {
    return {
      products: [],
      categoryRoots: [],
      categoryFilters: [],
    };
  }
}

export default async function OffresPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { products, categoryRoots, categoryFilters } = await getOffersData(params);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-overline mb-4">Accompagnements</p>
          <h1 className="heading-display mb-6">Nos formules</h1>
          <p className="text-brand-600 leading-relaxed mb-8">
            Quatre niveaux d&apos;accompagnement pensés pour répondre à chaque ambition.
            Chaque formule inclut un suivi personnalisé dans votre espace client.
          </p>
          <Link href="/orientation" className="btn-secondary inline-flex items-center gap-2">
            Aide au choix
          </Link>
        </div>

        <Suspense fallback={null}>
          <CatalogSearch
            categories={categoryFilters}
            basePath="/offres"
            showBrandFilter={false}
          />
        </Suspense>

        <CatalogCategoryGrid
          roots={categoryRoots}
          activeSlug={params.category}
          basePath="/offres"
        />

        <OffersCatalog products={products} />

        <div className="mt-20 text-center max-w-xl mx-auto">
          <h2 className="font-display text-2xl mb-4">Entreprises & Sur-mesure</h2>
          <p className="text-brand-600 mb-6">
            Ateliers en entreprise, accompagnements dirigeants et projets d&apos;image sur mesure.
            Contactez-nous pour une proposition personnalisée.
          </p>
          <Link href="/contact?type=entreprise" className="btn-primary">
            Demander une proposition
          </Link>
        </div>
      </div>
    </div>
  );
}
