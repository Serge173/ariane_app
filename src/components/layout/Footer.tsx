import Link from "next/link";
import { Instagram, Facebook, Linkedin, ExternalLink } from "lucide-react";
import { FooterAccordionSection } from "@/components/layout/FooterAccordionSection";

const footerLinks = {
  navigation: [
    { name: "Accueil", href: "/" },
    { name: "Nos prestations", href: "/offres" },
    { name: "Orientation", href: "/orientation" },
    { name: "À propos", href: "/a-propos" },
    { name: "Blog", href: "/blog" },
    { name: "Boutique", href: "/boutique" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Mentions légales", href: "/mentions-legales" },
    { name: "CGV", href: "/cgv" },
    { name: "Confidentialité", href: "/confidentialite" },
    { name: "FAQ", href: "/faq" },
  ],
};

const socialLinks = [
  {
    name: "Facebook",
    label: "DAGO Stéphanie Ariane",
    href: "https://www.facebook.com",
    icon: Facebook,
  },
  {
    name: "LinkedIn",
    label: "DAGO Stéphanie Ariane",
    href: "https://www.linkedin.com",
    icon: Linkedin,
  },
  {
    name: "TikTok",
    label: "@conseilenimageavecAriane",
    href: "https://www.tiktok.com/@conseilenimageavecAriane",
    icon: null,
  },
  {
    name: "Instagram",
    label: "@conseilenimageavecAriane",
    href: "https://www.instagram.com",
    icon: Instagram,
  },
];

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

export function Footer() {
  return (
    <footer className="bg-brand-950 text-brand-200 mt-auto">
      <div className="container-premium py-8 sm:py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-4 pb-2 lg:pb-0 border-b border-brand-800 lg:border-0">
            <Link href="/" className="inline-block mb-3 lg:mb-4">
              <span className="font-display text-xl sm:text-2xl font-light text-white tracking-wide">
                Conseil en Image
              </span>
              <span className="block text-[10px] uppercase tracking-ultra text-brand-400 -mt-0.5">
                avec Ariane
              </span>
            </Link>
            <p className="text-sm text-brand-400 leading-relaxed max-w-sm">
              Coaching en image premium à Abidjan et à distance.
              Alignez votre image avec votre personnalité et vos ambitions.
            </p>
          </div>

          <FooterAccordionSection title="Navigation">
            <ul className="space-y-2.5">
              {footerLinks.navigation.map((link) => (
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
              {footerLinks.legal.map((link) => (
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
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-sm text-brand-300 hover:text-white transition-colors duration-[var(--duration-micro)] min-w-0"
                  >
                    {social.icon ? (
                      <social.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                    ) : (
                      <TikTokIcon className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span className="truncate">{social.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </FooterAccordionSection>

          <FooterAccordionSection title="Contact">
            <div className="space-y-2 font-sans text-sm text-brand-300">
              <p>Abidjan, Cocody</p>
              <p>Côte d&apos;Ivoire</p>
              <a href="tel:+2250749526194" className="block hover:text-white transition-colors">
                +225 07 49 52 61 94
              </a>
              <a
                href="mailto:contact@conseil-image-ariane.com"
                className="block hover:text-white transition-colors break-all"
              >
                contact@conseil-image-ariane.com
              </a>
            </div>
          </FooterAccordionSection>
        </div>

        <div className="mt-8 lg:mt-12 pt-5 lg:pt-6 border-t border-brand-800">
          <p className="text-xs text-brand-500">
            © {new Date().getFullYear()} Conseil en Image avec Ariane. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
