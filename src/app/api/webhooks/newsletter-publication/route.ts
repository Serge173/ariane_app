import { NextRequest } from "next/server";
import { getNewsletterSettings } from "@/lib/newsletter-settings";
import {
  publicationInputHasContent,
  sendPublicationNewsletterBroadcast,
} from "@/lib/newsletter-broadcast";

function readSecret(req: NextRequest): string | null {
  const header = req.headers.get("x-newsletter-secret")?.trim();
  if (header) return header;
  const auth = req.headers.get("authorization")?.trim();
  if (auth?.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const settings = await getNewsletterSettings();
    if (!settings.autoSendOnSocialWebhook) {
      return Response.json({ ok: false, error: "Webhook désactivé dans l'admin newsletter" }, { status: 403 });
    }

    const secret = readSecret(req);
    if (!secret || secret !== settings.webhookSecret) {
      return Response.json({ ok: false, error: "Secret invalide" }, { status: 401 });
    }

    const body = await req.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      return Response.json({ ok: false, error: "title requis" }, { status: 400 });
    }

    const intro = typeof body.message === "string" ? body.message.trim() : typeof body.intro === "string" ? body.intro.trim() : "";
    const publicationBody =
      typeof body.publicationContent === "string"
        ? body.publicationContent.trim()
        : typeof body.content === "string"
          ? body.content.trim()
          : "";

    const input = {
      title,
      intro: intro || "Nous avons publié sur nos réseaux :",
      publicationBody: publicationBody || null,
      facebookUrl: typeof body.facebookUrl === "string" ? body.facebookUrl.trim() : null,
      whatsappUrl: typeof body.whatsappUrl === "string" ? body.whatsappUrl.trim() : null,
      twitterUrl:
        typeof body.twitterUrl === "string"
          ? body.twitterUrl.trim()
          : typeof body.xUrl === "string"
            ? body.xUrl.trim()
            : null,
      tiktokUrl: typeof body.tiktokUrl === "string" ? body.tiktokUrl.trim() : null,
      instagramUrl: typeof body.instagramUrl === "string" ? body.instagramUrl.trim() : null,
      youtubeUrl: typeof body.youtubeUrl === "string" ? body.youtubeUrl.trim() : null,
      siteUrl: typeof body.siteUrl === "string" ? body.siteUrl.trim() : null,
      source: "webhook" as const,
    };

    if (!publicationInputHasContent(input)) {
      return Response.json(
        { ok: false, error: "Ajoutez publicationContent, message ou au moins un lien réseau" },
        { status: 400 }
      );
    }

    const result = await sendPublicationNewsletterBroadcast(input);
    return Response.json({ ok: true, ...result });
  } catch (e) {
    console.error("Newsletter webhook:", e);
    return Response.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}
