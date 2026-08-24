import prisma from "@/lib/prisma";
import { CatalogueSubNav } from "@/components/admin/catalogue/CatalogueSubNav";
import { BrandManager } from "@/components/admin/catalogue/BrandManager";

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
      <CatalogueSubNav active="brands" />
      <BrandManager initial={brands} />
    </div>
  );
}
