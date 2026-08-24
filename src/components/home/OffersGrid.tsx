import Link from "next/link";
import prisma from "@/lib/prisma";
import { coachingImage, IMAGES } from "@/lib/images";
import { formatPrice } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";

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
    <div className={`grid gap-6 ${compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
      {products.map((product, index) => (
        <Link
          key={product.id}
          href={product.slug === "sur-mesure" ? "/contact?type=diagnostic" : `/offres/${product.slug}`}
          className="group card-premium overflow-hidden"
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-brand-100">
            <ProductImage
              src={product.images[0]}
              fallback={coachingImage(product.slug)}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            {"isFeatured" in product && product.isFeatured && (
              <span className="absolute top-4 left-4 bg-brand-950 text-white text-[10px] uppercase tracking-widest px-3 py-1">
                Populaire
              </span>
            )}
          </div>
          <div className="p-6">
            <h3 className="font-display text-xl mb-2 group-hover:text-accent transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-brand-500 mb-4 line-clamp-2">
              {product.shortDescription}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {product.slug === "sur-mesure" ? "À partir de " : ""}
                {formatPrice(product.price)}
              </span>
              <ArrowRight className="w-4 h-4 text-brand-400 group-hover:text-brand-950 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
