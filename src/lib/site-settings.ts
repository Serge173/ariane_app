import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const SITE_SETTINGS_KEY = "site_settings";

export interface SiteNavLink {
  name: string;
  href: string;
  highlight?: boolean;
}

export interface SiteSocialLink {
  name: string;
  label: string;
  href: string;
}

export interface SiteSettings {
  brand: {
    title: string;
    subtitle: string;
  };
  nav: SiteNavLink[];
  footer: {
    description: string;
    navigation: SiteNavLink[];
    legal: SiteNavLink[];
    contact: {
      line1: string;
      line2: string;
      phone: string;
      email: string;
    };
    social: SiteSocialLink[];
  };
}

function str(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function parseLinks(raw: unknown, fallback: SiteNavLink[]): SiteNavLink[] {
  if (!Array.isArray(raw)) return fallback;
  const links: SiteNavLink[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const l = item as Partial<SiteNavLink>;
    if (!l.name || !l.href) continue;
    links.push({
      name: str(l.name, ""),
      href: str(l.href, "/"),
      ...(l.highlight === true ? { highlight: true } : {}),
    });
  }
  return links.length > 0 ? links.slice(0, 12) : fallback;
}

function parseSocial(raw: unknown, fallback: SiteSocialLink[]): SiteSocialLink[] {
  if (!Array.isArray(raw)) return fallback;
  const links = raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const s = item as Partial<SiteSocialLink>;
      if (!s.name || !s.href) return null;
      return {
        name: str(s.name, ""),
        label: str(s.label, s.name || ""),
        href: str(s.href, "#"),
      };
    })
    .filter((s): s is SiteSocialLink => s !== null);
  return links.length > 0 ? links.slice(0, 8) : fallback;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brand: {
    title: "Conseil en Image",
    subtitle: "avec Ariane",
  },
  nav: [
    { name: "Accueil", href: "/" },
    { name: "Nos prestations", href: "/offres" },
    { name: "Orientation", href: "/orientation" },
    { name: "À propos", href: "/a-propos" },
    { name: "Blog", href: "/blog" },
    { name: "Boutique", href: "/boutique", highlight: true },
  ],
  footer: {
    description:
      "Coaching en image premium à Abidjan et à distance. Alignez votre image avec votre personnalité et vos ambitions.",
    navigation: [
      { name: "Accueil", href: "/" },
      { name: "Nos prestations", href: "/offres" },
      { name: "Orientation", href: "/orientation" },
      { name: "À propos", href: "/a-propos" },
      { name: "Blog", href: "/blog" },
      { name: "Boutique", href: "/boutique" },
      { name: "Contact", href: "/contact" },
    ],
    legal: [
      { name: "Mentions légales", href: "/mentions-legales" },
      { name: "CGV", href: "/cgv" },
      { name: "Confidentialité", href: "/confidentialite" },
      { name: "FAQ", href: "/faq" },
    ],
    contact: {
      line1: "Abidjan, Cocody",
      line2: "Côte d'Ivoire",
      phone: "+225 07 49 52 61 94",
      email: "contact@conseil-image-ariane.com",
    },
    social: [
      { name: "Facebook", label: "DAGO Stéphanie Ariane", href: "https://www.facebook.com" },
      { name: "LinkedIn", label: "DAGO Stéphanie Ariane", href: "https://www.linkedin.com" },
      { name: "TikTok", label: "@conseilenimageavecAriane", href: "https://www.tiktok.com/@conseilenimageavecAriane" },
      { name: "Instagram", label: "@conseilenimageavecAriane", href: "https://www.instagram.com" },
    ],
  },
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const row = await prisma.siteContent.findUnique({ where: { key: SITE_SETTINGS_KEY } });
    if (!row?.value || typeof row.value !== "object") return { ...DEFAULT_SITE_SETTINGS };
    const raw = row.value as Partial<SiteSettings>;
    const brandRaw = raw.brand && typeof raw.brand === "object" ? raw.brand : {};
    const footerRaw: Partial<SiteSettings["footer"]> =
      raw.footer && typeof raw.footer === "object" ? raw.footer : {};
    const contactRaw =
      footerRaw.contact && typeof footerRaw.contact === "object" ? footerRaw.contact : {};
    return {
      brand: {
        title: str((brandRaw as { title?: string }).title, DEFAULT_SITE_SETTINGS.brand.title),
        subtitle: str((brandRaw as { subtitle?: string }).subtitle, DEFAULT_SITE_SETTINGS.brand.subtitle),
      },
      nav: parseLinks(raw.nav, DEFAULT_SITE_SETTINGS.nav),
      footer: {
        description: str((footerRaw as { description?: string }).description, DEFAULT_SITE_SETTINGS.footer.description),
        navigation: parseLinks(
          (footerRaw as { navigation?: unknown }).navigation,
          DEFAULT_SITE_SETTINGS.footer.navigation
        ),
        legal: parseLinks((footerRaw as { legal?: unknown }).legal, DEFAULT_SITE_SETTINGS.footer.legal),
        contact: {
          line1: str((contactRaw as { line1?: string }).line1, DEFAULT_SITE_SETTINGS.footer.contact.line1),
          line2: str((contactRaw as { line2?: string }).line2, DEFAULT_SITE_SETTINGS.footer.contact.line2),
          phone: str((contactRaw as { phone?: string }).phone, DEFAULT_SITE_SETTINGS.footer.contact.phone),
          email: str((contactRaw as { email?: string }).email, DEFAULT_SITE_SETTINGS.footer.contact.email),
        },
        social: parseSocial(
          (footerRaw as { social?: unknown }).social,
          DEFAULT_SITE_SETTINGS.footer.social
        ),
      },
    };
  } catch {
    return { ...DEFAULT_SITE_SETTINGS };
  }
}

export async function updateSiteSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const merged: SiteSettings = {
    brand: patch.brand
      ? {
          title: str(patch.brand.title, current.brand.title),
          subtitle: str(patch.brand.subtitle, current.brand.subtitle),
        }
      : current.brand,
    nav: patch.nav ? parseLinks(patch.nav, current.nav) : current.nav,
    footer: {
      description:
        patch.footer?.description !== undefined
          ? str(patch.footer.description, current.footer.description)
          : current.footer.description,
      navigation: patch.footer?.navigation
        ? parseLinks(patch.footer.navigation, current.footer.navigation)
        : current.footer.navigation,
      legal: patch.footer?.legal ? parseLinks(patch.footer.legal, current.footer.legal) : current.footer.legal,
      contact: patch.footer?.contact
        ? {
            line1: str(patch.footer.contact.line1, current.footer.contact.line1),
            line2: str(patch.footer.contact.line2, current.footer.contact.line2),
            phone: str(patch.footer.contact.phone, current.footer.contact.phone),
            email: str(patch.footer.contact.email, current.footer.contact.email),
          }
        : current.footer.contact,
      social: patch.footer?.social
        ? parseSocial(patch.footer.social, current.footer.social)
        : current.footer.social,
    },
  };

  await prisma.siteContent.upsert({
    where: { key: SITE_SETTINGS_KEY },
    create: { key: SITE_SETTINGS_KEY, value: merged as unknown as Prisma.InputJsonValue },
    update: { value: merged as unknown as Prisma.InputJsonValue },
  });

  return merged;
}
