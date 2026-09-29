import { NextRequest } from "next/server";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { sendSocialNewsletterBroadcast } from "@/lib/newsletter-broadcast";

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) return jsonError("Titre requis");

    const intro = typeof body.intro === "string" ? body.intro.trim() : "";
    const youtubeUrl = typeof body.youtubeUrl === "string" ? body.youtubeUrl.trim() : "";
    const facebookUrl = typeof body.facebookUrl === "string" ? body.facebookUrl.trim() : "";
    const tiktokUrl = typeof body.tiktokUrl === "string" ? body.tiktokUrl.trim() : "";
    const instagramUrl = typeof body.instagramUrl === "string" ? body.instagramUrl.trim() : "";

    if (!youtubeUrl && !facebookUrl && !tiktokUrl && !instagramUrl && !intro) {
      return jsonError("Ajoutez au moins un lien réseau ou un message");
    }

    const result = await sendSocialNewsletterBroadcast({
      title,
      intro: intro || null,
      youtubeUrl: youtubeUrl || null,
      facebookUrl: facebookUrl || null,
      tiktokUrl: tiktokUrl || null,
      instagramUrl: instagramUrl || null,
    });

    return Response.json(result);
  } catch (e) {
    console.error("Newsletter broadcast error:", e);
    return jsonError("Envoi impossible", 500);
  }
}
