import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const DISCOVERY_PARCOURS_SETTINGS_KEY = "discovery_parcours_settings";

export type DiscoveryQuestionDef = {
  id: string;
  label: string;
  defaultLines: number;
  large?: boolean;
};

export type DiscoveryParcoursSettings = {
  header: {
    title: string;
    subtitle: string;
    contact: string;
  };
  intro: string;
  coordsBanner: string;
  objectiveLabel: string;
  objectivePlaceholder: string;
  questions: DiscoveryQuestionDef[];
};

/** Ancien libellé en base — affiché sans point d'exclamation. */
const LEGACY_DISCOVERY_HEADER_TITLE = "JE SUIS MON PROPRE STANDARD !";

export const DEFAULT_DISCOVERY_PARCOURS_SETTINGS: DiscoveryParcoursSettings = {
  header: {
    title: "JE SUIS MON PROPRE STANDARD",
    subtitle: "ARIANE DAGO | CONSULTANTE EN IMAGE",
    contact: "+225 07 68 56 15 70 | stephaniearianedago@gmail.com",
  },
  intro: "",
  coordsBanner: "Coordonnées client",
  objectiveLabel: "Votre objectif ou votre besoin (optionnel)",
  objectivePlaceholder: "Résumé en une phrase…",
  questions: [
    {
      id: "whyContact",
      label: "Pourquoi m'avez-vous contacté en tant que consultante en image ?",
      defaultLines: 3,
    },
    {
      id: "objectiveEnd",
      label: "Quel est votre objectif au sorti de ce suivi ?",
      defaultLines: 3,
    },
    {
      id: "imagePerception",
      label: "Que pensez-vous de l'image en générale et spécifiquement de la votre ?",
      defaultLines: 3,
    },
    {
      id: "characterWords",
      label:
        "Pouvez-vous donner trois (3) mots qui vous caractérisent selon vous et trois (3) autres selon la perception de votre entourage ?",
      defaultLines: 3,
    },
    {
      id: "favoriteColors",
      label: "Avez-vous des couleurs préférées si oui lesquelles ?",
      defaultLines: 3,
    },
    {
      id: "flatteringColors",
      label: "Pensez-vous que certaines couleurs vous mettent plus en valeur ? si oui lesquelles ?",
      defaultLines: 3,
    },
    {
      id: "dislikedColors",
      label: "Avez-vous des couleurs que vous aimez moins ? pourquoi et lesquelles ?",
      defaultLines: 3,
    },
    {
      id: "makeup",
      label: "Que pensez-vous du maquillage ? A quelle fréquence l'utilisez-vous ?",
      defaultLines: 3,
    },
    {
      id: "projection",
      label:
        "Pouvez-vous donner en quelques lignes une projection de vous en terme d'image dans 3 mois et 3 ans ?",
      defaultLines: 1,
      large: true,
    },
  ],
};

function slugId(label: string, index: number): string {
  const base = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .slice(0, 32);
  return base || `question_${index + 1}`;
}

function parseQuestions(raw: unknown): DiscoveryQuestionDef[] {
  if (!Array.isArray(raw)) return DEFAULT_DISCOVERY_PARCOURS_SETTINGS.questions;
  const out: DiscoveryQuestionDef[] = [];
  raw.forEach((item, index) => {
    if (!item || typeof item !== "object") return;
    const o = item as Record<string, unknown>;
    const label = typeof o.label === "string" ? o.label.trim() : "";
    if (!label) return;
    const id =
      typeof o.id === "string" && o.id.trim()
        ? o.id.trim()
        : slugId(label, index);
    const defaultLines =
      typeof o.defaultLines === "number" && o.defaultLines >= 1
        ? Math.min(10, Math.floor(o.defaultLines))
        : 3;
    out.push({
      id,
      label,
      defaultLines,
      large: Boolean(o.large),
    });
  });
  return out.length > 0 ? out : DEFAULT_DISCOVERY_PARCOURS_SETTINGS.questions;
}

export function parseDiscoveryParcoursSettings(raw: unknown): DiscoveryParcoursSettings {
  const d = DEFAULT_DISCOVERY_PARCOURS_SETTINGS;
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  const headerRaw =
    o.header && typeof o.header === "object" ? (o.header as Record<string, unknown>) : {};

  let title = d.header.title;
  if (typeof headerRaw.title === "string" && headerRaw.title.trim()) {
    const trimmed = headerRaw.title.trim();
    title =
      trimmed === LEGACY_DISCOVERY_HEADER_TITLE ? d.header.title : trimmed;
  }

  return {
    header: {
      title,
      subtitle:
        typeof headerRaw.subtitle === "string" && headerRaw.subtitle.trim()
          ? headerRaw.subtitle.trim()
          : d.header.subtitle,
      contact:
        typeof headerRaw.contact === "string" && headerRaw.contact.trim()
          ? headerRaw.contact.trim()
          : d.header.contact,
    },
    intro: typeof o.intro === "string" ? o.intro.trim() : d.intro,
    coordsBanner:
      typeof o.coordsBanner === "string" && o.coordsBanner.trim()
        ? o.coordsBanner.trim()
        : d.coordsBanner,
    objectiveLabel:
      typeof o.objectiveLabel === "string" && o.objectiveLabel.trim()
        ? o.objectiveLabel.trim()
        : d.objectiveLabel,
    objectivePlaceholder:
      typeof o.objectivePlaceholder === "string" && o.objectivePlaceholder.trim()
        ? o.objectivePlaceholder.trim()
        : d.objectivePlaceholder,
    questions: parseQuestions(o.questions),
  };
}

export async function getDiscoveryParcoursSettings(): Promise<DiscoveryParcoursSettings> {
  try {
    const row = await prisma.siteContent.findUnique({
      where: { key: DISCOVERY_PARCOURS_SETTINGS_KEY },
    });
    if (!row?.value) return DEFAULT_DISCOVERY_PARCOURS_SETTINGS;
    return parseDiscoveryParcoursSettings(row.value);
  } catch {
    return DEFAULT_DISCOVERY_PARCOURS_SETTINGS;
  }
}

export async function updateDiscoveryParcoursSettings(
  patch: Partial<DiscoveryParcoursSettings>
): Promise<DiscoveryParcoursSettings> {
  const current = await getDiscoveryParcoursSettings();
  const merged = parseDiscoveryParcoursSettings({
    ...current,
    ...patch,
    header: patch.header ? { ...current.header, ...patch.header } : current.header,
    questions: patch.questions ?? current.questions,
  });

  const jsonValue = merged as unknown as Prisma.InputJsonValue;
  await prisma.siteContent.upsert({
    where: { key: DISCOVERY_PARCOURS_SETTINGS_KEY },
    create: { key: DISCOVERY_PARCOURS_SETTINGS_KEY, value: jsonValue },
    update: { value: jsonValue },
  });

  return merged;
}
