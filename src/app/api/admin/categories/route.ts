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
      return "Parent invalide (boucle hiérarchique)";
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

async function resolveScope(
  parentId: string | null,
  requestedScope?: ProductType
): Promise<ProductType | string> {
  if (parentId) {
    const parent = await prisma.category.findUnique({
      where: { id: parentId },
      select: { scope: true },
    });
    if (!parent) return "Catégorie parente introuvable";
    return parent.scope;
  }
  if (!requestedScope || !["LUXE", "SERVICE"].includes(requestedScope)) {
    return "Indiquez le catalogue : boutique luxe ou accompagnements";
  }
  return requestedScope;
}

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const scope = req.nextUrl.searchParams.get("scope") as ProductType | null;

  const categories = await prisma.category.findMany({
    where: scope && ["LUXE", "SERVICE"].includes(scope) ? { scope } : undefined,
    include: { _count: { select: { products: true } }, parent: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const {
    name,
    slug: rawSlug,
    description,
    parentId,
    sortOrder = 0,
    isActive = true,
    scope: requestedScope,
  } = body;

  if (!name?.trim()) return jsonError("Le nom est requis");

  const slug = slugify(rawSlug || name);
  const exists = await prisma.category.findUnique({ where: { slug } });
  if (exists) return jsonError("Ce slug existe déjà", 409);

  const parentError = await validateParentAssignment(null, parentId || null);
  if (parentError) return jsonError(parentError);

  const scopeResult = await resolveScope(parentId || null, requestedScope);
  if (typeof scopeResult === "string") return jsonError(scopeResult);

  const category = await prisma.category.create({
    data: {
      name: name.trim(),
      slug,
      description: description?.trim() || null,
      parentId: parentId || null,
      scope: scopeResult,
      sortOrder: Number(sortOrder) || 0,
      isActive,
    },
    include: { _count: { select: { products: true } }, parent: true },
  });

  return NextResponse.json(category, { status: 201 });
}
