export type BlogPublicationLinks = {
  facebookUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
  twitterUrl?: string;
};

const LINK_KEYS: (keyof BlogPublicationLinks)[] = [
  "facebookUrl",
  "youtubeUrl",
  "tiktokUrl",
  "instagramUrl",
  "whatsappUrl",
  "twitterUrl",
];

export function emptyPublicationLinks(): BlogPublicationLinks {
  return {};
}

export function parsePublicationLinks(raw: unknown): BlogPublicationLinks {
  if (!raw || typeof raw !== "object") return {};
  const obj = raw as Record<string, unknown>;
  const out: BlogPublicationLinks = {};
  for (const key of LINK_KEYS) {
    const v = obj[key];
    if (typeof v === "string" && v.trim()) out[key] = v.trim();
  }
  return out;
}

export function normalizePublicationLinksInput(
  input: BlogPublicationLinks | null | undefined
): BlogPublicationLinks | null {
  if (!input) return null;
  const out = parsePublicationLinks(input);
  return Object.keys(out).length > 0 ? out : null;
}

export function publicationLinksForApi(links: BlogPublicationLinks | null | undefined) {
  const normalized = normalizePublicationLinksInput(links);
  return normalized ?? null;
}

export const PUBLICATION_LINK_LABELS: Record<keyof BlogPublicationLinks, string> = {
  facebookUrl: "Facebook",
  youtubeUrl: "YouTube",
  tiktokUrl: "TikTok",
  instagramUrl: "Instagram",
  whatsappUrl: "WhatsApp",
  twitterUrl: "X (Twitter)",
};
