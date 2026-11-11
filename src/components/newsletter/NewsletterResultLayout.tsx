import Link from "next/link";
import { Check, MailX } from "lucide-react";
import { PublicPageShell } from "@/components/layout/PublicPageShell";

export function NewsletterResultLayout({
  success,
  title,
  description,
  ctaHref = "/",
  ctaLabel = "Retour à l'accueil",
}: {
  success: boolean;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <PublicPageShell width="narrow">
      <div className="text-center public-card p-8 sm:p-10">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
            success ? "bg-accent text-white" : "bg-brand-300/40 text-brand-700"
          }`}
        >
          {success ? (
            <Check className="w-8 h-8" strokeWidth={1.75} aria-hidden />
          ) : (
            <MailX className="w-8 h-8" strokeWidth={1.5} aria-hidden />
          )}
        </div>
        <p className="text-overline text-accent mb-3">Newsletter</p>
        <h1 className="heading-section mb-3">{title}</h1>
        <p className="public-page-desc mx-auto max-w-md mb-6">{description}</p>
        <span className="public-page-accent-rule mx-auto mb-8" aria-hidden />
        <Link href={ctaHref} className="btn-primary rounded-full inline-flex">
          {ctaLabel}
        </Link>
      </div>
    </PublicPageShell>
  );
}
