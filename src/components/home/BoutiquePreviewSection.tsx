import Link from "next/link";
import prisma from "@/lib/prisma";
import { luxeImage } from "@/lib/images";
import { formatPrice } from "@/lib/utils";
import { formatCategoryLabel } from "@/lib/categories";
import { ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";

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
    <section className="py-24 lg:py-32 bg-white">
      <div className="container-premium">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-overline mb-4">Boutique de luxe</p>
          <h2 className="heading-section mb-6">Découvrez la boutique de luxe Ariane</h2>
          <p className="text-brand-600 leading-relaxed">
            Une sélection raffinée de sacs, vêtements, accessoires et parfums,
            choisis avec la même exigence que nos accompagnements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/boutique/${product.slug}`}
              className="group card-premium overflow-hidden bg-white"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-brand-100">
                <ProductImage
                  src={product.images[0]}
                  fallback={luxeImage(product.slug)}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                {product.isFeatured && (
                  <span className="absolute top-4 left-4 bg-brand-950 text-white text-[10px] uppercase tracking-widest px-3 py-1">
                    Exclusif
                  </span>
                )}
                {product.categoryName && (
                  <span className="absolute top-4 right-4 bg-white/90 text-brand-700 text-[10px] uppercase tracking-widest px-3 py-1">
                    {product.categoryName}
                  </span>
                )}
              </div>
              <div className="p-6">
                {product.brand && (
                  <p className="text-[10px] uppercase tracking-ultra text-brand-400 mb-1">
                    {product.brand}
                  </p>
                )}
                <h3 className="product-title mb-2 group-hover:text-accent transition-colors">
                  {product.name}
                </h3>
                <p className="product-description mb-4 line-clamp-2">
                  {product.shortDescription}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{formatPrice(product.price)}</span>
                  <ArrowRight className="w-4 h-4 text-brand-400 group-hover:text-brand-950 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/boutique" className="btn-primary inline-flex items-center gap-2">
            Explorer la boutique
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
