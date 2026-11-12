import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { coachingImage } from "@/lib/images";
import { OfferForfaitDetail } from "@/components/offres/OfferForfaitDetail";
import { getHomepageSettings } from "@/lib/homepage-settings";
import { resolveServiceAudienceRoot } from "@/lib/categories";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    return await prisma.product.findFirst({
      where: { slug, productType: "SERVICE" },
      include: { category: { include: { parent: true } } },
    });
  } catch {
    return null;
  }
}

const fallbackProducts: Record<
  string,
  {
    name: string;
    price: number;
    shortDescription: string;
    description: string;
    features: string[];
    duration: string;
    images: string[];
  }
> = {
  standard: {
    name: "Standard",
    price: 60000,
    shortDescription: "L'essentiel pour aligner votre image avec votre personnalité",
    description:
      "Connaître ses couleurs valorisantes, identifier sa morphologie et poser les bases d'un style cohérent. Un accompagnement clair pour avancer avec confiance.",
    features: [
      "Analyse colorimétrique",
      "Audit de garde-robe",
      "Conseils personnalisés",
      "Guide de style digital",
    ],
    duration: "2 heures",
    images: [coachingImage("standard", 1200)],
  },
  gold: {
    name: "Gold",
    price: 150000,
    shortDescription: "Une transformation en profondeur de votre image personnelle",
    description:
      "Un parcours approfondi pour une transformation visible et durable : couleurs, silhouettes, garde-robe et posture image au quotidien.",
    features: [
      "Tout Standard inclus",
      "Personal shopping guidé",
      "Book de style personnalisé",
      "Suivi post-coaching 1 mois",
    ],
    duration: "4 heures",
    images: [coachingImage("gold", 1200)],
  },
  platinum: {
    name: "Platinum",
    price: 350000,
    shortDescription:
      "L'excellence en conseil en image, le chemin vers la réalisation de ses ambitions",
    description:
      "Connaître ses couleurs valorisantes, identifier sa morphologie, et apprendre à gérer ses complexes. Suivi adapté à votre objectif.",
    features: [
      "Atelier de transition de mindset",
      "Analyse colorimétrique",
      "Analyse morphologique",
      "Gestion des complexes",
      "Diagnostic style",
    ],
    duration: "8+ heures",
    images: [coachingImage("platinum", 1200)],
  },
  "sur-mesure": {
    name: "Sur-mesure",
    price: 500000,
    shortDescription: "Un diagnostic personnalisé pour un accompagnement unique",
    description:
      "Pour les personnalités, dirigeants et projets d'image exceptionnels. Parcours entièrement calibré sur vos enjeux et votre calendrier.",
    features: [
      "Diagnostic complet",
      "Parcours personnalisé",
      "Conciergerie shopping luxe",
      "Accompagnement flexible",
      "Suivi premium",
    ],
    duration: "Sur mesure",
    images: [coachingImage("sur-mesure", 1200)],
  },
};

export const dynamic = "force-dynamic";

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

  const product = dbProduct
    ? {
        id: dbProduct.id,
        slug: dbProduct.slug,
        name: dbProduct.name,
        shortDescription: dbProduct.shortDescription ?? "",
        description: dbProduct.description ?? "",
        features: dbProduct.features ?? [],
        duration: dbProduct.duration,
        images: dbProduct.images?.length ? dbProduct.images : [coachingImage(slug, 1200)],
      }
    : {
        id: slug,
        slug,
        name: fallback!.name,
        shortDescription: fallback!.shortDescription,
        description: fallback!.description,
        features: fallback!.features,
        duration: fallback!.duration,
        images: fallback!.images,
      };

  const isSurMesure = slug === "sur-mesure";
  let personalShopping = (await getHomepageSettings()).personalShopping;

  const audienceSlug = dbProduct?.category ? resolveServiceAudienceRoot(dbProduct.category) : null;
  const audienceLabel =
    audienceSlug === "particuliers"
      ? "Particuliers"
      : audienceSlug === "entreprises"
        ? "Entreprises"
        : dbProduct?.category?.name ?? null;

  return (
    <OfferForfaitDetail
      product={product}
      slug={slug}
      isSurMesure={isSurMesure}
      personalShopping={personalShopping}
      audienceSlug={audienceSlug}
      audienceLabel={audienceLabel}
    />
  );
}
