import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "hub", label: "Tableau catalogue boutique", href: "/admin/catalogue" },
  { id: "products", label: "Produits", href: "/admin/catalogue/produits" },
  { id: "categories", label: "Catégories", href: "/admin/catalogue/categories" },
  { id: "brands", label: "Marques", href: "/admin/catalogue/marques" },
  { id: "boutique", label: "Page boutique", href: "/admin/catalogue/boutique" },
] as const;

export function CatalogueSubNav({ active }: { active: (typeof tabs)[number]["id"] }) {
  return (
    <nav className="admin-subnav admin-subnav--wrap flex flex-wrap gap-2 pb-1 mb-8">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={cn(
            "admin-subnav-link",
            active === tab.id && "admin-subnav-link--active"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
