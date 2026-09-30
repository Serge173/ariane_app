"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin]", error);
  }, [error]);

  return (
    <div className="max-w-lg mx-auto py-16 px-6 text-center">
      <h1 className="text-lg font-semibold text-brand-950 mb-2">Erreur back-office</h1>
      <p className="text-sm text-brand-600 mb-4">
        Cette page admin n&apos;a pas pu s&apos;afficher. Réessayez ou reconnectez-vous.
      </p>
      {error.digest && <p className="text-xs font-mono text-brand-400 mb-6">Réf. {error.digest}</p>}
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => reset()} className="btn-primary">
          Réessayer
        </button>
        <Link href="/admin/connexion" className="btn-secondary">
          Connexion admin
        </Link>
      </div>
    </div>
  );
}
