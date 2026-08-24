"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  Menu, X, LogOut, ExternalLink, Bell, ChevronDown, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminNav, isExpandableAdminSection, isCatalogueSection, isBlogSection, isPaymentsSection, isOffresSection, type AdminNavItem } from "@/lib/navigation";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";

function NavItem({
  item,
  pathname,
  onNavigate,
  depth = 0,
}: {
  item: AdminNavItem;
  pathname: string;
  onNavigate: () => void;
  depth?: number;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const isSectionActive = hasChildren
    ? item.href?.includes("/catalogue")
      ? isCatalogueSection(pathname)
      : item.href?.includes("/blog")
      ? isBlogSection(pathname)
      : item.href?.includes("/paiements")
      ? isPaymentsSection(pathname)
      : isOffresSection(pathname)
    : item.exact
    ? pathname === item.href
    : item.href
    ? pathname.startsWith(item.href)
    : false;

  const [expanded, setExpanded] = useState(isSectionActive);

  useEffect(() => {
    if (hasChildren && isExpandableAdminSection(pathname)) setExpanded(true);
  }, [pathname, hasChildren]);

  if (hasChildren) {
    return (
      <div>
        {item.href ? (
          <Link
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-sm text-sm transition-colors",
              isSectionActive
                ? "bg-white/10 text-white"
                : "text-brand-300 hover:text-white hover:bg-brand-900"
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
            <span className="flex-1">{item.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="p-1 hover:bg-white/10 rounded"
              aria-label={expanded ? "Réduire le menu" : "Développer le menu"}
            >
              <ChevronRight
                className={cn("w-4 h-4 transition-transform", expanded && "rotate-90")}
              />
            </button>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm transition-colors",
              isSectionActive
                ? "bg-white/10 text-white"
                : "text-brand-300 hover:text-white hover:bg-brand-900"
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
            <span className="flex-1 text-left">{item.name}</span>
            <ChevronRight
              className={cn("w-4 h-4 transition-transform", expanded && "rotate-90")}
            />
          </button>
        )}
        {expanded && (
          <div className="ml-4 mt-1 space-y-0.5 border-l border-brand-800 pl-2">
            <Link
              href={item.href!}
              onClick={onNavigate}
              className={cn(
                "block px-4 py-2.5 rounded-sm text-xs transition-colors",
                pathname === item.href
                  ? "bg-white/10 text-white"
                  : "text-brand-400 hover:text-white hover:bg-brand-900"
              )}
            >
              Vue d&apos;ensemble
            </Link>
            {item.children!.map((child) => {
              const childActive = pathname === child.href || pathname.startsWith(child.href + "/");
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onNavigate}
                  className={cn(
                    "block px-4 py-2.5 rounded-sm text-xs transition-colors",
                    childActive
                      ? "bg-white/10 text-white"
                      : "text-brand-400 hover:text-white hover:bg-brand-900"
                  )}
                >
                  {child.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (!item.href) return null;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-sm text-sm transition-colors",
        depth > 0 && "text-xs py-2.5",
        isSectionActive
          ? "bg-white/10 text-white"
          : "text-brand-300 hover:text-white hover:bg-brand-900"
      )}
    >
      <item.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
      {item.name}
    </Link>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const nameParts = (session?.user?.name || "Admin").split(" ");

  return (
    <div className="min-h-screen bg-brand-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-brand-950/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-brand-950 text-white transform transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-brand-800">
            <Link href="/admin" className="block" onClick={() => setSidebarOpen(false)}>
              <span className="font-display text-xl font-light tracking-wide">Conseil en Image</span>
              <span className="block text-[10px] uppercase tracking-ultra text-brand-400 mt-0.5">
                Administration
              </span>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {adminNav.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                pathname={pathname}
                onNavigate={() => setSidebarOpen(false)}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-brand-800">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-xs text-brand-400 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Voir le site public
            </Link>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 bg-white border-b border-brand-100 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-brand-600 hover:text-brand-950"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:block">
                <p className="text-xs uppercase tracking-widest text-brand-400">Back-office</p>
                <p className="text-sm font-medium text-brand-950">Espace administrateur</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 text-brand-400 hover:text-brand-700 relative" aria-label="Notifications">
                <Bell className="w-5 h-5" strokeWidth={1.5} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 pl-3 border-l border-brand-100"
                >
                  <ProfileAvatar
                    src={session?.user?.image}
                    firstName={nameParts[0]}
                    lastName={nameParts.slice(1).join(" ")}
                    size="sm"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-brand-950 leading-tight">
                      {session?.user?.name}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-brand-400">
                      Administrateur
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-brand-400 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-brand-100 shadow-lg z-20 py-1">
                      <Link
                        href="/admin/parametres"
                        className="block px-4 py-2 text-sm text-brand-700 hover:bg-brand-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Paramètres
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>

      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed top-4 right-4 z-[60] lg:hidden p-2 bg-brand-950 text-white rounded-full"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
