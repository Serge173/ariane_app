/** Courbe unique de la marque — couture, pas spectacle */
export const EASE_COUTURE = [0.22, 1, 0.36, 1] as const;
export const EASE_EXIT = [0.4, 0, 0.8, 1] as const;

/** Durées en secondes (Framer Motion) */
export const DURATION = {
  micro: 0.16,
  short: 0.24,
  medium: 0.48,
  hero: 0.9,
} as const;

/** Montée max d'un reveal (px) */
export const RISE_PX = 12;

/** Stagger reveal section (s) */
export const STAGGER_SECTION = 0.06;
export const STAGGER_HERO_TEXT = 0.08;
export const STAGGER_MAX = 4;

export function staggerDelay(index: number, step = STAGGER_SECTION): number {
  return Math.min(index, STAGGER_MAX - 1) * step;
}
