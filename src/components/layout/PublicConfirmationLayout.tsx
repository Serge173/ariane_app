import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { PublicPageShell } from "@/components/layout/PublicPageShell";

export function PublicConfirmationLayout({
  title,
  description,
  reference,
  steps,
  actions,
}: {
  title: string;
  description: string;
  reference?: string | null;
  steps: ReactNode;
  actions: ReactNode;
}) {
  return (
    <PublicPageShell width="narrow">
      <div className="text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-[0_12px_32px_-12px_rgba(158,27,42,0.45)]">
          <Check className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.75} />
        </div>

        <p className="text-overline text-accent mb-3">Confirmation</p>
        <h1 className="heading-section mb-3">{title}</h1>
        <p className="public-page-desc mx-auto max-w-md mb-2">{description}</p>
        {reference ? (
          <p className="text-sm text-brand-500 mb-8">
            Référence : <strong className="text-brand-800">{reference}</strong>
          </p>
        ) : (
          <span className="block mb-8" aria-hidden />
        )}
        <span className="public-page-accent-rule mx-auto mb-8 sm:mb-10" aria-hidden />

        <div className="public-card p-6 sm:p-8 text-left mb-8 sm:mb-10 max-w-md mx-auto">{steps}</div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">{actions}</div>
      </div>
    </PublicPageShell>
  );
}
