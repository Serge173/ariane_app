import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { CatalogueSubNav } from "@/components/admin/catalogue/CatalogueSubNav";
import { ProductForm } from "@/components/admin/catalogue/ProductForm";
import { variantsToFormRows } from "@/lib/product-variant-form";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";

interface Props {
  params: Promise<{ id: string }>;
}

async function getData(id: string) {
  try {
    const [product, categories, brands] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          brandRef: true,
          variants: { orderBy: { sortOrder: "asc" } },
        },
      }),
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
    return { product, categories, brands };
  } catch {
    return { product: null, categories: [], brands: [] };
  }
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const { product, categories, brands } = await getData(id);
  if (!product) notFound();

  const initial = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    productType: product.productType,
    categoryId: product.categoryId,
    brandId: product.brandId ?? "",
    brandName: product.brand ?? "",
    price: product.price != null ? String(product.price) : "",
    shortDescription: product.shortDescription ?? "",
    description: product.description,
    imagesText: product.images.join("\n"),
    featuresText: product.features.join("\n"),
    keywordsText: product.keywords.join(", "),
    duration: product.duration ?? "",
    sku: product.sku ?? "",
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    sortOrder: String(product.sortOrder),
  };

  return (
    <div>
      <AdminPageHeader section="Offre" title={`Modifier — ${product.name}`} description="Fiche produit et variantes" />
      <CatalogueSubNav active="products" />
      <ProductForm
        mode="edit"
        initial={initial}
        initialVariants={variantsToFormRows(product.variants)}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
