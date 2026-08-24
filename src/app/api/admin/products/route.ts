import { NextRequest, NextResponse } from "next/server";
import { Prisma, ProductType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { slugify } from "@/lib/utils";
import { buildKeywordsFromProduct, parseKeywordsInput, parseLinesInput } from "@/lib/catalogue";
import { getCategoryDescendantIds } from "@/lib/categories";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const sp = req.nextUrl.searchParams;
  const q = sp.get("q") ?? undefined;
  const type = (sp.get("type") as ProductType | "all") ?? "all";
  const categoryId = sp.get("categoryId") ?? undefined;
  const brandId = sp.get("brandId") ?? undefined;
  const active = sp.get("active");

  const where: Prisma.ProductWhereInput = {};

  if (type !== "all") where.productType = type;
  if (categoryId) {
    const allCats = await prisma.category.findMany({
      select: { id: true, parentId: true },
    });
    const ids = getCategoryDescendantIds(categoryId, allCats);
    where.categoryId = { in: [...ids] };
  }
  if (brandId) where.brandId = brandId;
  if (active === "true") where.isActive = true;
  if (active === "false") where.isActive = false;

  if (q) {
    const terms = q.trim().split(/\s+/).filter(Boolean);
    where.AND = terms.map((term) => ({
      OR: [
        { name: { contains: term, mode: "insensitive" as const } },
        { brand: { contains: term, mode: "insensitive" as const } },
        { sku: { contains: term, mode: "insensitive" as const } },
        { keywords: { has: term.toLowerCase() } },
      ],
    }));
  }

  try {
    const products = await prisma.product.findMany({
      where,
      include: { category: { include: { parent: true } }, brandRef: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(products);
  } catch (err) {
    console.error("[GET /api/admin/products]", err);
    return jsonError(
      "Impossible de charger les produits. Redémarrez le serveur après prisma generate.",
      500
    );
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const {
    name,
    slug: rawSlug,
    productType = "LUXE",
    categoryId,
    brandId,
    brandName,
    price,
    shortDescription,
    description,
    imagesText = "",
    featuresText = "",
    keywordsText = "",
    duration,
    sku,
    isActive = true,
    isFeatured = false,
    sortOrder = 0,
  } = body;

  if (!name?.trim()) return jsonError("Le nom est requis");
  if (!categoryId) return jsonError("La catégorie est requise");
  if (!description?.trim()) return jsonError("La description est requise");
  if (price == null || Number.isNaN(Number(price))) return jsonError("Prix invalide");

  const slug = slugify(rawSlug || name);
  const exists = await prisma.product.findUnique({ where: { slug } });
  if (exists) return jsonError("Ce slug existe déjà", 409);

  let brand: string | null = brandName?.trim() || null;
  let resolvedBrandId: string | null = brandId || null;

  if (brandId) {
    const b = await prisma.brand.findUnique({ where: { id: brandId } });
    if (b) {
      brand = b.name;
      resolvedBrandId = b.id;
    }
  }

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) return jsonError("Catégorie introuvable");
  if (category.scope !== productType) {
    return jsonError(
      productType === "LUXE"
        ? "Cette catégorie appartient aux accompagnements. Choisissez une catégorie boutique."
        : "Cette catégorie appartient à la boutique. Choisissez une catégorie accompagnements."
    );
  }
  const features = parseLinesInput(featuresText);
  const manualKeywords = parseKeywordsInput(keywordsText);
  const autoKeywords = buildKeywordsFromProduct({
    name,
    brand,
    categoryName: category?.name,
    features,
  });
  const keywords = [...new Set([...autoKeywords, ...manualKeywords])];

  const product = await prisma.product.create({
    data: {
      name: name.trim(),
      slug,
      productType,
      categoryId,
      brandId: resolvedBrandId,
      brand,
      price: Number(price),
      shortDescription: shortDescription?.trim() || null,
      description: description.trim(),
      images: parseLinesInput(imagesText),
      features,
      keywords,
      duration: duration?.trim() || null,
      sku: sku?.trim() || null,
      isActive,
      isFeatured,
      sortOrder: Number(sortOrder) || 0,
    },
    include: { category: { include: { parent: true } }, brandRef: true },
  });

  return NextResponse.json(product, { status: 201 });
}
