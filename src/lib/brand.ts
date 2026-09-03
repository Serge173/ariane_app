export const BRAND_TITLE = "Bienvenue à la mode";
export const BRAND_SUBTITLE = "avec Ariane";
export const BRAND_FULL_NAME = "Bienvenue à la mode avec Ariane";

/** Ancien nom — migration des réglages déjà en base */
export const LEGACY_BRAND_TITLE = "Conseil en Image";
export const LEGACY_BRAND_FULL_NAME = "Conseil en Image avec Ariane";

export function migrateBrandTitle(title: string): string {
  return title === LEGACY_BRAND_TITLE ? BRAND_TITLE : title;
}

export function migrateBrandText(text: string): string {
  return text
    .replaceAll(LEGACY_BRAND_FULL_NAME, BRAND_FULL_NAME)
    .replaceAll("Conseil en image avec Ariane", BRAND_FULL_NAME);
}

export function migrateBrandInObject<T>(value: T): T {
  if (typeof value === "string") return migrateBrandText(value) as T;
  if (Array.isArray(value)) return value.map(migrateBrandInObject) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        migrateBrandInObject(entry),
      ])
    ) as T;
  }
  return value;
}
