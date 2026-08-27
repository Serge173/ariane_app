import Link from "next/link";
import prisma from "@/lib/prisma";
import { AdminOffresSubNav } from "@/components/admin/AdminOffresSubNav";

async function getProductCounts() {
  try {
    const [coachingCount, luxeCount] = await Promise.all([
      prisma.product.count({ where: { productType: "SERVICE" } }),
      prisma.product.count({ where: { productType: "LUXE" } }),
    ]);
    return { coachingCount, luxeCount };
  } catch {
    return { coachingCount: 0, luxeCount: 0 };
  }
}

export default async function AdminOffresHubPage() {
  const { coachingCount, luxeCount } = await getProductCounts();

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Prestations & Produits</h1>
        <p className="text-brand-600">
          Gérez vos accompagnements coaching et vos articles de luxe séparément
        </p>
      </div>

      <AdminOffresSubNav active="hub" />

      <div className="grid sm:grid-cols-2 gap-6 mt-8">
        <Link
          href="/admin/offres/accompagnements"
          className="group p-8 bg-white border border-brand-100 hover:border-brand-950 hover:shadow-md transition-all"
        >
          <span className="inline-flex w-8 h-8 items-center justify-center text-accent mb-4 text-xl" aria-hidden>
            ✦
          </span>
          <h2 className="font-display text-xl mb-2 group-hover:text-accent transition-colors">
            Accompagnements coaching
          </h2>
          <p className="text-sm text-brand-500 mb-4">
            Formules Standard, Gold, Platinum et Sur-mesure — prestations de conseil en image
          </p>
          <p className="text-2xl font-light">
            {coachingCount} offre{coachingCount !== 1 ? "s" : ""}
          </p>
        </Link>

        <Link
          href="/admin/offres/luxe"
          className="group p-8 bg-white border border-brand-100 hover:border-brand-950 hover:shadow-md transition-all"
        >
          <span className="inline-flex w-8 h-8 items-center justify-center text-accent mb-4 text-xl" aria-hidden>
            ◆
          </span>
          <h2 className="font-display text-xl mb-2 group-hover:text-accent transition-colors">
            Articles de luxe
          </h2>
          <p className="text-sm text-brand-500 mb-4">
            Sacs, vêtements, accessoires et parfums — boutique Ma Boutique
          </p>
          <p className="text-2xl font-light">
            {luxeCount} article{luxeCount !== 1 ? "s" : ""}
          </p>
        </Link>
      </div>
    </div>
  );
}
