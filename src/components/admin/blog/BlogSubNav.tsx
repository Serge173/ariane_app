import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "hub", label: "Tableau", href: "/admin/blog" },
  { id: "articles", label: "Articles", href: "/admin/blog/articles" },
] as const;

export function BlogSubNav({ active }: { active: (typeof tabs)[number]["id"] }) {
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
