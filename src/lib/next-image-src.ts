/** Chemins locaux servis par Next (public/ ou routes API). */
export function isLocalImagePath(url: string): boolean {
  return url.startsWith("/") && !url.startsWith("//");
}

/** URLs autorisées par `images.remotePatterns` dans next.config — évite un crash SSR de next/image. */
export function isRemoteImageAllowed(url: string): boolean {
  if (isLocalImagePath(url)) return true;
  try {
    const { hostname, protocol } = new URL(url);
    if (protocol !== "https:" && protocol !== "http:") return false;
    if (hostname === "images.unsplash.com") return true;
    if (hostname.endsWith(".public.blob.vercel-storage.com")) return true;
    return false;
  } catch {
    return false;
  }
}

export function resolveNextImageSrc(url: string | undefined | null, fallback: string): string {
  const trimmed = url?.trim();
  if (!trimmed || !isRemoteImageAllowed(trimmed)) return fallback;
  return trimmed;
}
