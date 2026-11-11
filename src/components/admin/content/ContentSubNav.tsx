import Link from "next/link";
import { cn } from "@/lib/utils";
import { ADMIN_CONTENT_TABS, type AdminContentTabId } from "@/lib/admin-content-nav";

export function ContentSubNav({ active }: { active: AdminContentTabId }) {
  return (
    <div className="-mx-1 mb-8">
      <p className="px-1 mb-1 text-[10px] uppercase tracking-widest text-brand-400 lg:hidden">
        Faites défiler pour voir toutes les pages →
      </p>
      <nav
        className="admin-subnav flex gap-1 overflow-x-auto scrollbar-hide pb-1 px-1 snap-x snap-mandatory"
        aria-label="Pages de contenu"
      >
        {ADMIN_CONTENT_TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "admin-subnav-link snap-start shrink-0 whitespace-nowrap",
              active === tab.id && "admin-subnav-link--active"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
