"use client";

import { useEffect } from "react";

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-semibold text-black mb-2">Un problème est survenu</h1>
      <p className="text-sm text-brand-600 max-w-md mb-6">
        Le chargement de la page a échoué. Réessayez dans un instant — si le problème continue,
        vérifiez les logs Vercel ou contactez le support technique.
      </p>
      {error.digest && (
        <p className="text-xs text-brand-400 mb-4 font-mono">Réf. {error.digest}</p>
      )}
      <button type="button" onClick={() => reset()} className="btn-primary">
        Réessayer
      </button>
    </div>
  );
}
