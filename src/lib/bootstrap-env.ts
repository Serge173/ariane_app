/** Aligne NEXTAUTH_URL / NEXT_PUBLIC_APP_URL avec le déploiement Vercel actif. */
export function bootstrapEnv(): void {
  const vercelUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : null;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  const authUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, "");

  const isStaleVercelAlias = (url?: string) =>
    !!url && !!vercelUrl && url.includes("vercel.app") && url !== vercelUrl;

  const resolved =
    vercelUrl && (isStaleVercelAlias(appUrl) || isStaleVercelAlias(authUrl) || !appUrl)
      ? vercelUrl
      : appUrl || authUrl || vercelUrl || "http://localhost:3001";

  process.env.NEXTAUTH_URL = resolved;
  process.env.NEXT_PUBLIC_APP_URL = resolved;
}
