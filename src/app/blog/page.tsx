import { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { IMAGES } from "@/lib/images";
import { ProductImage } from "@/components/ui/ProductImage";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";

export const metadata: Metadata = {
  title: "Blog",
  description: "Conseils et expertise en image professionnelle, colorimétrie et style.",
};

async function getPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const [posts, page] = await Promise.all([getPosts(), getPublicPagesSettings()]);
  const content = page.blog;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-overline mb-4">{content.overline}</p>
          <h1 className="heading-display mb-6">{content.title}</h1>
          <p className="text-brand-600">{content.intro}</p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-brand-500">{content.emptyMessage}</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group card-premium overflow-hidden">
                {post.coverImage && (
                  <div className="relative aspect-[16/10] bg-brand-100">
                    <ProductImage
                      src={post.coverImage}
                      fallback={IMAGES.blogCover}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className="p-6">
                  <p className="text-xs text-brand-400 mb-2">
                    {post.publishedAt ? formatDate(post.publishedAt) : ""}
                  </p>
                  <h2 className="font-display text-xl mb-2 group-hover:text-accent transition-colors">{post.title}</h2>
                  <p className="text-sm text-brand-500 line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
