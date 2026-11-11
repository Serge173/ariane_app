import prisma from "@/lib/prisma";
import { CatalogueSubNav } from "@/components/admin/catalogue/CatalogueSubNav";
import { CategoryManager } from "@/components/admin/catalogue/CategoryManager";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";

export default async function AdminCategoriesPage() {
  let categories: Parameters<typeof CategoryManager>[0]["initial"] = [];
  try {
    categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
        parent: { select: { id: true, name: true } },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  } catch {}

  return (
    <div>
      <AdminPageHeader
        section="Offre"
        title="Catégories"
        description="Organisez séparément la boutique luxe et les accompagnements"
      />
      <CatalogueSubNav active="categories" />
      <CategoryManager initial={categories} />
    </div>
  );
}
