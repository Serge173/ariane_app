import prisma from "@/lib/prisma";
import { sendNewsletterPublicationEmail } from "@/lib/email";
import { newsletterUnsubscribeUrl } from "@/lib/newsletter";
import {
  buildLinksListHtml,
  buildPublicationBlockHtml,
  type PublicationLinkKey,
} from "@/lib/newsletter-template";

export type PublicationBroadcastInput = {
  title: string;
  intro?: string | null;
  publicationBody?: string | null;
  youtubeUrl?: string | null;
  facebookUrl?: string | null;
  whatsappUrl?: string | null;
  twitterUrl?: string | null;
  tiktokUrl?: string | null;
  instagramUrl?: string | null;
  siteUrl?: string | null;
  source?: "manual" | "blog" | "webhook";
  blogPostId?: string | null;
  /** Si false, enregistre sans envoyer (prévisualisation future) */
  sendEmails?: boolean;
};

function hasAnyLink(input: PublicationBroadcastInput): boolean {
  return Boolean(
    input.youtubeUrl?.trim() ||
      input.facebookUrl?.trim() ||
      input.whatsappUrl?.trim() ||
      input.twitterUrl?.trim() ||
      input.tiktokUrl?.trim() ||
      input.instagramUrl?.trim() ||
      input.siteUrl?.trim()
  );
}

export function publicationInputHasContent(input: PublicationBroadcastInput): boolean {
  return Boolean(
    input.intro?.trim() ||
      input.publicationBody?.trim() ||
      hasAnyLink(input)
  );
}

export async function sendPublicationNewsletterBroadcast(input: PublicationBroadcastInput) {
  if (input.blogPostId) {
    const already = await prisma.newsletterBroadcast.findUnique({
      where: { blogPostId: input.blogPostId },
    });
    if (already) {
      return { sent: 0, failed: 0, recipientCount: 0, skipped: true as const };
    }
  }

  const sendEmails = input.sendEmails !== false;

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  if (subscribers.length === 0 || !sendEmails) {
    if (sendEmails) {
      await prisma.newsletterBroadcast.create({
        data: broadcastRecordData(input, 0),
      });
    }
    return { sent: 0, failed: 0, recipientCount: subscribers.length, skipped: false as const };
  }

  const links: Partial<Record<PublicationLinkKey, string | null>> = {
    facebook: input.facebookUrl,
    whatsapp: input.whatsappUrl,
    twitter: input.twitterUrl,
    tiktok: input.tiktokUrl,
    instagram: input.instagramUrl,
    youtube: input.youtubeUrl,
    site: input.siteUrl,
  };

  let sent = 0;
  let failed = 0;

  for (const sub of subscribers) {
    const ok = await sendNewsletterPublicationEmail({
      email: sub.email,
      firstName: sub.firstName,
      title: input.title,
      intro: input.intro,
      publicationBody: input.publicationBody,
      links,
      unsubscribeUrl: newsletterUnsubscribeUrl(sub.unsubscribeToken),
    });
    if (ok) sent += 1;
    else failed += 1;
  }

  const emails = subscribers.map((s) => s.email.toLowerCase());
  const users = await prisma.user.findMany({
    where: {
      email: { in: emails, mode: "insensitive" },
    },
    select: { id: true, email: true },
  });

  const linkSummary = [
    input.siteUrl ? "Site" : null,
    input.facebookUrl ? "Facebook" : null,
    input.whatsappUrl ? "WhatsApp" : null,
    input.twitterUrl ? "X" : null,
    input.tiktokUrl ? "TikTok" : null,
    input.instagramUrl ? "Instagram" : null,
    input.youtubeUrl ? "YouTube" : null,
  ]
    .filter(Boolean)
    .join(", ");

  const inAppMessage =
    input.intro?.trim() ||
    input.publicationBody?.trim()?.slice(0, 280) ||
    (linkSummary ? `Nouvelle publication : ${linkSummary}` : "Nouvelle publication sur nos réseaux.");

  for (const user of users) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "IN_APP",
        title: input.title,
        message: inAppMessage,
        metadata: {
          siteUrl: input.siteUrl ?? null,
          youtubeUrl: input.youtubeUrl ?? null,
          facebookUrl: input.facebookUrl ?? null,
          whatsappUrl: input.whatsappUrl ?? null,
          twitterUrl: input.twitterUrl ?? null,
          tiktokUrl: input.tiktokUrl ?? null,
          instagramUrl: input.instagramUrl ?? null,
        },
      },
    });
  }

  await prisma.newsletterBroadcast.create({
    data: broadcastRecordData(input, sent),
  });

  return { sent, failed, recipientCount: subscribers.length, skipped: false as const };
}

function broadcastRecordData(input: PublicationBroadcastInput, recipientCount: number) {
  return {
    title: input.title,
    intro: input.intro ?? null,
    publicationBody: input.publicationBody ?? null,
    youtubeUrl: input.youtubeUrl ?? null,
    facebookUrl: input.facebookUrl ?? null,
    whatsappUrl: input.whatsappUrl ?? null,
    twitterUrl: input.twitterUrl ?? null,
    tiktokUrl: input.tiktokUrl ?? null,
    instagramUrl: input.instagramUrl ?? null,
    siteUrl: input.siteUrl ?? null,
    source: input.source ?? "manual",
    blogPostId: input.blogPostId ?? null,
    recipientCount,
  };
}

/** @deprecated alias */
export const sendSocialNewsletterBroadcast = sendPublicationNewsletterBroadcast;
