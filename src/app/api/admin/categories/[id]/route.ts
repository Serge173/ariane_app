import { NextRequest, NextResponse } from "next/server";
import { ProductType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { slugify } from "@/lib/utils";
import { getCategoryDescendantIds } from "@/lib/categories";

async function validateParentAssignment(
  categoryId: string | null,
  parentId: string | null
): Promise<string | null> {
  if (!parentId) return null;
  if (categoryId && parentId === categoryId) {
    return "Une catégorie ne peut pas être sa propre parente";
  }

  const parent = await prisma.category.findUnique({
    where: { id: parentId },
    select: { id: true, parentId: true, scope: true },
  });
  if (!parent) return "Catégorie parente introuvable";
  if (parent.parentId) {
    return "Seules les catégories principales peuvent avoir des sous-catégories (2 niveaux max)";
  }

  if (categoryId) {
    const all = await prisma.category.findMany({
      select: { id: true, parentId: true },
    });
    const blocked = getCategoryDescendantIds(categoryId, all);
    if (blocked.has(parentId)) {
      return "Parent invalide (boucle hiérachique)";
    }

    const current = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { scope: true },
    });
    if (current && current.scope !== parent.scope) {
      return "La catégorie parente doit appartenir au même catalogue (boutique ou accompagnements)";
    }
  }

  return null;
}

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  const body = await req.json();

  if (body.slug) {
    const conflict = await prisma.category.findFirst({
      where: { slug: slugify(body.slug), NOT: { id } },
    });
    if (conflict) return jsonError("Ce slug existe déjà", 409);
  }

  const existing = await prisma.category.findUnique({
    where: { id },
    select: { parentId: true, scope: true },
  });
  if (!existing) return jsonError("Catégorie introuvable", 404);

  const nextParentId =
    body.parentId !== undefined ? body.parentId || null : existing.parentId;

  if (body.parentId !== undefined) {
    const parentError = await validateParentAssignment(id, nextParentId);
    if (parentError) return jsonError(parentError);
  }

  let nextScope: ProductType = existing.scope;
  if (nextParentId) {
    const parent = await prisma.category.findUnique({
      where: { id: nextParentId },
      select: { scope: true },
    });
    if (parent) nextScope = parent.scope;
  } else if (body.scope && ["LUXE", "SERVICE"].includes(body.scope)) {
    const childCount = await prisma.category.count({ where: { parentId: id } });
    if (childCount > 0) {
      return jsonError("Impossible de changer le catalogue d'une catégorie qui a des sous-catégories");
    }
    nextScope = body.scope as ProductType;
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.slug !== undefined && { slug: slugify(body.slug) }),
      ...(body.description !== undefined && { description: body.description?.trim() || null }),
      ...(body.parentId !== undefined && { parentId: nextParentId }),
      scope: nextScope,
      ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) || 0 }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
    },
    include: { _count: { select: { products: true } }, parent: true },
  });

  return NextResponse.json(category);
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  const childCount = await prisma.category.count({ where: { parentId: id } });
  if (childCount > 0) {
    return jsonError("Supprimez ou déplacez d'abord les sous-catégories", 400);
  }

  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    await prisma.category.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ archived: true, message: "Catégorie désactivée (produits liés)" });
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
