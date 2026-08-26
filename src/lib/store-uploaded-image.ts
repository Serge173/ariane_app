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
 * Production : Vercel Blob (OIDC auto ou BLOB_READ_WRITE_TOKEN).
 * Local : public/uploads/{folder}/ ou Blob si token présent (vercel env pull).
 */
export async function storeUploadedImage({
  folder,
  fileName,
  buffer,
  contentType,
}: StoreUploadedImageOptions): Promise<string> {
  const isVercel = !!process.env.VERCEL;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  const hasBlobStore =
    isVercel ||
    !!blobToken ||
    !!(process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN);

  if (hasBlobStore) {
    const blob = await put(`uploads/${folder}/${fileName}`, buffer, {
      access: "public",
      contentType,
      ...(blobToken ? { token: blobToken } : {}),
    });
    return blob.url;
  }

  if (isVercel) {
    throw new Error(
      "Store Vercel Blob non connecté. Allez dans Storage → Create Database → Blob."
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
