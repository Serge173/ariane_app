import type { UserRole } from "@prisma/client";

export interface AdminNavLink {
  name: string;
  href: string;
  exact?: boolean;
}

export interface AdminNavGroup {
  id: string;
  label: string;
  items: AdminNavLink[];
  /** Masquer le titre de section (ex. tableau de bord seul en tête) */
  hideLabel?: boolean;
  /** Groupe calme en bas (Stats, Guide, Paramètres) */
  calm?: boolean;
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    id: "today",
    label: "Aujourd'hui",
    hideLabel: true,
    items: [{ name: "Tableau de bord", href: "/admin", exact: true }],
  },
  {
    id: "commerce",
    label: "Commerce",
    items: [
      { name: "Commandes", href: "/admin/commandes" },
      { name: "Clients", href: "/admin/clients" },
      { name: "Rendez-vous", href: "/admin/rendez-vous" },
      { name: "Paiements", href: "/admin/paiements/modes" },
    ],
  },
  {
    id: "offre",
    label: "Offre",
    items: [
      { name: "Produits", href: "/admin/catalogue/produits" },
      { name: "Catégories", href: "/admin/catalogue/categories" },
      { name: "Marques", href: "/admin/catalogue/marques" },
      { name: "Prestations", href: "/admin/offres/accompagnements" },
      { name: "Page boutique", href: "/admin/catalogue/boutique" },
    ],
  },
  {
    id: "contenu",
    label: "Contenu",
    items: [
      { name: "Pages site", href: "/admin/contenu/accueil" },
      { name: "Articles blog", href: "/admin/blog/articles" },
      { name: "FAQ", href: "/admin/contenu/faq" },
      { name: "Pages légales", href: "/admin/contenu/legal" },
      { name: "Navigation", href: "/admin/contenu/site" },
    ],
  },
  {
    id: "relation",
    label: "Relation",
    items: [
      { name: "Messages", href: "/admin/messages" },
      { name: "Avis clients", href: "/admin/avis" },
    ],
  },
  {
    id: "system",
    label: "Système",
    calm: true,
    items: [
      { name: "Statistiques", href: "/admin/statistiques" },
      { name: "Guide", href: "/admin/guide", exact: true },
      { name: "Paramètres", href: "/admin/parametres" },
    ],
  },
];

const CONTENT_PATHS = ["/admin/contenu", "/admin/blog"];
const OFFRE_PATHS = ["/admin/catalogue", "/admin/offres"];
const COMMERCE_PATHS = ["/admin/commandes", "/admin/clients", "/admin/rendez-vous", "/admin/paiements"];

export function isAdminLinkActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  if (href === "/admin/contenu/accueil") return pathname.startsWith("/admin/contenu");
  if (href === "/admin/blog/articles") return pathname.startsWith("/admin/blog");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function filterAdminNavForRole(role?: string): AdminNavGroup[] {
  const r = role as UserRole | undefined;

  if (r === "ACCOUNTING") {
    return adminNavGroups
      .filter((g) => g.id === "today" || g.id === "commerce" || g.id === "system")
      .map((g) => {
        if (g.id !== "commerce") return g;
        return {
          ...g,
          items: g.items.filter(
            (i) => i.href.includes("/paiements") || i.href.includes("/commandes")
          ),
        };
      })
      .filter((g) => g.items.length > 0);
  }

  if (r === "MANAGER_SHOP") {
    return adminNavGroups.filter((g) =>
      ["today", "offre", "contenu", "relation", "system"].includes(g.id)
    );
  }

  if (r === "MANAGER_ORDERS") {
    return adminNavGroups.filter((g) =>
      ["today", "commerce", "relation", "system"].includes(g.id)
    );
  }

  return adminNavGroups;
}

const BREADCRUMB_LABELS: Record<string, string> = {
  commandes: "Commandes",
  clients: "Clients",
  "rendez-vous": "Rendez-vous",
  paiements: "Paiements",
  catalogue: "Offre",
  offres: "Offre",
  contenu: "Contenu",
  blog: "Contenu",
  messages: "Messages",
  avis: "Avis",
  statistiques: "Statistiques",
  guide: "Guide",
  parametres: "Paramètres",
};

export function getAdminBreadcrumb(pathname: string): { group: string; page: string } {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1 || pathname === "/admin") {
    return { group: "", page: "Tableau de bord" };
  }

  const section = segments[1] ?? "admin";
  const group =
    COMMERCE_PATHS.some((p) => pathname.startsWith(p))
      ? "Commerce"
      : OFFRE_PATHS.some((p) => pathname.startsWith(p))
      ? "Offre"
      : CONTENT_PATHS.some((p) => pathname.startsWith(p))
      ? "Contenu"
      : section === "messages" || section === "avis"
      ? "Relation"
      : ["statistiques", "guide", "parametres"].includes(section)
      ? "Système"
      : "Admin";

  const page =
    segments.length > 2 && section === "commandes" && segments[2] !== "nouveau"
      ? `Commande`
      : BREADCRUMB_LABELS[section] ?? section;

  return { group, page };
}
