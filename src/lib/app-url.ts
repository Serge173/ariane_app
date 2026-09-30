function normalizePublicUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, "");
  if (!trimmed) return "http://localhost:3001";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/** Résout l'URL publique de l'app (build + runtime, local + Vercel). */
export function resolveAppUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv) return normalizePublicUrl(fromEnv);

  const fromNextAuth = process.env.NEXTAUTH_URL?.replace(/\/$/, "");
  if (fromNextAuth) return normalizePublicUrl(fromNextAuth);

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (productionHost) return normalizePublicUrl(productionHost);

  const deploymentHost = process.env.VERCEL_URL;
  if (deploymentHost) return normalizePublicUrl(deploymentHost);

  return "http://localhost:3001";
}
