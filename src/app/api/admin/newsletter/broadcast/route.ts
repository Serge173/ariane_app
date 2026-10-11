import { NextRequest } from "next/server";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import {
  publicationInputHasContent,
  sendPublicationNewsletterBroadcast,
} from "@/lib/newsletter-broadcast";

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) return jsonError("Titre requis");

    const intro = typeof body.intro === "string" ? body.intro.trim() : "";
    const publicationBody =
      typeof body.publicationBody === "string" ? body.publicationBody.trim() : "";
    const youtubeUrl = typeof body.youtubeUrl === "string" ? body.youtubeUrl.trim() : "";
    const facebookUrl = typeof body.facebookUrl === "string" ? body.facebookUrl.trim() : "";
    const whatsappUrl = typeof body.whatsappUrl === "string" ? body.whatsappUrl.trim() : "";
    const twitterUrl = typeof body.twitterUrl === "string" ? body.twitterUrl.trim() : "";
    const tiktokUrl = typeof body.tiktokUrl === "string" ? body.tiktokUrl.trim() : "";
    const instagramUrl = typeof body.instagramUrl === "string" ? body.instagramUrl.trim() : "";
    const siteUrl = typeof body.siteUrl === "string" ? body.siteUrl.trim() : "";

    const payload = {
      title,
      intro: intro || null,
      publicationBody: publicationBody || null,
      youtubeUrl: youtubeUrl || null,
      facebookUrl: facebookUrl || null,
      whatsappUrl: whatsappUrl || null,
      twitterUrl: twitterUrl || null,
      tiktokUrl: tiktokUrl || null,
      instagramUrl: instagramUrl || null,
      siteUrl: siteUrl || null,
      source: "manual" as const,
    };

    if (!publicationInputHasContent(payload)) {
      return jsonError("Ajoutez le texte de publication, un message ou au moins un lien");
    }

    const result = await sendPublicationNewsletterBroadcast(payload);

    return Response.json(result);
  } catch (e) {
    console.error("Newsletter broadcast error:", e);
    return jsonError("Envoi impossible", 500);
  }
}
