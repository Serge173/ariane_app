import Link from "next/link";
import { ChevronRight, Tag, FileText, Mail, BookOpen } from "lucide-react";

const links = [
  { name: "Produits", href: "/admin/catalogue/produits", icon: Tag },
  { name: "Pages site", href: "/admin/contenu/accueil", icon: FileText },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "Guide", href: "/admin/guide", icon: BookOpen },
] as const;

export function AdminQuickAccess() {
  return (
    <aside className="admin-quick-access">
      <h2 className="admin-quick-access-title">Accès rapides</h2>
      <ul className="space-y-2">
        {links.map(({ name, href, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className="admin-quick-access-link">
              <Icon className="w-5 h-5 text-admin-accent shrink-0" strokeWidth={1.5} aria-hidden />
              <span className="flex-1 text-left">{name}</span>
              <ChevronRight className="w-4 h-4 text-admin-muted" strokeWidth={1.5} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
