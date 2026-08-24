import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { slugify } from "@/lib/utils";
import { buildKeywordsFromProduct, parseKeywordsInput, parseLinesInput } from "@/lib/catalogue";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: { include: { parent: true } }, brandRef: true },
  });
  if (!product) return jsonError("Produit introuvable", 404);
  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return jsonError("Produit introuvable", 404);

  const body = await req.json();

  if (body.slug && body.slug !== existing.slug) {
    const conflict = await prisma.product.findUnique({ where: { slug: slugify(body.slug) } });
    if (conflict) return jsonError("Ce slug existe déjà", 409);
  }

  let brand = existing.brand;
  let brandId = existing.brandId;

  if (body.brandId !== undefined) {
    if (body.brandId) {
      const b = await prisma.brand.findUnique({ where: { id: body.brandId } });
      if (b) {
        brandId = b.id;
        brand = b.name;
      }
    } else {
      brandId = null;
      brand = body.brandName?.trim() || null;
    }
  } else if (body.brandName !== undefined) {
    brand = body.brandName?.trim() || null;
  }

  const categoryId = body.categoryId ?? existing.categoryId;
  const productType = body.productType ?? existing.productType;
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (category && category.scope !== productType) {
    return jsonError(
      productType === "LUXE"
        ? "Cette catégorie appartient aux accompagnements. Choisissez une catégorie boutique."
        : "Cette catégorie appartient à la boutique. Choisissez une catégorie accompagnements."
    );
  }
  const name = body.name?.trim() ?? existing.name;
  const features =
    body.featuresText !== undefined ? parseLinesInput(body.featuresText) : existing.features;
  const manualKeywords =
    body.keywordsText !== undefined
      ? parseKeywordsInput(body.keywordsText)
      : existing.keywords;
  const autoKeywords = buildKeywordsFromProduct({
    name,
    brand,
    categoryName: category?.name,
    features,
  });
  const keywords = [...new Set([...autoKeywords, ...manualKeywords])];

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.slug !== undefined && { slug: slugify(body.slug) }),
      ...(body.productType !== undefined && { productType: body.productType }),
      ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
      brandId,
      brand,
      ...(body.price !== undefined && { price: Number(body.price) }),
      ...(body.shortDescription !== undefined && {
        shortDescription: body.shortDescription?.trim() || null,
      }),
      ...(body.description !== undefined && { description: body.description.trim() }),
      ...(body.imagesText !== undefined && { images: parseLinesInput(body.imagesText) }),
      features,
      keywords,
      ...(body.duration !== undefined && { duration: body.duration?.trim() || null }),
      ...(body.sku !== undefined && { sku: body.sku?.trim() || null }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
      ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
      ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) || 0 }),
    },
    include: { category: { include: { parent: true } }, brandRef: true },
  });

  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  const orderCount = await prisma.orderItem.count({ where: { productId: id } });
  if (orderCount > 0) {
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ archived: true });
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
