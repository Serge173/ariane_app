import prisma from "@/lib/prisma";
import { AdminProductsTable } from "@/components/admin/AdminProductsTable";
import { AdminOffresSubNav } from "@/components/admin/AdminOffresSubNav";
import Link from "next/link";

export default async function AdminLuxePage() {
  let products: Parameters<typeof AdminProductsTable>[0]["products"] = [];
  try {
    products = await prisma.product.findMany({
      where: { productType: "LUXE" },
      include: { category: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {}

  const byCategory = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category.name] = (acc[p.category.name] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Articles de luxe</h1>
        <p className="text-brand-600">
          {products.length} article{products.length !== 1 ? "s" : ""} — Sacs, Vêtements, Accessoires, Parfums
        </p>
        {Object.keys(byCategory).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(byCategory).map(([cat, count]) => (
              <span key={cat} className="text-[10px] uppercase tracking-wider px-3 py-1 bg-brand-100 text-brand-600">
                {cat} · {count}
              </span>
            ))}
          </div>
        )}
      </div>

      <AdminOffresSubNav active="luxe" />

      <div className="mb-6 p-4 bg-brand-50 border border-brand-100 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brand-600">
          Créez, modifiez et organisez vos articles depuis le catalogue complet.
        </p>
        <Link href="/admin/catalogue/produits?type=LUXE" className="btn-primary text-xs">
          Gérer dans le catalogue →
        </Link>
      </div>

      <div className="mt-8">
        <AdminProductsTable products={products} type="LUXE" />
      </div>

      <p className="mt-6 text-xs text-brand-400">
        Affichés sur le site :{" "}
        <Link href="/boutique" className="text-accent hover:underline" target="_blank">
          /boutique
        </Link>
      </p>
    </div>
  );
}
