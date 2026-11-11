"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, X, LogOut, ExternalLink, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { clientNav } from "@/lib/navigation";
import { CLIENT_SPACE_COPY } from "@/lib/client-space-copy";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { formatRole } from "@/lib/user-roles";
import { ClientMobileBottomNav } from "@/components/layout/ClientMobileBottomNav";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const nameParts = (session?.user?.name || "Client").split(" ");

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="client-space-shell min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-brand-950/25 z-40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "client-sidebar fixed top-0 left-0 z-50 h-full w-72 transform transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-brand-300/40">
            <Link href="/mon-espace" onClick={closeSidebar}>
              <span className="font-display text-xl font-light tracking-wide text-brand-950">
                {CLIENT_SPACE_COPY.brandTitle}
              </span>
              <span className="block text-[10px] uppercase tracking-ultra text-brand-400 mt-0.5">
                {CLIENT_SPACE_COPY.brandSubtitle}
              </span>
            </Link>
          </div>

          <div className="client-sidebar-profile">
            <div className="flex items-center gap-3">
              <ProfileAvatar
                src={session?.user?.image}
                firstName={nameParts[0]}
                lastName={nameParts.slice(1).join(" ")}
                size="md"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-brand-950 truncate">{session?.user?.name}</p>
                <p className="text-xs text-brand-400 truncate">{session?.user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1 mt-2 font-sans">
            {clientNav.map((item) => {
              const isActive =
                item.href === "/mon-espace"
                  ? pathname === "/mon-espace"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={cn(
                    "client-sidebar-link",
                    isActive && "client-sidebar-link--active"
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-brand-300/40 space-y-2">
            <Link
              href="/boutique"
              onClick={closeSidebar}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-brand-300/60 text-brand-700 text-xs uppercase tracking-widest hover:border-accent/50 transition-colors"
            >
              Boutique
            </Link>
            <Link
              href="/offres"
              onClick={closeSidebar}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-accent text-white text-xs uppercase tracking-widest hover:opacity-95 transition-opacity"
            >
              Nouvelle prestation
            </Link>
            <Link
              href="/"
              onClick={closeSidebar}
              className="flex items-center gap-2 px-4 py-2 text-xs text-brand-400 hover:text-brand-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Retour au site
            </Link>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72 relative">
        <header className="client-topbar relative">
          <div className="lg:hidden grid grid-cols-[44px_1fr_44px] items-center gap-1 min-h-[64px] px-3 py-2">
            <button
              type="button"
              onClick={openSidebar}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-brand-700"
              aria-label="Menu latéral"
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <div className="flex flex-col items-center text-center min-w-0 px-1">
              <p className="font-display text-[13px] tracking-[0.12em] uppercase text-brand-950 truncate max-w-full">
                {CLIENT_SPACE_COPY.brandTitle}
              </p>
              <p className="text-[9px] text-brand-400 line-clamp-1">{CLIENT_SPACE_COPY.headerEyebrow}</p>
            </div>
            <UserMenuTrigger
              open={userMenuOpen}
              onToggle={() => setUserMenuOpen((v) => !v)}
              session={session}
              nameParts={nameParts}
              className="justify-self-end"
            />
          </div>

          <div className="hidden lg:flex items-center justify-between h-14 px-8">
            <p className="text-sm font-medium text-brand-950 truncate">{CLIENT_SPACE_COPY.headerTitle}</p>
            <UserMenuTrigger
              open={userMenuOpen}
              onToggle={() => setUserMenuOpen((v) => !v)}
              session={session}
              nameParts={nameParts}
              showChevron
            />
          </div>
        </header>

        {userMenuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} aria-hidden />
            <UserMenuDropdown
              className="fixed z-20 w-56 right-3 top-[calc(64px+env(safe-area-inset-top,0px))] lg:absolute lg:right-8 lg:top-14"
              session={session}
              onClose={() => setUserMenuOpen(false)}
            />
          </>
        )}

        <main className="client-main max-w-6xl mx-auto">{children}</main>
      </div>

      <ClientMobileBottomNav onOpenMenu={openSidebar} />

      {sidebarOpen && (
        <button
          type="button"
          onClick={closeSidebar}
          className="fixed top-4 right-4 z-[60] lg:hidden p-2 bg-accent text-white rounded-full shadow-md"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

function UserMenuTrigger({
  open,
  onToggle,
  session,
  nameParts,
  className,
  showChevron,
}: {
  open: boolean;
  onToggle: () => void;
  session: ReturnType<typeof useSession>["data"];
  nameParts: string[];
  className?: string;
  showChevron?: boolean;
}) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-brand-100 transition-all"
        aria-label="Menu compte"
        aria-expanded={open}
      >
        <ProfileAvatar
          src={session?.user?.image}
          firstName={nameParts[0]}
          lastName={nameParts.slice(1).join(" ")}
          size="sm"
        />
        {showChevron && (
          <ChevronDown
            className={cn("w-3.5 h-3.5 text-brand-400 transition-transform", open && "rotate-180")}
          />
        )}
      </button>
    </div>
  );
}

function UserMenuDropdown({
  className,
  session,
  onClose,
}: {
  className?: string;
  session: ReturnType<typeof useSession>["data"];
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "bg-white border border-brand-300/50 rounded-2xl shadow-lg overflow-hidden",
        className
      )}
    >
      <div className="px-4 py-3 border-b border-brand-100 bg-brand-50/50">
        <p className="text-sm font-medium text-brand-950 leading-tight truncate">{session?.user?.name}</p>
        {session?.user?.email && (
          <p className="text-xs text-brand-500 truncate mt-0.5">{session.user.email}</p>
        )}
        {session?.user?.role && (
          <p className="text-[10px] uppercase tracking-wide text-brand-400 mt-1.5">
            {formatRole(session.user.role)}
          </p>
        )}
      </div>
      <div className="py-1">
        <Link
          href="/mon-espace/profil"
          className="block px-4 py-2 text-sm text-brand-700 hover:bg-brand-50"
          onClick={onClose}
        >
          Mon profil
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
