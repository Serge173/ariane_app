import Link from "next/link";
import { Instagram, Facebook, Linkedin, ExternalLink, ChevronDown } from "lucide-react";

const footerLinks = {
  navigation: [
    { name: "Accueil", href: "/" },
    { name: "Nos prestations", href: "/offres" },
    { name: "Orientation", href: "/orientation" },
    { name: "À propos", href: "/a-propos" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
    { name: "Ma boutique", href: "/boutique" },
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

function FooterDropdown({
  title,
  children,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="relative group/drop">
      <button
        type="button"
        className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-wide font-medium text-brand-400 hover:text-white group-hover/drop:text-white group-focus-within/drop:text-white transition-colors py-1"
        aria-haspopup="true"
      >
        {title}
        <ChevronDown
          className="w-3.5 h-3.5 text-brand-500 transition-transform duration-200 group-hover/drop:rotate-180 group-focus-within/drop:rotate-180"
          strokeWidth={1.5}
        />
      </button>

      <div
        className={`absolute bottom-full left-0 z-50 pb-2 min-w-[180px] ${wide ? "w-64" : ""}
          opacity-0 invisible translate-y-2 pointer-events-none
          group-hover/drop:opacity-100 group-hover/drop:visible group-hover/drop:translate-y-0 group-hover/drop:pointer-events-auto
          group-focus-within/drop:opacity-100 group-focus-within/drop:visible group-focus-within/drop:translate-y-0 group-focus-within/drop:pointer-events-auto
          transition-all duration-200 ease-out`}
        role="menu"
      >
        <div className="py-3 px-4 bg-brand-900 border border-brand-700 shadow-xl shadow-black/30">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-brand-950 text-brand-200 mt-auto">
      <div className="container-premium py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-light text-white tracking-wide">
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

          <div className="lg:col-span-5 flex flex-wrap gap-x-8 gap-y-3 items-center">
            <FooterDropdown title="Navigation">
              <ul className="space-y-2" role="none">
                {footerLinks.navigation.map((link) => (
                  <li key={link.href} role="none">
                    <Link
                      href={link.href}
                      role="menuitem"
                      className="block font-sans text-sm text-brand-300 hover:text-white transition-colors whitespace-nowrap"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterDropdown>

            <FooterDropdown title="Informations">
              <ul className="space-y-2" role="none">
                {footerLinks.legal.map((link) => (
                  <li key={link.href} role="none">
                    <Link
                      href={link.href}
                      role="menuitem"
                      className="block font-sans text-sm text-brand-300 hover:text-white transition-colors whitespace-nowrap"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterDropdown>

            <FooterDropdown title="Réseaux sociaux" wide>
              <ul className="space-y-3" role="none">
                {socialLinks.map((social) => (
                  <li key={social.name} role="none">
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
                      className="group/social flex items-start gap-2.5 text-sm text-brand-300 hover:text-white transition-colors"
                    >
                      <span className="mt-0.5 flex-shrink-0 text-brand-400 group-hover/social:text-white transition-colors">
                        {social.icon ? (
                          <social.icon className="w-4 h-4" strokeWidth={1.5} />
                        ) : (
                          <TikTokIcon className="w-4 h-4" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium">{social.name}</span>
                        <span className="block text-xs text-brand-500 group-hover/social:text-brand-300 transition-colors truncate">
                          {social.label}
                        </span>
                      </span>
                      <ExternalLink className="w-3 h-3 mt-1 opacity-0 group-hover/social:opacity-100 transition-opacity flex-shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </FooterDropdown>
          </div>

          <div className="lg:col-span-3">
          <h3 className="font-sans text-xs uppercase tracking-wide font-medium text-brand-400 mb-3">Contact</h3>
            <div className="space-y-1.5 font-sans text-sm text-brand-300">
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
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand-800">
          <p className="text-xs text-brand-500 text-center sm:text-left">
            © {new Date().getFullYear()} Conseil en Image avec Ariane. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
