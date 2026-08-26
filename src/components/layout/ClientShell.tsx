"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  Menu, X, LogOut, ExternalLink, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clientNav } from "@/lib/navigation";
import { CLIENT_SPACE_COPY } from "@/lib/client-space-copy";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const nameParts = (session?.user?.name || "Client").split(" ");

  return (
    <div className="min-h-screen bg-surface">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-brand-950/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-brand-100 transform transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-brand-100">
            <Link href="/mon-espace" onClick={() => setSidebarOpen(false)}>
              <span className="font-display text-xl font-light tracking-wide text-brand-950">
                {CLIENT_SPACE_COPY.brandTitle}
              </span>
              <span className="block text-[10px] uppercase tracking-ultra text-brand-400 mt-0.5">
                {CLIENT_SPACE_COPY.brandSubtitle}
              </span>
            </Link>
          </div>

          {/* Profile card in sidebar */}
          <div className="p-4 mx-4 mt-4 bg-brand-50 border border-brand-100">
            <div className="flex items-center gap-3">
              <ProfileAvatar
                src={session?.user?.image}
                firstName={nameParts[0]}
                lastName={nameParts.slice(1).join(" ")}
                size="md"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-brand-950 truncate">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-brand-400 truncate">{session?.user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1 mt-2">
            {clientNav.map((item) => {
              const isActive =
                item.href === "/mon-espace"
                  ? pathname === "/mon-espace"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                    isActive
                      ? "bg-brand-950 text-white"
                      : "text-brand-600 hover:text-brand-950 hover:bg-brand-50"
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-brand-100 space-y-2">
            <Link
              href="/boutique"
              className="flex items-center gap-2 px-4 py-2.5 border border-brand-200 text-brand-700 text-xs uppercase tracking-widest hover:border-brand-400 transition-colors"
            >
              Boutique
            </Link>
            <Link
              href="/offres"
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-950 text-white text-xs uppercase tracking-widest hover:bg-brand-800 transition-colors"
            >
              Nouvelle prestation
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-xs text-brand-400 hover:text-brand-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Retour au site
            </Link>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-brand-100">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-brand-600"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-widest text-brand-400">{CLIENT_SPACE_COPY.headerEyebrow}</p>
                <p className="text-sm font-medium text-brand-950">{CLIENT_SPACE_COPY.headerTitle}</p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2"
              >
                <ProfileAvatar
                  src={session?.user?.image}
                  firstName={nameParts[0]}
                  lastName={nameParts.slice(1).join(" ")}
                  size="sm"
                />
                <ChevronDown className="w-4 h-4 text-brand-400 hidden sm:block" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-brand-100 shadow-lg z-20 py-1">
                    <Link
                      href="/mon-espace/profil"
                      className="block px-4 py-2 text-sm text-brand-700 hover:bg-brand-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Mon profil
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
