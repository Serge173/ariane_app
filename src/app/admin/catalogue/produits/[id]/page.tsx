import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { CatalogueSubNav } from "@/components/admin/catalogue/CatalogueSubNav";
import { ProductForm } from "@/components/admin/catalogue/ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

async function getData(id: string) {
  try {
    const [product, categories, brands] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        include: { category: true, brandRef: true },
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
    price: String(product.price),
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
      <CatalogueSubNav active="products" />
      <h1 className="heading-section mb-8">Modifier — {product.name}</h1>
      <ProductForm mode="edit" initial={initial} categories={categories} brands={brands} />
    </div>
  );
}
