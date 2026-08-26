import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

export interface StoreUploadedImageOptions {
  folder: string;
  fileName: string;
  buffer: Buffer;
  contentType: string;
}

/**
 * Production : Vercel Blob (BLOB_READ_WRITE_TOKEN).
 * Local : public/uploads/{folder}/
 */
export async function storeUploadedImage({
  folder,
  fileName,
  buffer,
  contentType,
}: StoreUploadedImageOptions): Promise<string> {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (blobToken) {
    const blob = await put(`uploads/${folder}/${fileName}`, buffer, {
      access: "public",
      contentType,
      token: blobToken,
    });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN manquant. Connectez un store Vercel Blob au projet (Storage → Blob)."
    );
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, fileName), buffer);
  return `/uploads/${folder}/${fileName}`;
}

export function extensionFromMime(type: string): string {
  if (type === "image/svg+xml") return "svg";
  if (type === "image/jpeg") return "jpg";
  return type.split("/")[1]?.replace("jpeg", "jpg") || "bin";
}
