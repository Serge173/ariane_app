"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  Menu,
  X,
  LogOut,
  Home,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  filterAdminNavForRole,
  getAdminBreadcrumb,
  isAdminLinkActive,
  type AdminNavGroup,
} from "@/lib/admin-navigation";
import { getAdminNavIcon } from "@/lib/admin-nav-icons";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { formatRole } from "@/lib/user-roles";
import { AdminMobileBottomNav } from "@/components/layout/AdminMobileBottomNav";

const ADMIN_BRAND = "ARIANE DAGO";
const ADMIN_TAGLINE = "Bienvenue dans l'univers de la découverte de soi";

function SidebarNav({
  groups,
  pathname,
  onNavigate,
}: {
  groups: AdminNavGroup[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <>
      {groups.map((group) => (
        <div key={group.id} className="admin-sidebar-group">
          <p className="admin-sidebar-group-label">{group.label}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isAdminLinkActive(pathname, item.href, item.exact);
              const Icon = getAdminNavIcon(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn("admin-sidebar-link", active && "admin-sidebar-link--active")}
                  >
                    <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} aria-hidden />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navGroups = filterAdminNavForRole(session?.user?.role);
  const breadcrumb = getAdminBreadcrumb(pathname);
  const nameParts = (session?.user?.name || "Admin").split(" ");

  return (
    <div data-admin className="admin-root min-h-screen font-sans">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-admin-ink/25 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "admin-sidebar fixed top-0 left-0 z-50 h-full flex flex-col transform transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="admin-sidebar-brand px-5 pt-6 pb-5 border-b border-admin-line">
          <Link href="/admin" className="block" onClick={() => setSidebarOpen(false)}>
            <span className="font-display text-[1.35rem] font-light tracking-wide text-admin-ink leading-none">
              {ADMIN_BRAND}
            </span>
            <span className="block font-display text-[11px] italic text-admin-muted mt-2 leading-snug">
              {ADMIN_TAGLINE}
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <SidebarNav
            groups={navGroups}
            pathname={pathname}
            onNavigate={() => setSidebarOpen(false)}
          />
        </nav>
      </aside>

      <div className="admin-main-column lg:pl-[272px] min-h-screen flex flex-col">
        <header className="admin-topbar admin-topbar-shell sticky top-0 z-30">
          <div className="admin-mobile-topbar lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="admin-mobile-topbar-btn"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-[22px] h-[22px]" strokeWidth={1.5} />
            </button>

            <Link
              href="/admin"
              className="admin-mobile-brand"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-mobile-brand-name">{ADMIN_BRAND}</span>
              <span className="admin-mobile-brand-tagline">{ADMIN_TAGLINE}</span>
            </Link>

            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="admin-mobile-topbar-avatar"
              aria-label="Menu compte"
              aria-expanded={userMenuOpen}
            >
              <ProfileAvatar
                src={session?.user?.image}
                firstName={nameParts[0]}
                lastName={nameParts.slice(1).join(" ")}
                size="sm"
                className="!bg-[var(--admin-accent)] !text-white !ring-2 !ring-[var(--admin-accent)]"
              />
            </button>
          </div>

          <div className="hidden lg:flex items-center justify-between h-[56px] px-8 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <nav className="admin-breadcrumb flex items-center gap-1.5 text-xs min-w-0" aria-label="Fil d'Ariane">
                <Link href="/admin" className="admin-breadcrumb-home p-1 -ml-1 text-admin-muted hover:text-admin-accent">
                  <Home className="w-4 h-4" strokeWidth={1.5} />
                  <span className="sr-only">Tableau de bord</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-admin-line shrink-0" aria-hidden />
                <span className="text-admin-muted truncate">{breadcrumb.group}</span>
                <ChevronRight className="w-3.5 h-3.5 text-admin-line shrink-0" aria-hidden />
                <span className="text-admin-accent font-medium truncate">{breadcrumb.page}</span>
              </nav>
            </div>

            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-1 py-1 rounded-full hover:opacity-90 transition-opacity"
                aria-label="Menu compte"
                aria-expanded={userMenuOpen}
              >
                <ProfileAvatar
                  src={session?.user?.image}
                  firstName={nameParts[0]}
                  lastName={nameParts.slice(1).join(" ")}
                  size="sm"
                  className="!bg-[var(--admin-accent)] !text-white !ring-[var(--admin-accent)]"
                />
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-admin-muted transition-transform",
                    userMenuOpen && "rotate-180"
                  )}
                />
              </button>
            </div>
          </div>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-[45]" onClick={() => setUserMenuOpen(false)} aria-hidden />
              <div className="admin-user-menu admin-dropdown z-[46]">
                <div className="px-4 py-3 border-b border-admin-line">
                  <p className="text-sm font-medium text-admin-ink truncate">{session?.user?.name}</p>
                  {session?.user?.email && (
                    <p className="text-xs text-admin-muted truncate mt-0.5">{session.user.email}</p>
                  )}
                  {session?.user?.role && (
                    <p className="text-[10px] uppercase tracking-wide text-admin-muted mt-1.5">
                      {formatRole(session.user.role)}
                    </p>
                  )}
                </div>
                <div className="py-1">
                  <Link
                    href="/admin/guide"
                    className="block px-4 py-2 text-sm text-admin-ink hover:bg-admin-shell-bg"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Guide
                  </Link>
                  <Link
                    href="/admin/parametres"
                    className="block px-4 py-2 text-sm text-admin-ink hover:bg-admin-shell-bg"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Mon compte
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-admin-accent hover:bg-admin-attention text-left"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    Déconnexion
                  </button>
                </div>
              </div>
            </>
          )}
        </header>

        <main className="admin-main flex-1 px-4 lg:px-8 pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))] lg:pb-12 max-w-[1280px] w-full mx-auto">
          {children}
        </main>
      </div>

      <AdminMobileBottomNav onOpenMenu={() => setSidebarOpen(true)} />

      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed top-3 right-3 z-[60] lg:hidden p-2 admin-topbar border border-admin-line"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
