import { Prisma } from "@prisma/client";

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

/** Valeur Prisma pour le champ JSON `publicationLinks` (null DB = DbNull). */
export function publicationLinksForPrisma(
  links: BlogPublicationLinks | null | undefined
): Prisma.InputJsonValue | typeof Prisma.DbNull | undefined {
  if (links === undefined) return undefined;
  const normalized = normalizePublicationLinksInput(links);
  if (normalized === null) return Prisma.DbNull;
  return normalized as Prisma.InputJsonValue;
}

/** @deprecated use publicationLinksForPrisma */
export const publicationLinksForApi = publicationLinksForPrisma;

export const PUBLICATION_LINK_LABELS: Record<keyof BlogPublicationLinks, string> = {
  facebookUrl: "Facebook",
  youtubeUrl: "YouTube",
  tiktokUrl: "TikTok",
  instagramUrl: "Instagram",
  whatsappUrl: "WhatsApp",
  twitterUrl: "X (Twitter)",
};
