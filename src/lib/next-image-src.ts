/** URLs autorisées par `images.remotePatterns` dans next.config — évite un crash SSR de next/image. */
export function isRemoteImageAllowed(url: string): boolean {
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
