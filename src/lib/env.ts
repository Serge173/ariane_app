/** URL publique de l'application (local, Vercel preview ou production). */
export async function getAppUrl(): Promise<string> {
  const { getPlatformSettings } = await import("@/lib/platform-settings");
  const settings = await getPlatformSettings();
  return settings.appUrl.replace(/\/$/, "");
}

/** Fallback synchrone basé sur les variables d'environnement. */
export function getAppUrlSync(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3001";
}
