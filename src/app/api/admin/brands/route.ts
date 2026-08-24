import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { slugify } from "@/lib/utils";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(brands);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const { name, slug: rawSlug, description, logo, sortOrder = 0, isActive = true } = body;

  if (!name?.trim()) return jsonError("Le nom est requis");

  const slug = slugify(rawSlug || name);
  const exists = await prisma.brand.findFirst({
    where: { OR: [{ slug }, { name: name.trim() }] },
  });
  if (exists) return jsonError("Cette marque existe déjà", 409);

  const brand = await prisma.brand.create({
    data: {
      name: name.trim(),
      slug,
      description: description?.trim() || null,
      logo: logo?.trim() || null,
      sortOrder: Number(sortOrder) || 0,
      isActive,
    },
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json(brand, { status: 201 });
}
