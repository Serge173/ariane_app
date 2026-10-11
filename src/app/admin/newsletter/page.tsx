import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { NewsletterAdminPanel } from "@/components/admin/newsletter/NewsletterAdminPanel";

export default async function AdminNewsletterPage() {
  let subscribers: Awaited<ReturnType<typeof loadSubscribers>> = [];
  let broadcasts: Awaited<ReturnType<typeof loadBroadcasts>> = [];

  try {
    [subscribers, broadcasts] = await Promise.all([loadSubscribers(), loadBroadcasts()]);
  } catch {
    /* table may be missing until db push */
  }

  return (
    <div>
      <PageHeader
        title="Newsletter"
        description="Abonnés, modèle d'email, envoi auto (blog + webhook réseaux) et notifications"
      />
      <NewsletterAdminPanel
        subscribers={subscribers.map((s) => ({
          ...s,
          createdAt: s.createdAt.toISOString(),
          confirmedAt: s.confirmedAt?.toISOString() ?? null,
        }))}
        broadcasts={broadcasts.map((b) => ({
          ...b,
          sentAt: b.sentAt.toISOString(),
        }))}
      />
    </div>
  );
}

async function loadSubscribers() {
  return prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });
}

async function loadBroadcasts() {
  return prisma.newsletterBroadcast.findMany({
    orderBy: { sentAt: "desc" },
    take: 20,
    select: {
      id: true,
      title: true,
      recipientCount: true,
      sentAt: true,
      source: true,
    },
  });
}
