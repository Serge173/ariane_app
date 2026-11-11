/** 2e encadré du hero (maquette) — thème du programme, sans reprendre les libellés des cartes. */
export const OFFER_HERO_SCOPE_LINES: Record<string, string> = {
  standard: "Colorimétrie, garde-robe et premiers codes style",
  gold: "Transformation image, shopping guidé et suivi",
  platinum: "Colorimétrie, style et gestion de complexes",
  "sur-mesure": "Diagnostic premium et parcours exclusif",
};

export function getOfferHeroScopeLine(slug: string): string {
  return OFFER_HERO_SCOPE_LINES[slug] ?? "Conseil en image personnalisé";
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function textsAreDuplicate(a: string, b: string): boolean {
  const na = normalizeText(a);
  const nb = normalizeText(b);
  if (!na || !nb) return false;
  return na === nb || na.startsWith(nb) || nb.startsWith(na);
}

/** Retire puces et lignes identiques aux cartes « prestations ». */
export function offerDescriptionBody(description: string, features: string[]): string {
  const featureKeys = new Set(
    features.map((f) => normalizeText(f.replace(/^tout\s+\w+\s*\+?\s*$/i, "")))
  );

  const paragraphs: string[] = [];

  for (const block of description.split(/\n{2,}/)) {
    const lines = block.split(/\n/).map((l) => l.trim()).filter(Boolean);
    const proseLines: string[] = [];

    for (const line of lines) {
      const cleaned = line.replace(/^[\s•\-–*]+/, "").trim();
      if (!cleaned) continue;
      if (/^•/.test(line)) continue;
      if (featureKeys.has(normalizeText(cleaned))) continue;
      if (features.some((f) => normalizeText(cleaned) === normalizeText(f))) continue;
      proseLines.push(cleaned);
    }

    if (proseLines.length > 0) {
      paragraphs.push(proseLines.join(" "));
    }
  }

  return paragraphs.join("\n\n").trim();
}

export function resolveOfferDescription(
  description: string,
  features: string[],
  shortDescription: string
): string | null {
  const body = offerDescriptionBody(description, features);
  if (!body) return null;
  if (textsAreDuplicate(body, shortDescription)) return null;
  return body;
}
