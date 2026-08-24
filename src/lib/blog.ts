import { slugify } from "@/lib/utils";

export function parseTagsInput(input: string): string[] {
  return input
    .split(/[,;|\n]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i);
}

export function renderBlogContent(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}
