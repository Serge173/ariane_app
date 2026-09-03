import Link from "next/link";
import { Instagram, Facebook, Linkedin, ExternalLink, type LucideIcon } from "lucide-react";
import type { SiteSettings, SiteSocialLink } from "@/lib/site-settings";
import { FooterAccordionSection } from "@/components/layout/FooterAccordionSection";

const socialIconMap: Record<string, LucideIcon | null> = {
  Facebook: Facebook,
  LinkedIn: Linkedin,
  Instagram: Instagram,
  TikTok: null,
};

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
    </svg>
  );
}

function SocialIcon({ social }: { social: SiteSocialLink }) {
  const Icon = socialIconMap[social.name] ?? null;
  if (Icon) return <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />;
  return <TikTokIcon className="w-4 h-4 flex-shrink-0" />;
}

function phoneHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

interface FooterProps {
  siteSettings: SiteSettings;
}

export function Footer({ siteSettings }: FooterProps) {
  const { brand, footer } = siteSettings;

  return (
    <footer className="bg-brand-950 text-brand-200 mt-auto">
      <div className="container-premium py-8 sm:py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10 xl:gap-14">
          <div className="pb-6 lg:pb-0 border-b border-brand-800 lg:border-0 lg:w-[30%] lg:max-w-sm lg:flex-shrink-0">
            <Link href="/" className="inline-block mb-3 lg:mb-4">
              <span className="font-display text-xl sm:text-2xl font-light text-white tracking-wide">
                {brand.title}
              </span>
              <span className="block text-[10px] uppercase tracking-ultra text-brand-400 -mt-0.5">
                {brand.subtitle}
              </span>
            </Link>
            <p className="text-sm text-brand-400 leading-relaxed">
              {footer.description}
            </p>
          </div>

          <div className="lg:flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 sm:gap-8 lg:gap-6 xl:gap-10 min-w-0">
            <FooterAccordionSection title="Navigation">
            <ul className="space-y-2.5">
              {footer.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-brand-300 hover:text-white transition-colors duration-[var(--duration-micro)]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            </FooterAccordionSection>

            <FooterAccordionSection title="Informations">
            <ul className="space-y-2.5">
              {footer.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-brand-300 hover:text-white transition-colors duration-[var(--duration-micro)]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            </FooterAccordionSection>

            <FooterAccordionSection title="Réseaux">
            <ul className="space-y-3">
              {footer.social.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-sm text-brand-300 hover:text-white transition-colors duration-[var(--duration-micro)] min-w-0"
                  >
                    <SocialIcon social={social} />
                    <span className="min-w-0 break-words">{social.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
            </FooterAccordionSection>

            <FooterAccordionSection title="Contact">
            <div className="space-y-2 font-sans text-sm text-brand-300">
              <p>{footer.contact.line1}</p>
              <p>{footer.contact.line2}</p>
              <a href={phoneHref(footer.contact.phone)} className="block hover:text-white transition-colors">
                {footer.contact.phone}
              </a>
              <a
                href={`mailto:${footer.contact.email}`}
                className="block hover:text-white transition-colors break-all"
              >
                {footer.contact.email}
              </a>
            </div>
            </FooterAccordionSection>
          </div>
        </div>

        <div className="mt-8 lg:mt-12 pt-5 lg:pt-6 border-t border-brand-800">
          <p className="text-xs text-brand-500">
            © {new Date().getFullYear()} {brand.title} {brand.subtitle}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
