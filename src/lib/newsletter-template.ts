function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type PublicationLinkKey =
  | "facebook"
  | "whatsapp"
  | "twitter"
  | "tiktok"
  | "instagram"
  | "youtube"
  | "site";

const LINK_LABELS: Record<PublicationLinkKey, string> = {
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  twitter: "X (Twitter)",
  tiktok: "TikTok",
  instagram: "Instagram",
  youtube: "YouTube",
  site: "Notre site",
};

export function buildLinksListHtml(links: Partial<Record<PublicationLinkKey, string | null>>): string {
  const items: string[] = [];
  (Object.keys(LINK_LABELS) as PublicationLinkKey[]).forEach((key) => {
    const url = links[key]?.trim();
    if (url) {
      items.push(`<li><a href="${escapeHtml(url)}">${LINK_LABELS[key]}</a></li>`);
    }
  });
  if (!items.length) return "";
  return `<p><strong>Où nous retrouver :</strong></p><ul>${items.join("")}</ul>`;
}

export function buildPublicationBlockHtml(publicationContent: string | null | undefined): string {
  const text = publicationContent?.trim();
  if (!text) return "";
  return `<div style="margin:16px 0;padding:12px;border-left:3px solid #1a1a1a">${text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>")}</div>`;
}

export function renderNewsletterTemplate(
  template: string,
  vars: Record<string, string>
): string {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{{${key}}}`).join(value);
  }
  return out;
}

export function newsletterGreeting(firstName?: string | null): string {
  return firstName?.trim() ? `Bonjour ${firstName.trim()},` : "Bonjour,";
}
