import { unstable_cache } from "next/cache";

async function probeUrl(url: string): Promise<boolean> {
  try {
    const head = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });
    if (head.ok) return true;
    if (head.status === 405 || head.status === 403) {
      const getRes = await fetch(url, {
        method: "GET",
        headers: { Range: "bytes=0-1023" },
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      });
      return getRes.ok;
    }
    return false;
  } catch {
    return false;
  }
}

/** Vérifie qu’une URL distante répond (cache 1 h). Chemins locaux /… = toujours OK. */
export async function isRemoteImageReachable(url: string): Promise<boolean> {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;

  const cached = unstable_cache(
    async () => probeUrl(trimmed),
    ["remote-image-reachable", trimmed],
    { revalidate: 3600 }
  );
  return cached();
}

export async function resolveReachableImageUrl(url: string, fallback: string): Promise<string> {
  const trimmed = url.trim();
  const fb = fallback.trim() || trimmed;
  if (!trimmed) return fb;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  if (await isRemoteImageReachable(trimmed)) return trimmed;
  return fb;
}
