import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { requireAdmin, jsonError } from "@/lib/admin-api";

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

    const ext = file.type === "image/svg+xml" ? "svg" : file.type.split("/")[1].replace("jpeg", "jpg");
    const fileName = `${randomUUID()}.${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "payments");

    await mkdir(uploadsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, fileName), buffer);

    return NextResponse.json({ url: `/uploads/payments/${fileName}`, success: true });
  } catch (err) {
    console.error("[POST /api/admin/upload/payment-logo]", err);
    return jsonError("Erreur lors de l'upload", 500);
  }
}
