import { resolveAppUrl } from "@/lib/app-url";

/** URL publique de l'application (local, Vercel preview ou production). */
export async function getAppUrl(): Promise<string> {
  const { getPlatformSettings } = await import("@/lib/platform-settings");
  const settings = await getPlatformSettings();
  return settings.appUrl.replace(/\/$/, "");
}

/** Fallback synchrone basé sur les variables d'environnement. */
export function getAppUrlSync(): string {
  return resolveAppUrl();
}
