import Link from "next/link";
import prisma from "@/lib/prisma";
import { CatalogueSubNav } from "@/components/admin/catalogue/CatalogueSubNav";
import { Package, Tags, Award, Plus, ArrowRight } from "lucide-react";

export default async function CatalogueHubPage() {
  let stats = {
    products: 0,
    luxe: 0,
    service: 0,
    categories: 0,
    brands: 0,
    inactive: 0,
  };

  try {
    const [products, luxe, service, categories, brands, inactive] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { productType: "LUXE" } }),
      prisma.product.count({ where: { productType: "SERVICE" } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.brand.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: false } }),
    ]);
    stats = { products, luxe, service, categories, brands, inactive };
  } catch {}

  const cards = [
    {
      href: "/admin/catalogue/produits",
      icon: Package,
      title: "Produits",
      value: stats.products,
      desc: `${stats.luxe} luxe · ${stats.service} coaching`,
    },
    {
      href: "/admin/catalogue/categories",
      icon: Tags,
      title: "Catégories",
      value: stats.categories,
      desc: "Familles du catalogue",
    },
    {
      href: "/admin/catalogue/marques",
      icon: Award,
      title: "Marques",
      value: stats.brands,
      desc: "Maisons & labels",
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="heading-section mb-2">Catalogue e-commerce</h1>
          <p className="text-brand-600">
            Gérez produits, catégories et marques — votre boutique complète
          </p>
        </div>
        <Link
          href="/admin/catalogue/produits/nouveau"
          className="btn-primary inline-flex items-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          Ajouter un produit
        </Link>
      </div>

      <CatalogueSubNav active="hub" />

      <div className="grid sm:grid-cols-3 gap-6 mt-8">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group p-6 bg-white border border-brand-100 hover:border-brand-950 hover:shadow-md transition-all"
          >
            <card.icon className="w-7 h-7 text-accent mb-4" strokeWidth={1.5} />
            <p className="text-3xl font-light mb-1">{card.value}</p>
            <h2 className="font-display text-lg mb-1 group-hover:text-accent transition-colors">
              {card.title}
            </h2>
            <p className="text-sm text-brand-500">{card.desc}</p>
          </Link>
        ))}
      </div>

      {stats.inactive > 0 && (
        <p className="mt-6 text-sm text-amber-700 bg-amber-50 border border-amber-100 p-4">
          {stats.inactive} produit(s) inactif(s) — consultez la liste produits pour les réactiver.
        </p>
      )}

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/admin/catalogue/boutique"
          className="flex items-center justify-between p-5 border border-brand-200 text-sm hover:border-brand-950 transition-colors group"
        >
          Page boutique (mise en avant)
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/admin/catalogue/produits?type=LUXE"
          className="flex items-center justify-between p-5 bg-brand-950 text-white text-sm hover:bg-brand-800 transition-colors group"
        >
          Gérer les articles de luxe
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/admin/catalogue/produits?type=SERVICE"
          className="flex items-center justify-between p-5 border border-brand-200 text-sm hover:border-brand-950 transition-colors group sm:col-span-2 lg:col-span-1"
        >
          Gérer les accompagnements
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
