import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { IMAGES, luxeImage, coachingImage } from "../src/lib/images";
import { buildKeywordsFromProduct } from "../src/lib/catalogue";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

const BLOG_SAMPLE_CONTENT = `Votre image professionnelle est votre carte de visite silencieuse. Avant même d'ouvrir la bouche, vos interlocuteurs se forgent déjà une opinion. Voici cinq erreurs fréquentes qui peuvent nuire à votre crédibilité — et comment les corriger.

1. Négliger la cohérence vestimentaire

Porter des pièces de qualités ou de styles très différents envoie un message contradictoire. Harmonisez vos couleurs, matières et niveaux de formalité pour projeter une image unifiée.

2. Ignorer l'impact des couleurs

Certaines teintes vous éteignent tandis que d'autres illuminent votre visage. Une analyse colorimétrique permet de choisir une palette qui renforce votre présence.

3. Sous-estimer les détails

Chaussures abîmées, ongles négligés ou sac déformé peuvent ruiner une excellente tenue. Les détails comptent autant que la silhouette globale.

4. Copier au lieu d'affirmer

Suivre chaque tendance sans tenir compte de votre morphologie et personnalité crée une image générique. L'authenticité inspire davantage confiance.

5. Oublier le contexte

Une tenue parfaite pour un rendez-vous client peut être inadaptée en soirée networking. Adaptez votre image au contexte tout en restant fidèle à vous-même.

Chez Conseil en Image avec Ariane, nous accompagnons les professionnels pour construire une image alignée avec leurs ambitions. Réservez un diagnostic pour identifier vos axes de progression.`;

