import type { NextConfig } from "next";

function resolveBuildAppUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const fromNextAuth = process.env.NEXTAUTH_URL?.replace(/\/$/, "");
  if (fromNextAuth) return fromNextAuth;

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (productionHost) return `https://${productionHost}`;

  return "";
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_URL: resolveBuildAppUrl(),
  },
  async redirects() {
    return [
      {
        source: "/admin/admin/:path*",
        destination: "/admin/:path*",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/favicon.svg" }];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
