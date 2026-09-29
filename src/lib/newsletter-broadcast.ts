import prisma from "@/lib/prisma";
import { sendNewsletterSocialBroadcast } from "@/lib/email";
import { newsletterUnsubscribeUrl } from "@/lib/newsletter";

export async function sendSocialNewsletterBroadcast(input: {
  title: string;
  intro?: string | null;
  youtubeUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
  instagramUrl?: string | null;
}) {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  if (subscribers.length === 0) {
    return { sent: 0, failed: 0, recipientCount: 0 };
  }

  let sent = 0;
  let failed = 0;

  for (const sub of subscribers) {
    const ok = await sendNewsletterSocialBroadcast({
      email: sub.email,
      firstName: sub.firstName,
      title: input.title,
      intro: input.intro,
      youtubeUrl: input.youtubeUrl,
      facebookUrl: input.facebookUrl,
      tiktokUrl: input.tiktokUrl,
      instagramUrl: input.instagramUrl,
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
    input.youtubeUrl ? "YouTube" : null,
    input.facebookUrl ? "Facebook" : null,
    input.tiktokUrl ? "TikTok" : null,
    input.instagramUrl ? "Instagram" : null,
  ]
    .filter(Boolean)
    .join(", ");

  for (const user of users) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "IN_APP",
        title: input.title,
        message:
          input.intro?.trim() ||
          (linkSummary ? `Nouveau contenu : ${linkSummary}` : "Nouvelle publication sur nos réseaux."),
        metadata: {
          youtubeUrl: input.youtubeUrl ?? null,
          facebookUrl: input.facebookUrl ?? null,
          tiktokUrl: input.tiktokUrl ?? null,
          instagramUrl: input.instagramUrl ?? null,
        },
      },
    });
  }

  await prisma.newsletterBroadcast.create({
    data: {
      title: input.title,
      intro: input.intro ?? null,
      youtubeUrl: input.youtubeUrl ?? null,
      facebookUrl: input.facebookUrl ?? null,
      tiktokUrl: input.tiktokUrl ?? null,
      instagramUrl: input.instagramUrl ?? null,
      recipientCount: sent,
    },
  });

  return { sent, failed, recipientCount: subscribers.length };
}
