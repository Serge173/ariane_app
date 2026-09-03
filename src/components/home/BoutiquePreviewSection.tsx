import Link from "next/link";
import prisma from "@/lib/prisma";
import { luxeImage } from "@/lib/images";
import { formatPrice } from "@/lib/utils";
import { formatCategoryLabel } from "@/lib/categories";
import { ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerReveal } from "@/components/motion/StaggerReveal";

const PREVIEW_COUNT = 4;

interface PreviewProduct {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  shortDescription: string | null;
  price: number;
  images: string[];
  isFeatured: boolean;
  categoryName: string | null;
}

function getFallbackProducts(): PreviewProduct[] {
  return [
    {
      id: "1",
      slug: "sac-cabas-cuir",
      name: "Sac Cabas Cuir",
      brand: "Maison Élégance",
      shortDescription: "Maroquinerie artisanale, finitions main",
      price: 450000,
      images: [luxeImage("sac-cabas-cuir")],
      isFeatured: true,
      categoryName: "Sacs",
    },
    {
      id: "2",
      slug: "blazer-soie-noire",
      name: "Blazer Soie Noire",
      brand: "Collection Ariane",
      shortDescription: "Coupe structurée, élégance professionnelle",
      price: 320000,
      images: [luxeImage("blazer-soie-noire")],
      isFeatured: true,
      categoryName: "Vêtements",
    },
    {
      id: "3",
      slug: "parfum-signature-ariane",
      name: "Parfum Signature",
      brand: "Ariane Parfums",
      shortDescription: "Notes florales et boisées, flacon collector",
      price: 120000,
      images: [luxeImage("parfum-signature-ariane")],
      isFeatured: true,
      categoryName: "Parfums",
    },
    {
      id: "4",
      slug: "foulard-soie-signature",
      name: "Foulard Soie Signature",
      brand: "Collection Ariane",
      shortDescription: "Imprimé exclusif, 100% soie",
      price: 75000,
      images: [luxeImage("foulard-soie-signature")],
      isFeatured: false,
      categoryName: "Accessoires",
    },
  ];
}

async function getLuxeProducts(): Promise<PreviewProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, productType: "LUXE" },
      include: {
        category: { include: { parent: true } },
        brandRef: true,
      },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
      take: PREVIEW_COUNT,
    });

    if (products.length === 0) return getFallbackProducts();

    return products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brandRef?.name || p.brand,
      shortDescription: p.shortDescription,
      price: p.price,
      images: p.images,
      isFeatured: p.isFeatured,
      categoryName: formatCategoryLabel(p.category),
    }));
  } catch {
    return getFallbackProducts();
  }
}

export async function BoutiquePreviewSection() {
  const products = await getLuxeProducts();

  return (
    <section className="section-home lg:py-32 bg-white overflow-x-hidden">
      <div className="container-premium min-w-0">
        <Reveal className="section-home-intro">
          <p className="text-overline mb-2.5 sm:mb-4">Boutique de luxe</p>
          <h2 className="heading-section mb-3 sm:mb-5">Découvrez la boutique de luxe Ariane</h2>
          <p className="text-sm sm:text-base text-brand-600 leading-relaxed">
            Une sélection raffinée de sacs, vêtements, accessoires et parfums,
            choisis avec la même exigence que nos accompagnements.
          </p>
        </Reveal>

        <StaggerReveal className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4 w-full min-w-0">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/boutique/${product.slug}`}
              className="group card-premium overflow-hidden bg-white min-w-0 w-full"
            >
              <div className="relative aspect-square sm:aspect-[3/4] product-frame">
                <ProductImage
                  src={product.images[0]}
                  fallback={luxeImage(product.slug)}
                  alt={product.name}
                  fill
                  className="product-frame__image"
                  sizes="(max-width: 640px) 46vw, 25vw"
                />
                <div className="product-frame__overlay" aria-hidden />
                <span className="product-frame__label hidden sm:flex">Voir</span>
                {product.isFeatured && (
                  <span className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-brand-950 text-white text-[8px] sm:text-[10px] uppercase tracking-widest px-1.5 py-0.5 sm:px-3 sm:py-1">
                    Exclusif
                  </span>
                )}
              </div>
              <div className="p-2.5 sm:p-6 min-w-0">
                {product.brand && (
                  <p className="hidden sm:block text-[10px] uppercase tracking-ultra text-brand-400 mb-1 truncate">
                    {product.brand}
                  </p>
                )}
                <h3 className="font-sans text-sm sm:text-xl font-medium tracking-tight text-brand-950 mb-1 sm:mb-2 truncate">
                  {product.name}
                </h3>
                <p className="hidden sm:block font-sans text-sm text-brand-600 leading-relaxed mb-4 line-clamp-2">
                  {product.shortDescription}
                </p>
                <div className="flex items-center justify-between gap-1 min-w-0">
                  <span className="text-[10px] sm:text-sm font-medium truncate">{formatPrice(product.price)}</span>
                  <ArrowRight className="hidden sm:block w-4 h-4 text-brand-400 shrink-0" strokeWidth={1.5} />
                </div>
              </div>
            </Link>
          ))}
        </StaggerReveal>

        <div className="mt-8 sm:mt-12">
          <Link
            href="/boutique"
            className="link-underline font-sans text-sm uppercase tracking-wide text-brand-800 hover:text-brand-950 inline-flex items-center gap-2"
          >
            Explorer la boutique
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
