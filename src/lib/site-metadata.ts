import type { Metadata } from "next";
import { resolveAppUrl } from "@/lib/app-url";
import { BRAND_FULL_NAME } from "@/lib/brand";
import { IMAGES } from "@/lib/images";

const DESCRIPTION =
  "Plateforme premium de conseil en image, coaching personnel et professionnel à Abidjan. Découvrez votre accompagnement, réservez et suivez votre parcours de transformation.";

export function getRootMetadata(): Metadata {
  const appUrl = resolveAppUrl();

  return {
    metadataBase: new URL(appUrl),
    title: {
      default: `${BRAND_FULL_NAME} | Coaching Premium Abidjan`,
      template: `%s | ${BRAND_FULL_NAME}`,
    },
    description: DESCRIPTION,
    keywords: [
      "conseil en image",
      "coaching image",
      "Abidjan",
      "Côte d'Ivoire",
      "colorimétrie",
      "personal shopping",
      "image professionnelle",
    ],
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: BRAND_FULL_NAME,
      url: appUrl,
      title: BRAND_FULL_NAME,
      description: DESCRIPTION,
      images: [
        {
          url: IMAGES.hero,
          width: 1200,
          height: 630,
          alt: BRAND_FULL_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: BRAND_FULL_NAME,
      description: DESCRIPTION,
      images: [IMAGES.hero],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
