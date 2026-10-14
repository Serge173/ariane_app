import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { extensionFromMime, storeUploadedImage } from "@/lib/store-uploaded-image";
import { parseUploadImageFile } from "@/lib/upload-image-file";

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const parsed = await parseUploadImageFile(file);
    if (!parsed.ok) return jsonError(parsed.error);

    const fileName = `${randomUUID()}.${extensionFromMime(parsed.data.contentType)}`;
    const url = await storeUploadedImage({
      folder: "home",
      fileName,
      buffer: parsed.data.buffer,
      contentType: parsed.data.contentType,
    });

    return NextResponse.json({ url, success: true });
  } catch (err) {
    console.error("[POST /api/admin/upload/home-image]", err);
    return jsonError(err instanceof Error ? err.message : "Erreur lors de l'upload", 500);
  }
}
