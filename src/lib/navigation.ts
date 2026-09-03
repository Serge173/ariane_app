import {
  LayoutDashboard,
  Package,
  Users,
  Calendar,
  CreditCard,
  BarChart3,
  FileText,
  Settings,
  Mail,
  Star,
  ClipboardList,
  FolderOpen,
  UserCircle,
  ShoppingBag,
  BookOpen,
  PenLine,
  type LucideIcon,
} from "lucide-react";

export const clientNav = [
  { name: "Tableau de bord", href: "/mon-espace", icon: LayoutDashboard },
  { name: "Mes commandes", href: "/mon-espace/commandes", icon: ShoppingBag },
  { name: "Mes rendez-vous", href: "/mon-espace/rendez-vous", icon: Calendar },
  { name: "Questionnaires", href: "/mon-espace/questionnaire", icon: ClipboardList },
  { name: "Mes documents", href: "/mon-espace/documents", icon: FolderOpen },
  { name: "Mon profil", href: "/mon-espace/profil", icon: UserCircle },
];

export interface AdminNavChild {
  name: string;
  href: string;
}

export interface AdminNavItem {
  name: string;
  href?: string;
  icon: LucideIcon;
  exact?: boolean;
  children?: AdminNavChild[];
}

export const adminNav: AdminNavItem[] = [
  { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Commandes", href: "/admin/commandes", icon: CreditCard },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Rendez-vous", href: "/admin/rendez-vous", icon: Calendar },
  {
    name: "Contenu site",
    href: "/admin/contenu",
    icon: PenLine,
    children: [
      { name: "Page d'accueil", href: "/admin/contenu/accueil" },
      { name: "Navigation & footer", href: "/admin/contenu/site" },
      { name: "À propos", href: "/admin/contenu/a-propos" },
      { name: "Prestations", href: "/admin/contenu/prestations" },
      { name: "Orientation", href: "/admin/contenu/orientation" },
      { name: "Blog", href: "/admin/contenu/blog" },
      { name: "FAQ", href: "/admin/contenu/faq" },
      { name: "Contact", href: "/admin/contenu/contact" },
      { name: "Pages légales", href: "/admin/contenu/legal" },
    ],
  },
  {
    name: "Catalogue boutique",
    href: "/admin/catalogue",
    icon: ShoppingBag,
    children: [
      { name: "Tous les produits", href: "/admin/catalogue/produits" },
      { name: "Catégories", href: "/admin/catalogue/categories" },
      { name: "Marques", href: "/admin/catalogue/marques" },
      { name: "Page boutique", href: "/admin/catalogue/boutique" },
    ],
  },
  {
    name: "Prestations & Produits",
    href: "/admin/offres",
    icon: Package,
    children: [
      { name: "Accompagnements coaching", href: "/admin/offres/accompagnements" },
      { name: "Articles de luxe", href: "/admin/offres/luxe" },
    ],
  },
  {
    name: "Paiements",
    href: "/admin/paiements",
    icon: CreditCard,
    children: [
      { name: "Modes de paiement", href: "/admin/paiements/modes" },
      { name: "Transactions", href: "/admin/paiements/transactions" },
    ],
  },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "Avis clients", href: "/admin/avis", icon: Star },
  {
    name: "Blog",
    href: "/admin/blog",
    icon: FileText,
    children: [
      { name: "Articles", href: "/admin/blog/articles" },
    ],
  },
  { name: "Statistiques", href: "/admin/statistiques", icon: BarChart3 },
  { name: "Guide", href: "/admin/guide", icon: BookOpen, exact: true },
  { name: "Paramètres", href: "/admin/parametres", icon: Settings },
];

export const publicNav = [
  { name: "Accueil", href: "/" },
  { name: "Nos prestations", href: "/offres" },
  { name: "Orientation", href: "/orientation" },
  { name: "À propos", href: "/a-propos" },
  { name: "Blog", href: "/blog" },
  { name: "Boutique", href: "/boutique", highlight: true },
];

export function getDashboardPath(role?: string): string {
  if (["ADMIN", "SUPER_ADMIN", "MANAGER_SHOP", "MANAGER_ORDERS", "ACCOUNTING"].includes(role ?? "")) {
    return "/admin";
  }
  return "/mon-espace";
}

export function isOffresSection(pathname: string): boolean {
  return pathname.startsWith("/admin/offres");
}

export function isCatalogueSection(pathname: string): boolean {
  return pathname.startsWith("/admin/catalogue");
}

export function isBlogSection(pathname: string): boolean {
  return pathname.startsWith("/admin/blog");
}

export function isPaymentsSection(pathname: string): boolean {
  return pathname.startsWith("/admin/paiements");
}

export function isContentSection(pathname: string): boolean {
  return pathname.startsWith("/admin/contenu");
}

export function isExpandableAdminSection(pathname: string): boolean {
  return (
    isOffresSection(pathname) ||
    isCatalogueSection(pathname) ||
    isBlogSection(pathname) ||
    isPaymentsSection(pathname) ||
    isContentSection(pathname)
  );
}
