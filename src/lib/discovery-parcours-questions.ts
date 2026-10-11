import {
  DEFAULT_DISCOVERY_PARCOURS_SETTINGS,
  type DiscoveryParcoursSettings,
  type DiscoveryQuestionDef,
} from "@/lib/discovery-parcours-settings";

export type { DiscoveryQuestionDef };

export type DiscoveryAnswers = Record<string, string[]>;

export function getQuestionsFromSettings(
  settings: DiscoveryParcoursSettings = DEFAULT_DISCOVERY_PARCOURS_SETTINGS
): DiscoveryQuestionDef[] {
  return settings.questions;
}

export function emptyDiscoveryAnswers(
  settings: DiscoveryParcoursSettings = DEFAULT_DISCOVERY_PARCOURS_SETTINGS
): DiscoveryAnswers {
  const out: DiscoveryAnswers = {};
  for (const q of settings.questions) {
    out[q.id] = Array.from({ length: q.defaultLines }, () => "");
  }
  return out;
}

export function normalizeDiscoveryAnswers(
  raw: unknown,
  settings: DiscoveryParcoursSettings = DEFAULT_DISCOVERY_PARCOURS_SETTINGS
): DiscoveryAnswers {
  const base = emptyDiscoveryAnswers(settings);
  if (!raw || typeof raw !== "object") return base;
  const obj = raw as Record<string, unknown>;

  for (const q of settings.questions) {
    const val = obj[q.id];
    if (Array.isArray(val)) {
      const lines = val.filter((line): line is string => typeof line === "string");
      base[q.id] = lines.length > 0 ? lines : base[q.id];
    }
  }

  for (const key of Object.keys(obj)) {
    if (settings.questions.some((q) => q.id === key)) continue;
    const val = obj[key];
    if (Array.isArray(val)) {
      const lines = val.filter((line): line is string => typeof line === "string");
      if (lines.length > 0) base[key] = lines;
    }
  }

  return base;
}

export function formatDiscoveryAnswersForMessage(
  answers: DiscoveryAnswers,
  settings: DiscoveryParcoursSettings = DEFAULT_DISCOVERY_PARCOURS_SETTINGS
): string {
  const blocks: string[] = ["--- Questionnaire « Mon parcours de découverte » ---"];
  const labelById = new Map(settings.questions.map((q) => [q.id, q.label]));

  const keys = [
    ...settings.questions.map((q) => q.id),
    ...Object.keys(answers).filter((k) => !labelById.has(k)),
  ];

  for (const id of keys) {
    const lines = (answers[id] ?? []).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;
    blocks.push("");
    blocks.push(labelById.get(id) ?? id);
    for (const line of lines) {
      blocks.push(`  • ${line}`);
    }
  }

  if (blocks.length === 1) return "";
  return blocks.join("\n");
}
