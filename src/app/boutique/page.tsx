import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { IMAGES, luxeImage } from "@/lib/images";
import { buildProductSearchWhere } from "@/lib/catalogue";
import {
  buildPublicCategoryTree,
  filterCategoriesByScope,
  flattenPublicCategoryFilters,
  formatCategoryLabel,
  type PublicCategory,
} from "@/lib/categories";
import { BoutiqueCatalog, type BoutiqueProduct } from "@/components/shop/BoutiqueCatalog";
import { BoutiqueSearch } from "@/components/shop/BoutiqueSearch";
import { BoutiqueCategoryGrid } from "@/components/shop/BoutiqueCategoryGrid";
import { BOUTIQUE_CATEGORIES } from "@/lib/boutique";
import { ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "Ma Boutique Luxe",
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
  const { products, categoryRoots, categoryFilters, brands } = await getCatalogData(params);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <section className="relative mb-16 lg:mb-24">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <p className="text-overline mb-4">Boutique de luxe</p>
              <h1 className="heading-display mb-6">Ma Boutique</h1>
              <p className="text-brand-600 leading-relaxed mb-8 max-w-lg">
                Une sélection exigeante de sacs, vêtements, accessoires et parfums,
                choisis pour sublimer votre image avec la même exigence que nos accompagnements.
              </p>
              <Link href="/panier" className="btn-primary inline-flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Voir mon panier
              </Link>
            </div>
            <div className="relative aspect-[4/5] lg:aspect-[3/4] bg-brand-100 overflow-hidden">
              <Image
                src={IMAGES.boutiqueHero}
                alt="Boutique luxe Conseil en Image"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container-premium">
        <Suspense fallback={null}>
          <BoutiqueSearch
            categories={categoryFilters}
            brands={brands}
          />
        </Suspense>

        <BoutiqueCategoryGrid roots={categoryRoots} activeSlug={params.category} />

        <BoutiqueCatalog
          products={products}
          categories={categoryFilters}
          hideCategoryFilter
        />

        <div className="mt-24 grid lg:grid-cols-2 gap-8">
          <div className="p-10 bg-brand-950 text-white">
            <p className="text-overline text-brand-400 mb-3">Conciergerie shopping</p>
            <h2 className="font-display text-2xl mb-4">Personal shopping luxe</h2>
            <p className="text-brand-300 text-sm leading-relaxed mb-6">
              Besoin d&apos;une sélection sur mesure ? Notre service de conciergerie vous accompagne
              pour trouver les pièces parfaites, en boutique ou sur commande.
            </p>
            <Link href="/contact?type=diagnostic" className="btn-primary bg-white text-brand-950 hover:bg-brand-100 inline-flex items-center gap-2 text-xs">
              Demander la conciergerie
            </Link>
          </div>
          <div className="p-10 bg-brand-50 border border-brand-100 flex flex-col justify-center">
            <p className="text-overline mb-3">Coaching image</p>
            <h2 className="font-display text-2xl mb-4">Complétez votre style</h2>
            <p className="text-brand-600 text-sm leading-relaxed mb-6">
              Nos accompagnements Standard, Gold et Platinum vous aident à harmoniser
              vos achats luxe avec votre personnalité et vos objectifs.
            </p>
            <Link href="/offres" className="btn-secondary text-xs inline-block w-fit">
              Voir les accompagnements
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

