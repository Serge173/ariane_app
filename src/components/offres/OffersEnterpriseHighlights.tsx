import Link from "next/link";
import { Building2, Users, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: LucideIcon[] = [Building2, Users, Sparkles];

export function OffersEnterpriseHighlights({
  items,
  ctaLabel,
  ctaHref,
}: {
  items: string[];
  ctaLabel: string;
  ctaHref: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className="offres-enterprise-highlights max-w-2xl mx-auto mb-10 sm:mb-12 text-center">
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
        {items.map((text, index) => {
          const Icon = ICONS[index % ICONS.length];
          return (
            <li
              key={`${index}-${text.slice(0, 24)}`}
              className="offres-enterprise-highlight rounded-xl border border-black/10 bg-white px-4 py-5 text-left"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-black/10 mb-3">
                <Icon className="w-4 h-4 text-brand-800" strokeWidth={1.5} aria-hidden />
              </span>
              <p className="text-sm leading-snug text-brand-900">{text}</p>
            </li>
          );
        })}
      </ul>
      <Link href={ctaHref} className="btn-primary inline-flex items-center gap-2">
        {ctaLabel}
      </Link>
    </section>
  );
}
