import prisma from "@/lib/prisma";
import { CatalogueSubNav } from "@/components/admin/catalogue/CatalogueSubNav";
import { ProductForm } from "@/components/admin/catalogue/ProductForm";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";

async function getFormData() {
  try {
    const [categories, brands] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: { id: true, name: true, slug: true, parentId: true, sortOrder: true, scope: true },
      }),
      prisma.brand.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: { id: true, name: true, slug: true },
      }),
    ]);
    return { categories, brands };
  } catch {
    return { categories: [], brands: [] };
  }
}

export default async function NewProductPage() {
  const { categories, brands } = await getFormData();

  return (
    <div>
      <AdminPageHeader section="Offre" title="Nouveau produit" description="Création d'une fiche catalogue" />
      <CatalogueSubNav active="products" />
      <ProductForm mode="create" categories={categories} brands={brands} />
    </div>
  );
}
