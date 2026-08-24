import prisma from "@/lib/prisma";
import { AdminProductsTable } from "@/components/admin/AdminProductsTable";
import { AdminOffresSubNav } from "@/components/admin/AdminOffresSubNav";
import Link from "next/link";

export default async function AdminAccompagnementsPage() {
  let products: Parameters<typeof AdminProductsTable>[0]["products"] = [];
  try {
    products = await prisma.product.findMany({
      where: { productType: "SERVICE" },
      include: { category: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {}

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Accompagnements coaching</h1>
        <p className="text-brand-600">
          {products.length} formule{products.length !== 1 ? "s" : ""} — Standard, Gold, Platinum, Sur-mesure
        </p>
      </div>

      <AdminOffresSubNav active="coaching" />

      <div className="mb-6 p-4 bg-brand-50 border border-brand-100 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brand-600">
          Ajoutez ou modifiez vos formules coaching depuis le catalogue.
        </p>
        <Link href="/admin/catalogue/produits?type=SERVICE" className="btn-primary text-xs">
          Gérer dans le catalogue →
        </Link>
      </div>

      <div className="mt-8">
        <AdminProductsTable products={products} type="SERVICE" />
      </div>

      <p className="mt-6 text-xs text-brand-400">
        Affichées sur le site :{" "}
        <Link href="/offres" className="text-accent hover:underline" target="_blank">
          /offres
        </Link>
      </p>
    </div>
  );
}
