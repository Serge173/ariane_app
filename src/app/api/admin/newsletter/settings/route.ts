import { NextRequest } from "next/server";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import {
  getNewsletterSettings,
  updateNewsletterSettings,
  type NewsletterSettings,
} from "@/lib/newsletter-settings";
import { resolveAppUrl } from "@/lib/app-url";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const settings = await getNewsletterSettings();
  return Response.json({
    ...settings,
    webhookUrl: `${resolveAppUrl()}/api/webhooks/newsletter-publication`,
  });
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const patch: Partial<NewsletterSettings> = {};

    if (body.autoSendOnBlogPublish !== undefined) {
      patch.autoSendOnBlogPublish = Boolean(body.autoSendOnBlogPublish);
    }
    if (body.autoSendOnSocialWebhook !== undefined) {
      patch.autoSendOnSocialWebhook = Boolean(body.autoSendOnSocialWebhook);
    }
    if (typeof body.emailSubjectTemplate === "string") {
      patch.emailSubjectTemplate = body.emailSubjectTemplate;
    }
    if (typeof body.emailBodyTemplate === "string") {
      patch.emailBodyTemplate = body.emailBodyTemplate;
    }
    if (typeof body.webhookSecret === "string" && body.webhookSecret.trim()) {
      patch.webhookSecret = body.webhookSecret.trim();
    }

    const settings = await updateNewsletterSettings(patch);
    return Response.json({
      ...settings,
      webhookUrl: `${resolveAppUrl()}/api/webhooks/newsletter-publication`,
    });
  } catch (e) {
    console.error("Newsletter settings update:", e);
    return jsonError("Enregistrement impossible", 500);
  }
}
