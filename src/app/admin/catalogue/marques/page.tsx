import prisma from "@/lib/prisma";
import { CatalogueSubNav } from "@/components/admin/catalogue/CatalogueSubNav";
import { BrandManager } from "@/components/admin/catalogue/BrandManager";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";

export default async function AdminBrandsPage() {
  let brands: Parameters<typeof BrandManager>[0]["initial"] = [];
  try {
    brands = await prisma.brand.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  } catch {}

  return (
    <div>
      <AdminPageHeader
        section="Offre"
        title="Marques"
        description="Maisons et labels de votre boutique"
      />
      <CatalogueSubNav active="brands" />
      <BrandManager initial={brands} />
    </div>
  );
}
