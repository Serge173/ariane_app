"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, Menu, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "home", name: "Accueil", href: "/mon-espace", icon: LayoutDashboard, exact: true },
  { id: "orders", name: "Commandes", href: "/mon-espace/commandes", icon: ShoppingBag },
  { id: "rdv", name: "RDV", href: "/mon-espace/rendez-vous", icon: Calendar },
] as const;

function isTabActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ClientMobileBottomNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="client-bottom-nav lg:hidden" aria-label="Navigation espace client">
      {TABS.map((tab) => {
        const active = isTabActive(pathname, tab.href, "exact" in tab ? tab.exact : false);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn("client-bottom-nav-item", active && "client-bottom-nav-item--active")}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="client-bottom-nav-icon" strokeWidth={1.5} aria-hidden />
            <span>{tab.name}</span>
          </Link>
        );
      })}
      <button type="button" onClick={onOpenMenu} className="client-bottom-nav-item">
        <Menu className="client-bottom-nav-icon" strokeWidth={1.5} aria-hidden />
        <span>Menu</span>
      </button>
    </nav>
  );
}
