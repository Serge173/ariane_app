export const UPLOAD_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const UPLOAD_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export type ParsedUploadImage = {
  buffer: Buffer;
  contentType: string;
  fileName: string;
};

export function uploadImageValidationError(file: File | null): string | null {
  if (!file) return "Aucun fichier fourni";
  if (!UPLOAD_IMAGE_MIME_TYPES.includes(file.type as (typeof UPLOAD_IMAGE_MIME_TYPES)[number])) {
    return "Format non supporté. Utilisez JPG, PNG, WebP ou GIF.";
  }
  if (file.size > UPLOAD_IMAGE_MAX_BYTES) {
    return "Fichier trop volumineux (max 5 Mo)";
  }
  return null;
}

export async function parseUploadImageFile(
  file: File | null
): Promise<{ ok: true; data: ParsedUploadImage } | { ok: false; error: string }> {
  const validation = uploadImageValidationError(file);
  if (validation) return { ok: false, error: validation };
  const f = file as File;
  const buffer = Buffer.from(await f.arrayBuffer());
  return {
    ok: true,
    data: {
      buffer,
      contentType: f.type,
      fileName: "",
    },
  };
}
