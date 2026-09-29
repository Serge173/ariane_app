import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import { resolveAppUrl } from "@/lib/app-url";

export const NEWSLETTER_SEGMENT_SOCIAL = "social";
export const NEWSLETTER_SEGMENT_BLOG = "blog";
export const NEWSLETTER_SEGMENT_OFFERS = "offers";

export function normalizeNewsletterEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function createNewsletterToken(): string {
  return randomBytes(32).toString("hex");
}

export function newsletterConfirmUrl(token: string): string {
  return `${resolveAppUrl()}/newsletter/confirmer?token=${encodeURIComponent(token)}`;
}

export function newsletterUnsubscribeUrl(token: string): string {
  return `${resolveAppUrl()}/newsletter/desinscription?token=${encodeURIComponent(token)}`;
}

/** Inscription directe (sans email de confirmation) — abonné actif immédiatement. */
export async function upsertNewsletterSubscriber(data: {
  email: string;
  firstName?: string | null;
  source: string;
  segments?: string[];
}) {
  const email = normalizeNewsletterEmail(data.email);
  const segments = Array.from(
    new Set([...(data.segments ?? []), NEWSLETTER_SEGMENT_SOCIAL])
  );
  const now = new Date();

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

  if (existing?.isActive) {
    return { subscriber: existing, alreadyActive: true as const };
  }

  const subscriber = await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: {
      email,
      firstName: data.firstName?.trim() || null,
      segments,
      isActive: true,
      confirmToken: null,
      confirmedAt: now,
      unsubscribeToken: createNewsletterToken(),
      source: data.source,
      consentAt: now,
    },
    update: {
      firstName: data.firstName?.trim() || existing?.firstName || null,
      segments,
      isActive: true,
      confirmToken: null,
      confirmedAt: existing?.confirmedAt ?? now,
      source: data.source,
      consentAt: now,
    },
  });

  return { subscriber, alreadyActive: false as const };
}

export async function confirmNewsletterByToken(token: string) {
  const subscriber = await prisma.newsletterSubscriber.findFirst({
    where: { confirmToken: token },
  });
  if (!subscriber) return null;

  return prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: {
      isActive: true,
      confirmToken: null,
      confirmedAt: new Date(),
    },
  });
}

export async function unsubscribeNewsletterByToken(token: string) {
  const subscriber = await prisma.newsletterSubscriber.findFirst({
    where: { unsubscribeToken: token },
  });
  if (!subscriber) return null;

  return prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: {
      isActive: false,
      confirmToken: null,
      confirmedAt: null,
    },
  });
}
