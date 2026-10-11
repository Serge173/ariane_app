import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { randomBytes } from "crypto";

export const NEWSLETTER_SETTINGS_KEY = "newsletter_settings";

export interface NewsletterSettings {
  /** Envoi auto quand un article blog est publié sur le site */
  autoSendOnBlogPublish: boolean;
  /** Envoi auto quand un outil externe appelle le webhook (Make, Zapier, etc.) */
  autoSendOnSocialWebhook: boolean;
  /** Objet de l'email — variables : {{title}} */
  emailSubjectTemplate: string;
  /**
   * Corps HTML de l'email — variables :
   * {{firstName}}, {{title}}, {{message}}, {{publicationContent}},
   * {{facebookUrl}}, {{whatsappUrl}}, {{twitterUrl}}, {{tiktokUrl}}, {{instagramUrl}}, {{youtubeUrl}}, {{siteUrl}},
   * {{linksList}}, {{unsubscribeUrl}}
   */
  emailBodyTemplate: string;
  /** Secret pour sécuriser POST /api/webhooks/newsletter-publication */
  webhookSecret: string;
}

export const DEFAULT_NEWSLETTER_BODY_TEMPLATE = `<p>{{greeting}}</p>
<p>{{message}}</p>
{{publicationBlock}}
{{linksBlock}}
<p style="margin-top:20px"><a href="{{siteUrl}}">Voir sur notre site</a></p>
<p style="margin-top:28px;font-size:12px;color:#666"><a href="{{unsubscribeUrl}}">Se désabonner</a></p>`;

export const DEFAULT_NEWSLETTER_SUBJECT_TEMPLATE = "{{title}}";

function defaultSettings(): NewsletterSettings {
  return {
    autoSendOnBlogPublish: true,
    autoSendOnSocialWebhook: true,
    emailSubjectTemplate: DEFAULT_NEWSLETTER_SUBJECT_TEMPLATE,
    emailBodyTemplate: DEFAULT_NEWSLETTER_BODY_TEMPLATE,
    webhookSecret: randomBytes(24).toString("hex"),
  };
}

export async function getNewsletterSettings(): Promise<NewsletterSettings> {
  const base = defaultSettings();
  try {
    const row = await prisma.siteContent.findUnique({
      where: { key: NEWSLETTER_SETTINGS_KEY },
    });
    if (!row?.value || typeof row.value !== "object") return base;
    const patch = row.value as Partial<NewsletterSettings>;
    return {
      ...base,
      ...patch,
      emailSubjectTemplate:
        patch.emailSubjectTemplate?.trim() || base.emailSubjectTemplate,
      emailBodyTemplate: patch.emailBodyTemplate?.trim() || base.emailBodyTemplate,
      webhookSecret: patch.webhookSecret?.trim() || base.webhookSecret,
    };
  } catch {
    return base;
  }
}

export async function updateNewsletterSettings(
  patch: Partial<NewsletterSettings>
): Promise<NewsletterSettings> {
  const current = await getNewsletterSettings();
  const merged: NewsletterSettings = { ...current };

  if (patch.autoSendOnBlogPublish !== undefined) {
    merged.autoSendOnBlogPublish = Boolean(patch.autoSendOnBlogPublish);
  }
  if (patch.autoSendOnSocialWebhook !== undefined) {
    merged.autoSendOnSocialWebhook = Boolean(patch.autoSendOnSocialWebhook);
  }
  if (patch.emailSubjectTemplate !== undefined) {
    merged.emailSubjectTemplate =
      patch.emailSubjectTemplate.trim() || DEFAULT_NEWSLETTER_SUBJECT_TEMPLATE;
  }
  if (patch.emailBodyTemplate !== undefined) {
    merged.emailBodyTemplate =
      patch.emailBodyTemplate.trim() || DEFAULT_NEWSLETTER_BODY_TEMPLATE;
  }
  if (patch.webhookSecret !== undefined && patch.webhookSecret.trim()) {
    merged.webhookSecret = patch.webhookSecret.trim();
  }

  const jsonValue = merged as unknown as Prisma.InputJsonValue;
  await prisma.siteContent.upsert({
    where: { key: NEWSLETTER_SETTINGS_KEY },
    create: { key: NEWSLETTER_SETTINGS_KEY, value: jsonValue },
    update: { value: jsonValue },
  });

  return merged;
}
