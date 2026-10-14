import { cn } from "@/lib/utils";
import { isLocalImagePath } from "@/lib/next-image-src";

/** Affiche l'image entière dans son cadre, sans rognage (uploads, produits, slides). */
export const MEDIA_FRAME_CLASS = "relative overflow-hidden bg-brand-50";
export const MEDIA_FRAME_DARK_CLASS = "relative overflow-hidden bg-black";

export type ImageFitMode = "contain" | "cover";
export type ImageFitPreference = ImageFitMode | "auto";

/** Images téléversées (local / Vercel Blob) — affichage intégral sans rognage. */
export function isUserManagedImageUrl(src: string | null | undefined): boolean {
  const u = src?.trim();
  if (!u) return false;
  if (isLocalImagePath(u) && u.startsWith("/uploads/")) return true;
  if (u.includes(".public.blob.vercel-storage.com")) return true;
  return false;
}

export function resolveImageFit(
  src: string | null | undefined,
  preference: ImageFitPreference = "auto"
): ImageFitMode {
  if (preference === "contain" || preference === "cover") return preference;
  return isUserManagedImageUrl(src) ? "contain" : "cover";
}

export function imageObjectFitClass(fit: ImageFitMode = "contain"): string {
  return fit === "contain"
    ? "object-contain object-center"
    : "object-cover object-center";
}

export function imageFillClass(
  fit: ImageFitMode = "contain",
  extra?: string
): string {
  return cn(
    "absolute inset-0 h-full w-full",
    imageObjectFitClass(fit),
    fit === "contain" && "bg-brand-50",
    extra
  );
}
