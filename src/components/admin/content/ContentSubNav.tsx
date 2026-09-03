import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "accueil", label: "Accueil", href: "/admin/contenu/accueil" },
  { id: "site", label: "Nav & footer", href: "/admin/contenu/site" },
  { id: "apropos", label: "À propos", href: "/admin/contenu/a-propos" },
  { id: "prestations", label: "Prestations", href: "/admin/contenu/prestations" },
  { id: "orientation", label: "Orientation", href: "/admin/contenu/orientation" },
  { id: "blog", label: "Blog", href: "/admin/contenu/blog" },
  { id: "faq", label: "FAQ", href: "/admin/contenu/faq" },
  { id: "contact", label: "Contact", href: "/admin/contenu/contact" },
  { id: "legal", label: "Pages légales", href: "/admin/contenu/legal" },
] as const;

export function ContentSubNav({ active }: { active: (typeof tabs)[number]["id"] }) {
  return (
    <nav className="flex flex-wrap gap-x-1 gap-y-1 border-b border-brand-100 pb-1 mb-8">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={cn(
            "px-3 py-2 text-[10px] sm:text-xs uppercase tracking-widest transition-colors border-b-2 -mb-px",
            active === tab.id
              ? "border-brand-950 text-brand-950 font-medium"
              : "border-transparent text-brand-400 hover:text-brand-700"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
