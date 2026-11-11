"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, Menu, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "home", name: "Accueil", href: "/admin", icon: Home, exact: true },
  { id: "orders", name: "Commandes", href: "/admin/commandes", icon: ShoppingCart },
  { id: "rdv", name: "RDV", href: "/admin/rendez-vous", icon: Calendar },
] as const;

function isTabActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminMobileBottomNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="admin-bottom-nav lg:hidden" aria-label="Navigation mobile">
      {TABS.map((tab) => {
        const active = isTabActive(pathname, tab.href, "exact" in tab ? tab.exact : false);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn("admin-bottom-nav-item", active && "admin-bottom-nav-item--active")}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="admin-bottom-nav-icon" strokeWidth={1.5} aria-hidden />
            <span>{tab.name}</span>
          </Link>
        );
      })}
      <button type="button" onClick={onOpenMenu} className="admin-bottom-nav-item">
        <Menu className="admin-bottom-nav-icon" strokeWidth={1.5} aria-hidden />
        <span>Menu</span>
      </button>
    </nav>
  );
}
