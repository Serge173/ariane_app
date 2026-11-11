import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "hub", label: "Tableau", href: "/admin/offres" },
  { id: "coaching", label: "Accompagnements coaching", href: "/admin/offres/accompagnements" },
  { id: "luxe", label: "Articles de luxe", href: "/admin/offres/luxe" },
] as const;

export function AdminOffresSubNav({ active }: { active: "hub" | "coaching" | "luxe" }) {
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
