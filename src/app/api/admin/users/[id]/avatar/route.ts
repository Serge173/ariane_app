import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import prisma from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { canManageTeam, TEAM_ROLES } from "@/lib/user-roles";
import { extensionFromMime, storeUploadedImage } from "@/lib/store-uploaded-image";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024;

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, context: RouteContext) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  const isSelf = session!.user!.id === id;

  if (!isSelf && !canManageTeam(session!.user!.role)) {
    return jsonError("Droits insuffisants", 403);
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || (!isSelf && !TEAM_ROLES.includes(user.role))) {
    return jsonError("Compte introuvable", 404);
  }

  try {
    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) return jsonError("Aucun fichier fourni");
    if (!ALLOWED_TYPES.includes(file.type)) {
      return jsonError("Format non supporté. Utilisez JPG, PNG ou WebP.");
    }
    if (file.size > MAX_SIZE) return jsonError("Fichier trop volumineux (max 5 Mo)");

    const ext = extensionFromMime(file.type);
    const fileName = `${id}-${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const avatarUrl = await storeUploadedImage({
      folder: "avatars",
      fileName,
      buffer,
      contentType: file.type,
    });

    await prisma.user.update({
      where: { id },
      data: { avatar: avatarUrl.split("?")[0] },
    });

    const cacheBusted = `${avatarUrl.split("?")[0]}?t=${Date.now()}`;
    return NextResponse.json({ avatar: cacheBusted, success: true });
  } catch (err) {
    console.error("[POST /api/admin/users/[id]/avatar]", err);
    const message = err instanceof Error ? err.message : "Erreur lors de l'upload";
    return jsonError(message, 500);
  }
}
