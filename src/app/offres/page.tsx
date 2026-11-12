import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { buildProductSearchWhere } from "@/lib/catalogue";
import {
  buildPublicCategoryTree,
  filterCategoriesByScope,
  filterPublicCategoriesForCatalog,
  flattenPublicCategoryFilters,
  type PublicCategory,
} from "@/lib/categories";
import { CatalogSearch } from "@/components/shop/BoutiqueSearch";
import { mapDbOfferProducts, OffersCatalog } from "@/components/shop/OffersCatalog";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";
import { OffersAudienceBar } from "@/components/offres/OffersAudienceBar";
import { OffersHubChooser } from "@/components/offres/OffersHubChooser";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nos prestations",
  description: "Découvrez nos formules de conseil en image : Standard, Gold, Platinum et Sur-mesure.",
};

type OffersAudience = "particuliers" | "entreprises" | null;

function resolveAudience(category?: string): OffersAudience {
  if (category === "particuliers" || category === "entreprises") return category;
  return null;
}

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

    const visibleCategories = filterPublicCategoriesForCatalog(
      filterCategoriesByScope(allCategories as PublicCategory[], "SERVICE")
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
  const audience = resolveAudience(params.category);
  const [{ products, categoryRoots, categoryFilters }, page] = await Promise.all([
    getOffersData(params),
    getPublicPagesSettings(),
  ]);
  const content = page.offers;

  const particuliersRoot = categoryRoots.find((r) => r.slug === "particuliers");
  const entreprisesRoot = categoryRoots.find((r) => r.slug === "entreprises");

  const hero =
    audience === "particuliers"
      ? {
          overline: particuliersRoot?.name ?? "Particuliers",
          title: "Vos formules de coaching image",
          intro: particuliersRoot?.description ?? content.intro,
        }
      : audience === "entreprises"
        ? {
            overline: entreprisesRoot?.name ?? "Entreprises",
            title: content.enterpriseTitle,
            intro: content.enterpriseIntro,
          }
        : {
            overline: content.overline,
            title: content.title,
            intro: content.intro,
          };

  const searchCategories =
    audience && categoryRoots.find((r) => r.slug === audience)
      ? (() => {
          const root = categoryRoots.find((r) => r.slug === audience)!;
          const slugs = new Set([root.slug, ...root.children.map((c) => c.slug)]);
          return categoryFilters.filter((f) => slugs.has(f.slug));
        })()
      : categoryFilters;

  const emptyCatalogMessage =
    audience === "entreprises"
      ? "Nos offres entreprise sont sur mesure. Contactez-nous pour un atelier, un accompagnement dirigeants ou un projet d'image corporate."
      : audience === "particuliers"
        ? "Aucune formule particuliers n'est publiée pour le moment. Revenez bientôt ou contactez-nous."
        : "Aucun accompagnement dans cette catégorie pour le moment.";

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <p className="text-overline mb-4">{hero.overline}</p>
          <h1 className="heading-display mb-6">{hero.title}</h1>
          <p className="leading-relaxed">{hero.intro}</p>
        </div>

        {audience === null ? (
          <>
            <OffersHubChooser roots={categoryRoots} audienceHub={content.audienceHub} />
            <p className="text-center text-sm max-w-lg mx-auto mt-4 opacity-80">
              Choisissez <strong>Particuliers</strong> ou <strong>Entreprises</strong> pour afficher uniquement le
              contenu qui vous concerne.
            </p>
          </>
        ) : (
          <>
            <OffersAudienceBar
              roots={categoryRoots}
              activeSlug={params.category}
              searchQuery={params.q}
            />

            {audience === "particuliers" && (
              <div className="text-center mb-10">
                <Link href={content.helpLinkHref} className="btn-secondary inline-flex items-center gap-2">
                  {content.helpLinkLabel}
                </Link>
              </div>
            )}

            {audience === "entreprises" && (
              <div className="text-center mb-12 max-w-xl mx-auto">
                <Link href={content.enterpriseCtaHref} className="btn-primary inline-flex items-center gap-2">
                  {content.enterpriseCtaLabel}
                </Link>
              </div>
            )}

            <Suspense fallback={null}>
              <CatalogSearch
                categories={searchCategories}
                basePath="/offres"
                showBrandFilter={false}
                searchPlaceholder={
                  audience === "entreprises"
                    ? "Rechercher une offre entreprise..."
                    : "Rechercher une formule, un mot-clé..."
                }
                allCategoryLabel="Toutes catégories"
              />
            </Suspense>

            <OffersCatalog products={products} emptyMessage={emptyCatalogMessage} />

            {audience === "entreprises" && products.length === 0 && (
              <div className="mt-8 text-center">
                <Link href={content.enterpriseCtaHref} className="btn-primary inline-flex">
                  {content.enterpriseCtaLabel}
                </Link>
              </div>
            )}

            {audience === "particuliers" && (
              <div className="mt-16 pt-12 border-t border-brand-200 text-center max-w-md mx-auto">
                <p className="text-xs uppercase tracking-widest text-brand-500 mb-3">
                  Vous représentez une organisation ?
                </p>
                <Link
                  href="/offres?category=entreprises"
                  className="text-sm underline underline-offset-4 hover:text-accent"
                >
                  Voir les accompagnements entreprises
                </Link>
              </div>
            )}

            {audience === "entreprises" && (
              <div className="mt-16 pt-12 border-t border-brand-200 text-center max-w-md mx-auto">
                <p className="text-xs uppercase tracking-widest text-brand-500 mb-3">Pour vous, en individuel ?</p>
                <Link
                  href="/offres?category=particuliers"
                  className="text-sm underline underline-offset-4 hover:text-accent"
                >
                  Découvrir les formules particuliers
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
