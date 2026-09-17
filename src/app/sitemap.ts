import type { MetadataRoute } from "next";
import { resolveAppUrl } from "@/lib/app-url";
import prisma from "@/lib/prisma";

const STATIC_PATHS = [
  "",
  "/offres",
  "/boutique",
  "/contact",
  "/orientation",
  "/a-propos",
  "/faq",
  "/blog",
  "/reservation",
  "/cgv",
  "/mentions-legales",
  "/confidentialite",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = resolveAppUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  try {
    const [products, posts] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, productType: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${base}/${product.productType === "SERVICE" ? "offres" : "boutique"}/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [...staticEntries, ...productEntries, ...blogEntries];
  } catch {
    return staticEntries;
  }
}
