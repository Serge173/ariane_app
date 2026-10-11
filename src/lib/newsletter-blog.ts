import { getPlatformSettings } from "@/lib/platform-settings";
import { getNewsletterSettings } from "@/lib/newsletter-settings";
import { parsePublicationLinks } from "@/lib/blog-publication-links";
import {
  publicationInputHasContent,
  sendPublicationNewsletterBroadcast,
} from "@/lib/newsletter-broadcast";

export async function maybeSendNewsletterForBlogPost(post: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  isPublished: boolean;
  publicationLinks?: unknown;
}) {
  if (!post.isPublished) return null;

  const settings = await getNewsletterSettings();
  if (!settings.autoSendOnBlogPublish) return null;

  const platform = await getPlatformSettings();
  const siteUrl = `${platform.appUrl.replace(/\/$/, "")}/blog/${post.slug}`;
  const publicationBody = [post.excerpt?.trim(), post.content.trim()].filter(Boolean).join("\n\n");

  const links = parsePublicationLinks(post.publicationLinks);

  const input = {
    title: post.title,
    intro: "Nouvel article publié sur notre site :",
    publicationBody,
    siteUrl,
    facebookUrl: links.facebookUrl ?? null,
    youtubeUrl: links.youtubeUrl ?? null,
    tiktokUrl: links.tiktokUrl ?? null,
    instagramUrl: links.instagramUrl ?? null,
    whatsappUrl: links.whatsappUrl ?? null,
    twitterUrl: links.twitterUrl ?? null,
    source: "blog" as const,
    blogPostId: post.id,
  };

  if (!publicationInputHasContent(input)) return null;

  return sendPublicationNewsletterBroadcast(input);
}
