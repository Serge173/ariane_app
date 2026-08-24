import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { slugify } from "@/lib/utils";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  const body = await req.json();

  const existing = await prisma.brand.findUnique({ where: { id } });
  if (!existing) return jsonError("Marque introuvable", 404);

  if (body.slug || body.name) {
    const conflict = await prisma.brand.findFirst({
      where: {
        NOT: { id },
        OR: [
          ...(body.slug ? [{ slug: slugify(body.slug) }] : []),
          ...(body.name ? [{ name: body.name.trim() }] : []),
        ],
      },
    });
    if (conflict) return jsonError("Cette marque existe déjà", 409);
  }

  const brand = await prisma.brand.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.slug !== undefined && { slug: slugify(body.slug) }),
      ...(body.description !== undefined && { description: body.description?.trim() || null }),
      ...(body.logo !== undefined && { logo: body.logo?.trim() || null }),
      ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) || 0 }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
    },
    include: { _count: { select: { products: true } } },
  });

  if (body.name) {
    await prisma.product.updateMany({
      where: { brandId: id },
      data: { brand: body.name.trim() },
    });
  }

  return NextResponse.json(brand);
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  const count = await prisma.product.count({ where: { brandId: id } });
  if (count > 0) {
    await prisma.brand.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ archived: true });
  }

  await prisma.brand.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
