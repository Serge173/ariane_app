/** Résout l'URL publique de l'app (build + runtime, local + Vercel). */
export function resolveAppUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const fromNextAuth = process.env.NEXTAUTH_URL?.replace(/\/$/, "");
  if (fromNextAuth) return fromNextAuth;

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (productionHost) return `https://${productionHost}`;

  const deploymentHost = process.env.VERCEL_URL;
  if (deploymentHost) return `https://${deploymentHost}`;

  return "http://localhost:3001";
}
