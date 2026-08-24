import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ProductType } from "@prisma/client";
import { luxeImage, coachingImage } from "@/lib/images";
import { ProductImage } from "@/components/ui/ProductImage";

export interface AdminProductRow {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  price: number;
  duration: string | null;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  category: { name: string };
}

interface AdminProductsTableProps {
  products: AdminProductRow[];
  type: ProductType;
}

export function AdminProductsTable({ products, type }: AdminProductsTableProps) {
  const isLuxe = type === "LUXE";
  const viewBase = isLuxe ? "/boutique" : "/offres";

  return (
    <div className="bg-white border border-brand-100 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-brand-100 text-left bg-brand-50">
            <th className="py-4 px-4 font-medium text-brand-500 w-16">Image</th>
            <th className="py-4 px-4 font-medium text-brand-500">Nom</th>
            {isLuxe && <th className="py-4 px-4 font-medium text-brand-500">Marque</th>}
            <th className="py-4 px-4 font-medium text-brand-500">Prix</th>
            <th className="py-4 px-4 font-medium text-brand-500">Catégorie</th>
            {!isLuxe && <th className="py-4 px-4 font-medium text-brand-500">Durée</th>}
            <th className="py-4 px-4 font-medium text-brand-500">Statut</th>
            <th className="py-4 px-4 font-medium text-brand-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-brand-50 hover:bg-brand-50/50">
              <td className="py-4 px-4">
                <div className="relative w-10 h-10 bg-brand-100 overflow-hidden flex-shrink-0">
                  {product.images[0] ? (
                    <ProductImage
                      src={product.images[0]}
                      fallback={isLuxe ? luxeImage(product.slug) : coachingImage(product.slug)}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : null}
                </div>
              </td>
              <td className="py-4 px-4 font-medium">{product.name}</td>
              {isLuxe && (
                <td className="py-4 px-4 text-brand-600">{product.brand || "—"}</td>
              )}
              <td className="py-4 px-4">{formatPrice(product.price)}</td>
              <td className="py-4 px-4 text-brand-600">{product.category.name}</td>
              {!isLuxe && (
                <td className="py-4 px-4 text-brand-600">{product.duration || "—"}</td>
              )}
              <td className="py-4 px-4">
                <span className={`text-[10px] uppercase tracking-wider px-2 py-1 ${product.isActive ? "bg-green-100 text-green-800" : "bg-brand-100"}`}>
                  {product.isActive ? "Actif" : "Inactif"}
                </span>
                {product.isFeatured && (
                  <span className="ml-1 text-[10px] uppercase tracking-wider px-2 py-1 bg-brand-950 text-white">
                    Vedette
                  </span>
                )}
              </td>
              <td className="py-4 px-4">
                <Link href={`${viewBase}/${product.slug}`} className="text-xs text-accent hover:underline" target="_blank">
                  Voir sur le site
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <p className="text-center text-brand-400 py-12">
          Aucun {isLuxe ? "article" : "accompagnement"} — lancez{" "}
          <code className="bg-brand-100 px-2 py-1">npm run db:seed</code>
        </p>
      )}
    </div>
  );
}
