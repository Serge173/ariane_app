import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { requireAdmin, jsonError } from "@/lib/admin-api";

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

    if (file.size > MAX_SIZE) {
      return jsonError("Fichier trop volumineux (max 5 Mo)");
    }

    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    const fileName = `${randomUUID()}.${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "blog");

    await mkdir(uploadsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, fileName), buffer);

    const url = `/uploads/blog/${fileName}`;

    return NextResponse.json({ url, success: true });
  } catch (err) {
    console.error("[POST /api/admin/upload/blog-image]", err);
    return jsonError("Erreur lors de l'upload", 500);
  }
}
