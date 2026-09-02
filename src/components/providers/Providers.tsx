"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Align NextAuth client calls with the browser origin (fixes port mismatch in dev).
  const [baseUrl, setBaseUrl] = useState<string | undefined>(
    process.env.NEXT_PUBLIC_APP_URL
  );

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  return (
    <SessionProvider baseUrl={baseUrl} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}
