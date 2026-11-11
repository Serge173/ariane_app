/** Onglets édition contenu — source unique pour le sous-menu et l’admin. */
export const ADMIN_CONTENT_TABS = [
  { id: "accueil", label: "Accueil", href: "/admin/contenu/accueil" },
  { id: "site", label: "Nav & footer", href: "/admin/contenu/site" },
  { id: "apropos", label: "À propos", href: "/admin/contenu/a-propos" },
  { id: "prestations", label: "Prestations", href: "/admin/contenu/prestations" },
  { id: "orientation", label: "Orientation", href: "/admin/contenu/orientation" },
  { id: "parcours", label: "Parcours découverte", href: "/admin/contenu/parcours-decouverte" },
  { id: "blog", label: "Blog", href: "/admin/contenu/blog" },
  { id: "faq", label: "FAQ", href: "/admin/contenu/faq" },
  { id: "contact", label: "Contact", href: "/admin/contenu/contact" },
  { id: "legal", label: "Pages légales", href: "/admin/contenu/legal" },
] as const;

export type AdminContentTabId = (typeof ADMIN_CONTENT_TABS)[number]["id"];
