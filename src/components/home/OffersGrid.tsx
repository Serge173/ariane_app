import Link from "next/link";
import prisma from "@/lib/prisma";
import { coachingImage } from "@/lib/images";
import { formatPrice } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { StaggerReveal } from "@/components/motion/StaggerReveal";

async function getProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true, productType: "SERVICE" },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return getFallbackProducts();
  }
}

function getFallbackProducts() {
  return [
    {
      id: "1", slug: "standard", name: "Standard", shortDescription: "L'essentiel pour aligner votre image",
      price: 60000, images: [coachingImage("standard")],
      features: ["Analyse colorimétrique", "Audit garde-robe", "Guide digital"], isFeatured: false,
    },
    {
      id: "2", slug: "gold", name: "Gold", shortDescription: "Transformation en profondeur",
      price: 150000, images: [coachingImage("gold")],
      features: ["Tout Standard", "Personal shopping", "Suivi 1 mois"], isFeatured: true,
    },
    {
      id: "3", slug: "platinum", name: "Platinum", shortDescription: "Excellence premium",
      price: 350000, images: [coachingImage("platinum")],
      features: ["Tout Gold", "Multi-séances", "Suivi 3 mois"], isFeatured: true,
    },
    {
      id: "4", slug: "sur-mesure", name: "Sur-mesure", shortDescription: "Accompagnement unique",
      price: 500000, images: [coachingImage("sur-mesure")],
      features: ["Diagnostic complet", "Conciergerie luxe", "Parcours flexible"], isFeatured: false,
    },
  ];
}

export async function OffersGrid({ compact = false }: { compact?: boolean }) {
  const products = await getProducts();

  return (
    <StaggerReveal
      className={
        compact
          ? "grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-2 w-full min-w-0"
          : "grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4 w-full min-w-0"
      }
    >
      {products.map((product) => (
        <Link
          key={product.id}
          href={product.slug === "sur-mesure" ? "/contact?type=diagnostic" : `/offres/${product.slug}`}
          className="group card-premium overflow-hidden min-w-0 w-full"
        >
          <div className="relative aspect-square sm:aspect-[3/4] product-frame">
            <ProductImage
              src={product.images[0]}
              fallback={coachingImage(product.slug)}
              alt={product.name}
              fill
              className="product-frame__image"
              sizes="(max-width: 640px) 46vw, 25vw"
            />
            <div className="product-frame__overlay" aria-hidden />
            <span className="product-frame__label hidden sm:flex">Voir</span>
            {"isFeatured" in product && product.isFeatured && (
              <span className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-brand-950 text-white text-[8px] sm:text-[10px] uppercase tracking-widest px-1.5 py-0.5 sm:px-3 sm:py-1">
                Populaire
              </span>
            )}
          </div>
          <div className="p-2.5 sm:p-6 min-w-0">
            <h3 className="font-sans text-sm sm:text-xl font-medium tracking-tight text-brand-950 mb-1 sm:mb-2 truncate">
              {product.name}
            </h3>
            <p className="hidden sm:block font-sans text-sm text-brand-600 leading-relaxed mb-4 line-clamp-2">
              {product.shortDescription}
            </p>
            <div className="flex items-center justify-between gap-1 min-w-0">
              <span className="text-[10px] sm:text-sm font-medium truncate">
                {product.slug === "sur-mesure" ? "Dès " : ""}
                {formatPrice(product.price)}
              </span>
              <ArrowRight className="hidden sm:block w-4 h-4 text-brand-400 shrink-0" strokeWidth={1.5} />
            </div>
          </div>
        </Link>
      ))}
    </StaggerReveal>
  );
}
