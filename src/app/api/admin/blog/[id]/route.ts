import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { slugify } from "@/lib/utils";
import { parseTagsInput } from "@/lib/blog";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return jsonError("Article introuvable", 404);
  return NextResponse.json(post);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return jsonError("Article introuvable", 404);

  const body = await req.json();

  if (body.slug && body.slug !== existing.slug) {
    const conflict = await prisma.blogPost.findUnique({ where: { slug: slugify(body.slug) } });
    if (conflict) return jsonError("Ce slug existe déjà", 409);
  }

  let publishedAt = existing.publishedAt;
  if (body.isPublished !== undefined) {
    if (body.isPublished && !existing.isPublished) {
      publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date();
    }
    if (!body.isPublished) publishedAt = null;
  } else if (body.publishedAt !== undefined) {
    publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title.trim() }),
      ...(body.slug !== undefined && { slug: slugify(body.slug) }),
      ...(body.excerpt !== undefined && { excerpt: body.excerpt?.trim() || null }),
      ...(body.content !== undefined && { content: body.content.trim() }),
      ...(body.coverImage !== undefined && { coverImage: body.coverImage?.trim() || null }),
      ...(body.author !== undefined && { author: body.author?.trim() || "Ariane DAGO" }),
      ...(body.tagsText !== undefined && { tags: parseTagsInput(body.tagsText) }),
      ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
      publishedAt,
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