async function main() {
  const passwordHash = await bcrypt.hash("Admin2026!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "ariane@conseil-image.com" },
    update: {},
    create: {
      email: "ariane@conseil-image.com",
      firstName: "Stéphanie Ariane",
      lastName: "DAGO",
      phone: "+2250749526194",
      passwordHash,
      role: "SUPER_ADMIN",
      emailVerified: new Date(),
    },
  });

  const particuliers = await prisma.category.upsert({
    where: { slug: "particuliers" },
    update: { scope: "SERVICE" },
    create: {
      name: "Particuliers",
      slug: "particuliers",
      description: "Accompagnements personnalisés pour particuliers",
      scope: "SERVICE",
      sortOrder: 1,
    },
  });

  const entreprises = await prisma.category.upsert({
    where: { slug: "entreprises" },
    update: { scope: "SERVICE" },
    create: {
      name: "Entreprises",
      slug: "entreprises",
      description: "Ateliers et prestations pour organisations",
      scope: "SERVICE",
      sortOrder: 2,
    },
  });

  const products = [
    {
      name: "Standard",
      slug: "standard",
      shortDescription: "L'essentiel pour aligner votre image avec votre personnalité",
      description:
        "Un accompagnement complet pour découvrir votre style et harmoniser votre garde-robe. Idéal pour une première approche du conseil en image.\n\n• Analyse colorimétrique\n• Audit de garde-robe\n• Conseils personnalisés\n• Guide de style digital",
      price: 60000,
      features: [
        "Analyse colorimétrique",
        "Audit de garde-robe",
        "Conseils personnalisés",
        "Guide de style digital",
      ],
      duration: "2 heures",
      sortOrder: 1,
      isFeatured: false,
    },
    {
      name: "Gold",
      slug: "gold",
      shortDescription: "Une transformation en profondeur de votre image personnelle",
      description:
        "Un parcours approfondi pour une transformation visible et durable de votre image.\n\n• Tout Standard +\n• Personal shopping guidé\n• Book de style personnalisé\n• Suivi post-coaching (1 mois)",
      price: 150000,
      features: [
        "Tout Standard inclus",
        "Personal shopping guidé",
        "Book de style personnalisé",
        "Suivi post-coaching 1 mois",
      ],
      duration: "4 heures",
      sortOrder: 2,
      isFeatured: true,
    },
    {
      name: "Platinum",
      slug: "platinum",
      shortDescription: "L'excellence en conseil en image, sur mesure et premium",
      description:
        "L'accompagnement le plus complet pour une refonte totale de votre image professionnelle et personnelle.\n\n• Tout Gold +\n• Accompagnement multi-séances\n• Garde-robe capsule complète\n• Suivi premium 3 mois\n• Accès prioritaire",
      price: 350000,
      features: [
        "Tout Gold inclus",
        "Accompagnement multi-séances",
        "Garde-robe capsule complète",
        "Suivi premium 3 mois",
        "Accès prioritaire",
      ],
      duration: "8+ heures",
      sortOrder: 3,
      isFeatured: true,
    },
    {
      name: "Sur-mesure",
      slug: "sur-mesure",
      shortDescription: "Un diagnostic personnalisé pour un accompagnement unique",
      description:
        "Pour les personnalités, dirigeants et projets d'image exceptionnels. Un diagnostic approfondi permet de définir un parcours entièrement personnalisé.\n\n• Diagnostic complet\n• Parcours sur mesure\n• Conciergerie shopping luxe\n• Accompagnement illimité selon besoin",
      price: 500000,
      features: [
        "Diagnostic complet",
        "Parcours entièrement personnalisé",
        "Conciergerie shopping luxe",
        "Accompagnement flexible",
      ],
      duration: "Sur mesure",
      sortOrder: 4,
      isFeatured: false,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...product,
        productType: "SERVICE",
        images: [coachingImage(product.slug)],
        keywords: buildKeywordsFromProduct({
          name: product.name,
          features: product.features,
        }),
      },
      create: {
        ...product,
        productType: "SERVICE",
        categoryId: particuliers.id,
        images: [coachingImage(product.slug)],
        keywords: buildKeywordsFromProduct({
          name: product.name,
          features: product.features,
        }),
        mode: "IN_PERSON",
      },
    });
  }

  // ─── Boutique Luxe : catégories ───
  const boutiqueCategories = [
    { name: "Sacs", slug: "sacs", description: "Maroquinerie et sacs de luxe", sortOrder: 1, scope: "LUXE" as const },
    { name: "Vêtements", slug: "vetements", description: "Pièces premium et intemporelles", sortOrder: 2, scope: "LUXE" as const },
    { name: "Accessoires", slug: "accessoires", description: "Bijoux, ceintures, foulards", sortOrder: 3, scope: "LUXE" as const },
    { name: "Parfums", slug: "parfums", description: "Fragrances exclusives", sortOrder: 4, scope: "LUXE" as const },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of boutiqueCategories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder, scope: cat.scope },
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }

  // Harmoniser le scope des catégories existantes
  await prisma.category.updateMany({
    where: { slug: { in: ["particuliers", "entreprises"] } },
    data: { scope: "SERVICE" },
  });
  await prisma.category.updateMany({
    where: { slug: { in: ["sacs", "vetements", "accessoires", "parfums"] } },
    data: { scope: "LUXE" },
  });
  // Sous-catégories : héritent du scope du parent
  for (const cat of await prisma.category.findMany({ where: { parentId: { not: null } }, select: { id: true, parentId: true } })) {
    const parent = await prisma.category.findUnique({ where: { id: cat.parentId! }, select: { scope: true } });
    if (parent) {
      await prisma.category.update({ where: { id: cat.id }, data: { scope: parent.scope } });
    }
  }

  // telephone → sous-catégorie boutique (Sacs)
  const sacs = await prisma.category.findUnique({ where: { slug: "sacs" } });
  if (sacs) {
    await prisma.category.updateMany({
      where: { slug: "telephone" },
      data: { parentId: sacs.id, scope: "LUXE" },
    });
  }

  const luxeProducts = [
    {
      name: "Sac Cabas Cuir", slug: "sac-cabas-cuir", brand: "Maison Élégance",
      shortDescription: "Maroquinerie artisanale, finitions main",
      description: "Un cabas en cuir pleine fleur, conçu pour allier élégance et fonctionnalité.",
      price: 450000, features: ["Cuir pleine fleur", "Finitions artisanale", "Doublure coton"],
      categorySlug: "sacs", sortOrder: 1, isFeatured: true,
      image: luxeImage("sac-cabas-cuir"),
    },
    {
      name: "Sac Bandoulière Iconique", slug: "sac-bandouliere-iconique", brand: "Atelier Prestige",
      shortDescription: "Silhouette intemporelle, cuir grainé",
      description: "Bandoulière ajustable, fermeture magnétique, compartiment spacieux.",
      price: 380000, features: ["Cuir grainé", "Bandoulière ajustable", "Fermeture magnétique"],
      categorySlug: "sacs", sortOrder: 2, isFeatured: false,
      image: luxeImage("sac-bandouliere-iconique"),
    },
    {
      name: "Blazer Soie Noire", slug: "blazer-soie-noire", brand: "Collection Ariane",
      shortDescription: "Coupe structurée, élégance professionnelle",
      description: "Blazer en soie mélangée, coupe ajustée, boutons dorés.",
      price: 320000, features: ["Soie mélangée premium", "Coupe structurée", "Boutons dorés"],
      categorySlug: "vetements", sortOrder: 3, isFeatured: true,
      image: luxeImage("blazer-soie-noire"),
    },
    {
      name: "Robe Soie Élégance", slug: "robe-soie-elegance", brand: "Maison Élégance",
      shortDescription: "Tombe fluide, palette raffinée",
      description: "Robe midi en soie, col V, ceinture amovible.",
      price: 280000, features: ["100% soie", "Col V élégant", "Ceinture amovible"],
      categorySlug: "vetements", sortOrder: 4, isFeatured: false,
      image: luxeImage("robe-soie-elegance"),
    },
    {
      name: "Ceinture Cuir Artisanale", slug: "ceinture-cuir-artisanale", brand: "Atelier Prestige",
      shortDescription: "Boucle dorée, cuir pleine fleur",
      description: "Ceinture fine en cuir artisanal, boucle dorée brossée.",
      price: 95000, features: ["Cuir pleine fleur", "Boucle dorée brossée", "Coffret inclus"],
      categorySlug: "accessoires", sortOrder: 5, isFeatured: false,
      image: luxeImage("ceinture-cuir-artisanale"),
    },
    {
      name: "Foulard Soie Signature", slug: "foulard-soie-signature", brand: "Collection Ariane",
      shortDescription: "Imprimé exclusif, 100% soie",
      description: "Foulard carré en soie twill, imprimé exclusif, fini main.",
      price: 75000, features: ["100% soie twill", "Imprimé exclusif", "90 × 90 cm"],
      categorySlug: "accessoires", sortOrder: 6, isFeatured: false,
      image: luxeImage("foulard-soie-signature"),
    },
    {
      name: "Parfum Signature", slug: "parfum-signature-ariane", brand: "Ariane Parfums",
      shortDescription: "Notes florales et boisées, flacon collector",
      description: "Eau de parfum aux notes de jasmin, rose et bois de santal.",
      price: 120000, features: ["Eau de parfum 75ml", "Notes florales & boisées", "Flacon collector"],
      categorySlug: "parfums", sortOrder: 7, isFeatured: true,
      image: luxeImage("parfum-signature-ariane"),
    },
    {
      name: "Coffret Fragrances Premium", slug: "coffret-fragrances", brand: "Ariane Parfums",
      shortDescription: "Trois eaux de parfum en édition limitée",
      description: "Coffret luxe comprenant trois fragrances exclusives en format voyage.",
      price: 185000, features: ["3 × 30ml", "Édition limitée", "Coffret rigide premium"],
      categorySlug: "parfums", sortOrder: 8, isFeatured: false,
      image: luxeImage("coffret-fragrances"),
    },
  ];

  const brandNames = [...new Set(luxeProducts.map((p) => p.brand))];
  const brandMap: Record<string, string> = {};
  for (const brandName of brandNames) {
    const b = await prisma.brand.upsert({
      where: { name: brandName },
      update: {},
      create: {
        name: brandName,
        slug: slugify(brandName),
        isActive: true,
      },
    });
    brandMap[brandName] = b.id;
  }

  for (const item of luxeProducts) {
    const category = await prisma.category.findUnique({ where: { slug: item.categorySlug } });
    const keywords = buildKeywordsFromProduct({
      name: item.name,
      brand: item.brand,
      categoryName: category?.name,
      features: item.features,
    });

    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        brand: item.brand,
        brandId: brandMap[item.brand],
        shortDescription: item.shortDescription,
        description: item.description,
        price: item.price,
        features: item.features,
        keywords,
        sortOrder: item.sortOrder,
        isFeatured: item.isFeatured,
        productType: "LUXE",
        images: [item.image],
      },
      create: {
        name: item.name,
        slug: item.slug,
        brand: item.brand,
        brandId: brandMap[item.brand],
        shortDescription: item.shortDescription,
        description: item.description,
        price: item.price,
        features: item.features,
        keywords,
        sortOrder: item.sortOrder,
        isFeatured: item.isFeatured,
        productType: "LUXE",
        categoryId: categoryMap[item.categorySlug],
        images: [item.image],
      },
    });
  }

  const orientationQuestions = [
    {
      id: "q1",
      question: "Quel est votre objectif principal ?",
      type: "single",
      options: [
        { value: "style", label: "Améliorer mon style au quotidien", score: { standard: 3, gold: 1 } },
        { value: "pro", label: "Renforcer mon image professionnelle", score: { gold: 2, platinum: 2 } },
        { value: "transformation", label: "Transformation complète de mon image", score: { platinum: 3, surMesure: 1 } },
        { value: "special", label: "Événement ou projet spécifique", score: { gold: 1, surMesure: 2 } },
      ],
    },
    {
      id: "q2",
      question: "Quel est votre niveau d'investissement souhaité ?",
      type: "single",
      options: [
        { value: "decouverte", label: "Découverte — je veux tester", score: { standard: 3 } },
        { value: "modere", label: "Investissement modéré", score: { gold: 3 } },
        { value: "premium", label: "Expérience premium complète", score: { platinum: 3 } },
        { value: "luxe", label: "Accompagnement luxe et exclusif", score: { surMesure: 3 } },
      ],
    },
    {
      id: "q3",
      question: "Avez-vous déjà consulté un conseiller en image ?",
      type: "single",
      options: [
        { value: "non", label: "Non, c'est ma première fois", score: { standard: 2, gold: 1 } },
        { value: "oui_basique", label: "Oui, une expérience basique", score: { gold: 2, platinum: 1 } },
        { value: "oui_avance", label: "Oui, je cherche un niveau supérieur", score: { platinum: 2, surMesure: 1 } },
      ],
    },
    {
      id: "q4",
      question: "Quel mode d'accompagnement préférez-vous ?",
      type: "single",
      options: [
        { value: "presentiel", label: "Présentiel à Abidjan", score: { standard: 1, gold: 1, platinum: 1 } },
        { value: "digital", label: "100% digital", score: { standard: 2, gold: 1 } },
        { value: "hybride", label: "Hybride (présentiel + digital)", score: { gold: 2, platinum: 2 } },
      ],
    },
    {
      id: "q5",
      question: "Êtes-vous intéressé(e) par le personal shopping luxe ?",
      type: "single",
      options: [
        { value: "oui", label: "Oui, c'est essentiel pour moi", score: { platinum: 2, surMesure: 3 } },
        { value: "peut_etre", label: "Peut-être, selon les recommandations", score: { gold: 2, platinum: 1 } },
        { value: "non", label: "Non, pas pour le moment", score: { standard: 2, gold: 1 } },
      ],
    },
  ];

  await prisma.questionnaire.upsert({
    where: { slug: "orientation" },
    update: { questions: orientationQuestions },
    create: {
      title: "Trouver mon accompagnement",
      slug: "orientation",
      description: "Répondez à quelques questions pour découvrir la formule qui vous correspond",
      type: "orientation",
      questions: orientationQuestions,
    },
  });

  const preCoachingQuestions = [
    {
      id: "pc1",
      question: "Décrivez votre style actuel en quelques mots",
      type: "text",
    },
    {
      id: "pc2",
      question: "Quelles couleurs portez-vous le plus souvent ?",
      type: "text",
    },
    {
      id: "pc3",
      question: "Quels sont vos objectifs pour cette séance ?",
      type: "textarea",
    },
    {
      id: "pc4",
      question: "Avez-vous des contraintes particulières (allergies, budget, etc.) ?",
      type: "textarea",
    },
    {
      id: "pc5",
      question: "Joignez une photo récente (optionnel)",
      type: "file",
    },
  ];

  await prisma.questionnaire.upsert({
    where: { slug: "pre-coaching" },
    update: { questions: preCoachingQuestions },
    create: {
      title: "Préparer mon coaching",
      slug: "pre-coaching",
      description: "Aidez-nous à personnaliser votre accompagnement",
      type: "pre-coaching",
      questions: preCoachingQuestions,
    },
  });

  const availability = [
    { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 6, startTime: "10:00", endTime: "14:00" },
  ];

  for (const slot of availability) {
    await prisma.availability.create({ data: slot }).catch(() => {});
  }

  const paymentMethods = [
    {
      code: "CASH_ON_DELIVERY",
      name: "Paiement à la livraison",
      description: "Payez en espèces ou Mobile Money à la réception (Abidjan)",
      instructions: "Préparez le montant exact ou votre téléphone pour Mobile Money lors de la livraison.",
      icon: "Truck",
      context: "BOUTIQUE" as const,
      provider: "CASH_ON_DELIVERY" as const,
      sortOrder: 1,
    },
    {
      code: "MOBILE_MONEY_ORANGE",
      name: "Orange Money",
      description: "Paiement sécurisé via Orange Money",
      icon: "Smartphone",
      context: "BOTH" as const,
      provider: "CINETPAY" as const,
      sortOrder: 2,
    },
    {
      code: "MOBILE_MONEY_MTN",
      name: "MTN MoMo",
      description: "Paiement sécurisé via MTN Mobile Money",
      icon: "Smartphone",
      context: "BOTH" as const,
      provider: "CINETPAY" as const,
      sortOrder: 3,
    },
    {
      code: "MOBILE_MONEY_WAVE",
      name: "Wave",
      description: "Paiement sécurisé via Wave",
      icon: "Smartphone",
      context: "BOTH" as const,
      provider: "CINETPAY" as const,
      sortOrder: 4,
    },
    {
      code: "CARD",
      name: "Carte bancaire",
      description: "Visa, Mastercard",
      icon: "CreditCard",
      context: "BOTH" as const,
      provider: "CINETPAY" as const,
      sortOrder: 5,
    },
    {
      code: "BANK_TRANSFER",
      name: "Virement bancaire",
      description: "Paiement par virement sous 48h",
      instructions: "Les coordonnées bancaires vous seront envoyées par email après validation de la commande.",
      icon: "Building2",
      context: "BOTH" as const,
      provider: "BANK_TRANSFER" as const,
      sortOrder: 6,
      isActive: false,
    },
  ];

  for (const pm of paymentMethods) {
    await prisma.paymentMethodConfig.upsert({
      where: { code: pm.code },
      update: {
        name: pm.name,
        description: pm.description,
        instructions: pm.instructions,
        icon: pm.icon,
        context: pm.context,
        provider: pm.provider,
        sortOrder: pm.sortOrder,
        isActive: pm.isActive ?? true,
      },
      create: {
        ...pm,
        isActive: pm.isActive ?? true,
      },
    });
  }

  await prisma.blogPost.upsert({
    where: { slug: "5-erreurs-image-professionnelle" },
    update: {
      coverImage: IMAGES.blogCover,
      content: BLOG_SAMPLE_CONTENT,
      isPublished: true,
      publishedAt: new Date(),
    },
    create: {
      title: "5 erreurs qui nuisent à votre image professionnelle",
      slug: "5-erreurs-image-professionnelle",
      excerpt:
        "Découvrez les pièges les plus courants et comment les éviter pour projeter confiance et crédibilité.",
      content: BLOG_SAMPLE_CONTENT,
      coverImage: IMAGES.blogCover,
      tags: ["image professionnelle", "conseils", "leadership"],
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  console.log("Seed completed:", { admin: admin.email });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
