import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Calendar,
  CreditCard,
  Tag,
  Layers,
  Award,
  Briefcase,
  Store,
  FileText,
  Newspaper,
  MessageCircleQuestion,
  Scale,
  List,
  Mail,
  Megaphone,
  Star,
  BarChart3,
  BookOpen,
  Settings,
  type LucideIcon,
} from "lucide-react";

const BY_HREF: Record<string, LucideIcon> = {
  "/admin": LayoutDashboard,
  "/admin/commandes": ShoppingCart,
  "/admin/clients": Users,
  "/admin/rendez-vous": Calendar,
  "/admin/paiements/modes": CreditCard,
  "/admin/catalogue/produits": Tag,
  "/admin/catalogue/categories": Layers,
  "/admin/catalogue/marques": Award,
  "/admin/offres/accompagnements": Briefcase,
  "/admin/catalogue/boutique": Store,
  "/admin/contenu/accueil": FileText,
  "/admin/blog/articles": Newspaper,
  "/admin/contenu/faq": MessageCircleQuestion,
  "/admin/contenu/legal": Scale,
  "/admin/contenu/site": List,
  "/admin/messages": Mail,
  "/admin/newsletter": Megaphone,
  "/admin/avis": Star,
  "/admin/statistiques": BarChart3,
  "/admin/guide": BookOpen,
  "/admin/parametres": Settings,
};

export function getAdminNavIcon(href: string): LucideIcon {
  if (BY_HREF[href]) return BY_HREF[href];
  if (href.startsWith("/admin/contenu")) return FileText;
  if (href.startsWith("/admin/catalogue")) return Tag;
  if (href.startsWith("/admin/offres")) return Briefcase;
  if (href.startsWith("/admin/paiements")) return CreditCard;
  return FileText;
}
