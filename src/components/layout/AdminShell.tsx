"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, X, LogOut, ExternalLink, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  filterAdminNavForRole,
  getAdminBreadcrumb,
  isAdminLinkActive,
  type AdminNavGroup,
} from "@/lib/admin-navigation";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { formatRole } from "@/lib/user-roles";

function SidebarNav({
  groups,
  pathname,
  onNavigate,
}: {
  groups: AdminNavGroup[];
  pathname: string;
  onNavigate: () => void;
}) {
  const mainGroups = groups.filter((g) => !g.calm);
  const calmGroups = groups.filter((g) => g.calm);

  return (
    <>
      {mainGroups.map((group) => (
        <div key={group.id} className="mb-5">
          {!group.hideLabel && group.label ? (
            <p className="px-3 mb-1.5 text-[10px] uppercase tracking-[0.14em] text-admin-muted font-medium">
              {group.label}
            </p>
          ) : null}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isAdminLinkActive(pathname, item.href, item.exact);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "block px-3 py-2 text-[13px] font-sans transition-colors border-l-2",
                      active
                        ? "border-accent text-admin-ink font-medium bg-transparent"
                        : "border-transparent text-admin-muted hover:text-admin-ink hover:bg-admin-bg"
                    )}
                    style={{ transitionDuration: "160ms" }}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {calmGroups.length > 0 && (
        <div className="mt-auto pt-4 border-t border-admin-line">
          {calmGroups.map((group) => (
            <div key={group.id} className="mb-2">
              <p className="px-3 mb-1 text-[10px] uppercase tracking-[0.14em] text-admin-muted/80">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isAdminLinkActive(pathname, item.href, item.exact);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                          "block px-3 py-1.5 text-xs font-sans transition-colors border-l-2",
                          active
                            ? "border-accent text-admin-ink font-medium"
                            : "border-transparent text-admin-muted hover:text-admin-ink"
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
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
    <div data-admin className="min-h-screen bg-admin-bg font-sans">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-admin-ink/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[244px] bg-admin-surface border-r border-admin-line transform transition-transform lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ transitionDuration: "240ms" }}
      >
        <div className="px-5 py-5 border-b border-admin-line">
          <Link href="/admin" className="block" onClick={() => setSidebarOpen(false)}>
            <span className="font-sans text-[15px] font-medium text-admin-ink tracking-tight">
              Conseil en Image
            </span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-admin-muted mt-0.5">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4 flex flex-col">
          <SidebarNav groups={navGroups} pathname={pathname} onNavigate={() => setSidebarOpen(false)} />
        </nav>

        <div className="px-4 py-3 border-t border-admin-line">
          <Link
            href="/"
            className="flex items-center gap-2 px-2 py-1.5 text-xs text-admin-muted hover:text-admin-ink transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            Voir le site public
          </Link>
        </div>
      </aside>

      <div className="lg:pl-[244px] min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-admin-surface border-b border-admin-line h-[52px]">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 text-admin-muted hover:text-admin-ink shrink-0"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <p className="text-xs text-admin-muted truncate">
                {breadcrumb.group ? (
                  <>
                    <span className="text-admin-ink">{breadcrumb.group}</span>
                    <span className="mx-1.5 text-admin-line">/</span>
                  </>
                ) : null}
                <span>{breadcrumb.page}</span>
              </p>
            </div>

            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-2 py-1 rounded-sm hover:bg-admin-bg transition-colors"
                aria-label="Menu compte"
                aria-expanded={userMenuOpen}
              >
                <ProfileAvatar
                  src={session?.user?.image}
                  firstName={nameParts[0]}
                  lastName={nameParts.slice(1).join(" ")}
                  size="sm"
                />
                <ChevronDown
                  className={cn("w-3.5 h-3.5 text-admin-muted transition-transform", userMenuOpen && "rotate-180")}
                />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-admin-surface border border-admin-line z-20 overflow-hidden shadow-sm">
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
                        className="block px-4 py-2 text-sm text-admin-ink hover:bg-admin-bg"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Guide
                      </Link>
                      <Link
                        href="/admin/parametres"
                        className="block px-4 py-2 text-sm text-admin-ink hover:bg-admin-bg"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Mon compte
                      </Link>
                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-accent hover:bg-admin-attention/50 text-left"
                      >
                        <LogOut className="w-4 h-4" strokeWidth={1.5} />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 max-w-[1400px]">{children}</main>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed top-3 right-3 z-[60] lg:hidden p-2 bg-admin-surface border border-admin-line text-admin-ink"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
