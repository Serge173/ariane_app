import { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { IMAGES } from "@/lib/images";
import { ProductImage } from "@/components/ui/ProductImage";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";
import { PublicPageIntro, PublicPageShell } from "@/components/layout/PublicPageShell";

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
    <PublicPageShell width="wide">
        <PublicPageIntro
          overline={content.overline}
          title={content.title}
          description={content.intro}
        />

        {posts.length === 0 ? (
          <p className="text-center text-brand-500 public-card p-10">{content.emptyMessage}</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group public-card overflow-hidden transition-shadow hover:shadow-[0_12px_40px_-18px_rgba(40,36,31,0.22)]">
                {post.coverImage && (
                  <div className="relative aspect-[16/10] bg-brand-300/25">
                    <ProductImage
                      src={post.coverImage}
                      fallback={IMAGES.blogCover}
                      alt={post.title}
                      fill
                      className="group-hover:scale-105 transition-transform duration-700"
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
    </PublicPageShell>
  );
}
