import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { extensionFromMime, storeUploadedImage } from "@/lib/store-uploaded-image";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    if (!file) return jsonError("Aucun fichier fourni");
    if (!ALLOWED_TYPES.includes(file.type)) {
      return jsonError("Format non supporté. Utilisez JPG, PNG, WebP ou GIF.");
    }
    if (file.size > MAX_SIZE) return jsonError("Fichier trop volumineux (max 5 Mo)");

    const fileName = `${randomUUID()}.${extensionFromMime(file.type)}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await storeUploadedImage({
      folder: "home",
      fileName,
      buffer,
      contentType: file.type,
    });

    return NextResponse.json({ url, success: true });
  } catch (err) {
    console.error("[POST /api/admin/upload/home-image]", err);
    return jsonError(err instanceof Error ? err.message : "Erreur lors de l'upload", 500);
  }
}
