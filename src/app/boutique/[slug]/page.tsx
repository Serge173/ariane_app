import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { luxeImage } from "@/lib/images";
import { formatPrice } from "@/lib/utils";
import { Check, ChevronRight, Truck, ShieldCheck } from "lucide-react";
import { formatCategoryLabel } from "@/lib/categories";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { ProductImage } from "@/components/ui/ProductImage";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    return await prisma.product.findFirst({
      where: { slug, productType: "LUXE" },
      include: { category: { include: { parent: true } } },
    });
  } catch {
    return null;
  }
}

const fallbackProducts: Record<string, {
  name: string; brand: string; price: number; shortDescription: string; description: string;
  features: string[]; images: string[]; categoryName: string;
}> = {
  "sac-cabas-cuir": {
    name: "Sac Cabas Cuir", brand: "Maison Élégance", price: 450000,
    shortDescription: "Maroquinerie artisanale aux finitions main",
    description: "Un cabas en cuir pleine fleur, conçu pour la femme active qui allie élégance et fonctionnalité. Doublure en coton, poches intérieures, anses renforcées.",
    features: ["Cuir pleine fleur", "Finitions artisanale", "Doublure coton", "Poches intérieures"],
    images: [luxeImage("sac-cabas-cuir", 1200)],
    categoryName: "Sacs",
  },
  "sac-bandouliere-iconique": {
    name: "Sac Bandoulière Iconique", brand: "Atelier Prestige", price: 380000,
    shortDescription: "Silhouette intemporelle en cuir grainé",
    description: "Bandoulière ajustable, fermeture magnétique, compartiment principal spacieux. Une pièce iconique pour toutes les occasions.",
    features: ["Cuir grainé", "Bandoulière ajustable", "Fermeture magnétique", "Format compact"],
    images: [luxeImage("sac-bandouliere-iconique", 1200)],
    categoryName: "Sacs",
  },
  "blazer-soie-noire": {
    name: "Blazer Soie Noire", brand: "Collection Ariane", price: 320000,
    shortDescription: "Coupe structurée pour l'élégance professionnelle",
    description: "Blazer en soie mélangée, coupe ajustée, boutons dorés. Idéal pour sublimer votre image en contexte professionnel.",
    features: ["Soie mélangée premium", "Coupe structurée", "Boutons dorés", "Doublure satin"],
    images: [luxeImage("blazer-soie-noire", 1200)],
    categoryName: "Vêtements",
  },
  "robe-soie-elegance": {
    name: "Robe Soie Élégance", brand: "Maison Élégance", price: 280000,
    shortDescription: "Tombe fluide et palette raffinée",
    description: "Robe midi en soie, col V, ceinture amovible. Une pièce versatile du jour au soir.",
    features: ["100% soie", "Col V élégant", "Ceinture amovible", "Coupe fluide"],
    images: [luxeImage("robe-soie-elegance", 1200)],
    categoryName: "Vêtements",
  },
  "ceinture-cuir-artisanale": {
    name: "Ceinture Cuir Artisanale", brand: "Atelier Prestige", price: 95000,
    shortDescription: "Boucle dorée, cuir pleine fleur",
    description: "Ceinture fine en cuir artisanal, boucle dorée brossée. L'accessoire qui structure votre silhouette.",
    features: ["Cuir pleine fleur", "Boucle dorée brossée", "Tailles ajustables", "Coffret inclus"],
    images: [luxeImage("ceinture-cuir-artisanale", 1200)],
    categoryName: "Accessoires",
  },
  "foulard-soie-signature": {
    name: "Foulard Soie Signature", brand: "Collection Ariane", price: 75000,
    shortDescription: "Imprimé exclusif, 100% soie",
    description: "Foulard carré en soie twill, imprimé exclusif Conseil en Image avec Ariane. Fini main.",
    features: ["100% soie twill", "Imprimé exclusif", "90 × 90 cm", "Fini main"],
    images: [luxeImage("foulard-soie-signature", 1200)],
    categoryName: "Accessoires",
  },
  "parfum-signature-ariane": {
    name: "Parfum Signature", brand: "Ariane Parfums", price: 120000,
    shortDescription: "Notes florales et boisées, flacon collector",
    description: "Eau de parfum aux notes de jasmin, rose et bois de santal. Flacon collector gravé, vaporisateur brume fine.",
    features: ["Eau de parfum 75ml", "Notes florales & boisées", "Flacon collector", "Vaporisateur brume"],
    images: [luxeImage("parfum-signature-ariane", 1200)],
    categoryName: "Parfums",
  },
  "coffret-fragrances": {
    name: "Coffret Fragrances Premium", brand: "Ariane Parfums", price: 185000,
    shortDescription: "Trois eaux de parfum en édition limitée",
    description: "Coffret luxe comprenant trois fragrances exclusives en format voyage. Idéal pour découvrir l'univers olfactif Ariane.",
    features: ["3 × 30ml", "Édition limitée", "Coffret rigide premium", "Carte olfactive incluse"],
    images: [luxeImage("coffret-fragrances", 1200)],
    categoryName: "Parfums",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  const fallback = fallbackProducts[slug];
  const name = product?.name || fallback?.name;
  if (!name) return { title: "Article introuvable" };
  return {
    title: `${name} | Ma Boutique Luxe`,
    description: product?.shortDescription || fallback?.shortDescription,
  };
}

export default async function BoutiqueProductPage({ params }: Props) {
  const { slug } = await params;
  const dbProduct = await getProduct(slug);
  const fallback = fallbackProducts[slug];

  if (!dbProduct && !fallback) notFound();

  const product = dbProduct
    ? {
        id: dbProduct.id,
        slug: dbProduct.slug,
        name: dbProduct.name,
        brand: dbProduct.brand,
        price: dbProduct.price,
        shortDescription: dbProduct.shortDescription,
        description: dbProduct.description,
        features: dbProduct.features,
        images: dbProduct.images,
        categoryName: formatCategoryLabel(dbProduct.category),
        categorySlug: dbProduct.category.slug,
        parentCategorySlug: dbProduct.category.parent?.slug ?? null,
        parentCategoryName: dbProduct.category.parent?.name ?? null,
      }
    : {
        id: slug,
        slug,
        name: fallback!.name,
        brand: fallback!.brand,
        price: fallback!.price,
        shortDescription: fallback!.shortDescription,
        description: fallback!.description,
        features: fallback!.features,
        images: fallback!.images,
        categoryName: fallback!.categoryName,
        categorySlug: null,
        parentCategorySlug: null,
        parentCategoryName: null,
      };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium">
        <nav className="flex items-center gap-2 text-xs text-brand-400 mb-8 uppercase tracking-widest flex-wrap">
          <Link href="/boutique" className="hover:text-brand-950 transition-colors">Ma Boutique</Link>
          {product.parentCategorySlug && product.parentCategoryName && (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link
                href={`/boutique?category=${product.parentCategorySlug}`}
                className="hover:text-brand-950 transition-colors"
              >
                {product.parentCategoryName}
              </Link>
            </>
          )}
          {product.categorySlug ? (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link
                href={`/boutique?category=${product.categorySlug}`}
                className="hover:text-brand-950 transition-colors text-brand-500"
              >
                {product.parentCategoryName
                  ? product.categoryName.replace(`${product.parentCategoryName} · `, "")
                  : product.categoryName}
              </Link>
            </>
          ) : (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-brand-500">{product.categoryName}</span>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-brand-600">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="relative aspect-[4/5] bg-brand-100 overflow-hidden">
            <ProductImage
              src={product.images[0]}
              fallback={luxeImage(slug, 1200)}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col justify-center">
            {product.brand && (
              <p className="text-overline mb-3">{product.brand}</p>
            )}
            <p className="text-xs uppercase tracking-widest text-brand-400 mb-2">{product.categoryName}</p>
            <h1 className="heading-section mb-4">{product.name}</h1>
            <p className="text-brand-600 leading-relaxed mb-6">{product.shortDescription}</p>
            <p className="text-2xl font-light mb-8">{formatPrice(product.price)}</p>

            <ul className="space-y-3 mb-10">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <AddToCartButton
                product={{
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: product.images[0],
                }}
                productType="LUXE"
              />
              <Link href="/panier" className="btn-secondary text-center inline-flex items-center justify-center">
                Voir le panier
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-6 border-t border-brand-100 text-xs text-brand-500">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4" strokeWidth={1.5} />
                Livraison soignée Abidjan
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
                Authenticité garantie
              </span>
            </div>
          </div>
        </div>

        <div className="mt-20 max-w-3xl">
          <h2 className="font-display text-2xl mb-6">Description</h2>
          <div className="text-brand-600 leading-relaxed whitespace-pre-line">{product.description}</div>
        </div>
      </div>
    </div>
  );
}
