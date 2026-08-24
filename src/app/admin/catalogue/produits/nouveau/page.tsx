import prisma from "@/lib/prisma";
import { CatalogueSubNav } from "@/components/admin/catalogue/CatalogueSubNav";
import { ProductForm } from "@/components/admin/catalogue/ProductForm";

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
      <CatalogueSubNav active="products" />
      <h1 className="heading-section mb-8">Nouveau produit</h1>
      <ProductForm mode="create" categories={categories} brands={brands} />
    </div>
  );
}
