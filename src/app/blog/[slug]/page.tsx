import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { IMAGES } from "@/lib/images";
import { renderBlogContent } from "@/lib/blog";
import { ProductImage } from "@/components/ui/ProductImage";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  try {
    return await prisma.blogPost.findFirst({
      where: { slug, isPublished: true },
    });
  } catch {
    return null;
  }
}

async function getRelatedPosts(excludeId: string, tags: string[]) {
  if (tags.length === 0) return [];
  try {
    return await prisma.blogPost.findMany({
      where: {
        isPublished: true,
        NOT: { id: excludeId },
        tags: { hasSome: tags },
      },
      take: 3,
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article introuvable" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const paragraphs = renderBlogContent(post.content);
  const related = await getRelatedPosts(post.id, post.tags);

  return (
    <article className="min-h-screen pt-24 pb-20">
      <div className="container-premium max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-500 hover:text-brand-950 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au blog
        </Link>

        <header className="mb-10">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-wider px-3 py-1 bg-brand-100 text-brand-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p className="text-overline mb-3">Blog</p>
          <h1 className="heading-display mb-6">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-brand-500">
            <span>{post.author}</span>
            {post.publishedAt && (
              <>
                <span className="text-brand-300">·</span>
                <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
              </>
            )}
          </div>
          {post.excerpt && (
            <p className="mt-6 text-lg text-brand-600 leading-relaxed border-l-2 border-accent pl-6">
              {post.excerpt}
            </p>
          )}
        </header>

        {post.coverImage && (
          <div className="relative aspect-[16/9] bg-brand-100 mb-12 overflow-hidden">
            <ProductImage
              src={post.coverImage}
              fallback={IMAGES.blogCover}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        <div className="prose-blog space-y-6 text-brand-700 leading-relaxed">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <footer className="mt-16 pt-10 border-t border-brand-100">
          <p className="text-overline mb-2">Conseil en Image avec Ariane</p>
          <p className="text-brand-600 mb-6">
            Envie d&apos;aller plus loin ? Découvrez nos accompagnements personnalisés.
          </p>
          <Link href="/offres" className="btn-primary inline-flex items-center gap-2 text-xs">
            Voir nos offres
            <ArrowRight className="w-4 h-4" />
          </Link>
        </footer>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl mb-8">Articles similaires</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/blog/${item.slug}`}
                  className="group card-premium p-5 block"
                >
                  <p className="text-xs text-brand-400 mb-2">
                    {item.publishedAt ? formatDate(item.publishedAt) : ""}
                  </p>
                  <h3 className="font-display text-lg group-hover:text-accent transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
