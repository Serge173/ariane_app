import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { slugify } from "@/lib/utils";
import { parseTagsInput } from "@/lib/blog";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const sp = req.nextUrl.searchParams;
  const q = sp.get("q") ?? undefined;
  const status = sp.get("status");

  const where: Prisma.BlogPostWhereInput = {};
  if (status === "published") where.isPublished = true;
  if (status === "draft") where.isPublished = false;

  if (q) {
    const terms = q.trim().split(/\s+/).filter(Boolean);
    where.AND = terms.map((term) => ({
      OR: [
        { title: { contains: term, mode: "insensitive" as const } },
        { excerpt: { contains: term, mode: "insensitive" as const } },
        { content: { contains: term, mode: "insensitive" as const } },
        { tags: { has: term.toLowerCase() } },
      ],
    }));
  }

  try {
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(posts);
  } catch (err) {
    console.error("[GET /api/admin/blog]", err);
    return jsonError("Impossible de charger les articles", 500);
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const {
    title,
    slug: rawSlug,
    excerpt,
    content,
    coverImage,
    author = "Ariane DAGO",
    tagsText = "",
    isPublished = false,
    publishedAt,
  } = body;

  if (!title?.trim()) return jsonError("Le titre est requis");
  if (!content?.trim()) return jsonError("Le contenu est requis");

  const slug = slugify(rawSlug || title);
  const exists = await prisma.blogPost.findUnique({ where: { slug } });
  if (exists) return jsonError("Ce slug existe déjà", 409);

  const tags = parseTagsInput(tagsText);
  const publish = Boolean(isPublished);

  const post = await prisma.blogPost.create({
    data: {
      title: title.trim(),
      slug,
      excerpt: excerpt?.trim() || null,
      content: content.trim(),
      coverImage: coverImage?.trim() || null,
      author: author?.trim() || "Ariane DAGO",
      tags,
      isPublished: publish,
      publishedAt: publish ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
