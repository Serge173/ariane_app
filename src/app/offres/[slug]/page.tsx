import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { coachingImage } from "@/lib/images";
import { formatPrice } from "@/lib/utils";
import { Check, Calendar, ArrowRight } from "lucide-react";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { ProductImage } from "@/components/ui/ProductImage";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    return await prisma.product.findFirst({
      where: { slug, productType: "SERVICE" },
      include: { category: true },
    });
  } catch {
    return null;
  }
}

const fallbackProducts: Record<string, {
  name: string; price: number; shortDescription: string; description: string;
  features: string[]; duration: string; images: string[];
}> = {
  standard: {
    name: "Standard", price: 60000,
    shortDescription: "L'essentiel pour aligner votre image avec votre personnalité",
    description: "Un accompagnement complet pour découvrir votre style et harmoniser votre garde-robe.",
    features: ["Analyse colorimétrique", "Audit de garde-robe", "Conseils personnalisés", "Guide de style digital"],
    duration: "2 heures",
    images: [coachingImage("standard", 1200)],
  },
  gold: {
    name: "Gold", price: 150000,
    shortDescription: "Une transformation en profondeur de votre image personnelle",
    description: "Un parcours approfondi pour une transformation visible et durable de votre image.",
    features: ["Tout Standard inclus", "Personal shopping guidé", "Book de style personnalisé", "Suivi post-coaching 1 mois"],
    duration: "4 heures",
    images: [coachingImage("gold", 1200)],
  },
  platinum: {
    name: "Platinum", price: 350000,
    shortDescription: "L'excellence en conseil en image, sur mesure et premium",
    description: "L'accompagnement le plus complet pour une refonte totale de votre image.",
    features: ["Tout Gold inclus", "Accompagnement multi-séances", "Garde-robe capsule complète", "Suivi premium 3 mois"],
    duration: "8+ heures",
    images: [coachingImage("platinum", 1200)],
  },
  "sur-mesure": {
    name: "Sur-mesure", price: 500000,
    shortDescription: "Un diagnostic personnalisé pour un accompagnement unique",
    description: "Pour les personnalités, dirigeants et projets d'image exceptionnels.",
    features: ["Diagnostic complet", "Parcours entièrement personnalisé", "Conciergerie shopping luxe", "Accompagnement flexible"],
    duration: "Sur mesure",
    images: [coachingImage("sur-mesure", 1200)],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  const fallback = fallbackProducts[slug];
  const name = product?.name || fallback?.name;
  if (!name) return { title: "Offre introuvable" };
  return { title: name, description: product?.shortDescription || fallback?.shortDescription };
}

export default async function OfferDetailPage({ params }: Props) {
  const { slug } = await params;
  const dbProduct = await getProduct(slug);
  const fallback = fallbackProducts[slug];

  if (!dbProduct && !fallback) notFound();

  const product = dbProduct || {
    id: slug,
    slug,
    name: fallback!.name,
    price: fallback!.price,
    shortDescription: fallback!.shortDescription,
    description: fallback!.description,
    features: fallback!.features,
    duration: fallback!.duration,
    images: fallback!.images,
  };

  const isSurMesure = slug === "sur-mesure";

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="relative aspect-[4/5] bg-brand-100 overflow-hidden">
            <ProductImage
              src={product.images[0]}
              fallback={coachingImage(slug, 1200)}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-overline mb-4">Accompagnement</p>
            <h1 className="heading-section mb-4">{product.name}</h1>
            <p className="product-description-lg mb-6">{product.shortDescription}</p>

            <p className="text-2xl font-light mb-8">
              {isSurMesure ? "À partir de " : ""}
              {formatPrice(product.price)}
            </p>

            {"duration" in product && product.duration && (
              <p className="text-sm text-brand-500 mb-8">
                Durée : {product.duration}
              </p>
            )}

            <ul className="space-y-3 mb-10">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 product-description">
                  <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {isSurMesure ? (
              <Link href="/contact?type=diagnostic" className="btn-primary inline-flex items-center gap-2 w-fit">
                Demander mon diagnostic
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <AddToCartButton
                  product={{
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                  }}
                  productType="SERVICE"
                />
                <Link
                  href={`/reservation?product=${product.slug}`}
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Réserver directement
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-20 max-w-3xl">
          <h2 className="font-sans text-2xl font-semibold tracking-tight mb-6">Description</h2>
          <div className="product-description-lg whitespace-pre-line">
            {product.description}
          </div>
        </div>
      </div>
    </div>
  );
}
