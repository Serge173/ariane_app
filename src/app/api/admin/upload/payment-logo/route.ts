import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { extensionFromMime, storeUploadedImage } from "@/lib/store-uploaded-image";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 2 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) return jsonError("Aucun fichier fourni");

    if (!ALLOWED_TYPES.includes(file.type)) {
      return jsonError("Format non supporté. Utilisez JPG, PNG, WebP, GIF ou SVG.");
    }

    if (file.size > MAX_SIZE) return jsonError("Fichier trop volumineux (max 2 Mo)");

    const ext = extensionFromMime(file.type);
    const fileName = `${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const url = await storeUploadedImage({
      folder: "payments",
      fileName,
      buffer,
      contentType: file.type,
    });

    return NextResponse.json({ url, success: true });
  } catch (err) {
    console.error("[POST /api/admin/upload/payment-logo]", err);
    const message = err instanceof Error ? err.message : "Erreur lors de l'upload";
    return jsonError(message, 500);
  }
}
