import { formatDiscoveryAnswersForMessage, type DiscoveryAnswers } from "@/lib/discovery-parcours-questions";
import type { DiscoveryParcoursSettings } from "@/lib/discovery-parcours-settings";

export function buildRdvRequestMessage(input: {
  date: string;
  time: string;
  modeLabel: string;
  objective?: string | null;
  discoveryAnswers: DiscoveryAnswers;
  formSettings: DiscoveryParcoursSettings;
}): string {
  const discoveryBlock = formatDiscoveryAnswersForMessage(
    input.discoveryAnswers,
    input.formSettings
  );

  return [
    "Demande de rendez-vous — Ariane DAGO Conseil en image",
    "",
    `Date souhaitée : ${input.date}`,
    `Créneau : ${input.time.replace(":", "h")}`,
    `Mode : ${input.modeLabel}`,
    input.objective?.trim() ? `Objectif (résumé) : ${input.objective.trim()}` : null,
    discoveryBlock || null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function modeToLabel(mode: string): string {
  if (mode === "DIGITAL") return "100% Digital";
  if (mode === "HYBRID") return "Hybride";
  if (mode === "IN_PERSON") return "Présentiel (Abidjan)";
  return mode;
}
