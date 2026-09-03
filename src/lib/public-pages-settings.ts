import prisma from "@/lib/prisma";
import { IMAGES } from "@/lib/images";
import type { Prisma } from "@prisma/client";
import { BRAND_FULL_NAME, migrateBrandInObject } from "@/lib/brand";

export const PUBLIC_PAGES_SETTINGS_KEY = "public_pages_settings";

function str(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export interface AboutPageSettings {
  overline: string;
  title: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  values: { title: string; text: string }[];
  ctaLabel: string;
  ctaHref: string;
}

export interface OffersPageSettings {
  overline: string;
  title: string;
  intro: string;
  helpLinkLabel: string;
  helpLinkHref: string;
  enterpriseTitle: string;
  enterpriseIntro: string;
  enterpriseCtaLabel: string;
  enterpriseCtaHref: string;
}

export interface FaqItemSettings {
  q: string;
  a: string;
}

export interface FaqPageSettings {
  overline: string;
  title: string;
  items: FaqItemSettings[];
}

export interface ContactTypeHeaderSettings {
  title: string;
  subtitle: string;
}

export interface ContactPageSettings {
  types: {
    general: ContactTypeHeaderSettings;
    entreprise: ContactTypeHeaderSettings;
    diagnostic: ContactTypeHeaderSettings;
  };
  successTitle: string;
  successMessage: string;
  coordinatesTitle: string;
}

export interface BlogPageSettings {
  overline: string;
  title: string;
  intro: string;
  emptyMessage: string;
  articleFooterOverline: string;
  articleFooterText: string;
  articleFooterCtaLabel: string;
  articleFooterCtaHref: string;
  relatedTitle: string;
}

export interface LegalSectionSettings {
  title: string;
  body: string;
}

export interface LegalPageContentSettings {
  title: string;
  intro: string;
  sections: LegalSectionSettings[];
  disclaimer: string;
}

export interface LegalPagesSettings {
  cgv: LegalPageContentSettings;
  confidentialite: LegalPageContentSettings;
  mentionsLegales: LegalPageContentSettings;
}

export interface OrientationOptionSettings {
  value: string;
  label: string;
  score: Record<string, number>;
}

export interface OrientationQuestionSettings {
  id: string;
  question: string;
  options: OrientationOptionSettings[];
}

export interface OrientationRecommendationSettings {
  name: string;
  slug: string;
  description: string;
  price: string;
}

export interface OrientationPageSettings {
  overline: string;
  title: string;
  progressHint: string;
  resultOverline: string;
  ctaDiagnostic: string;
  ctaChoosePrefix: string;
  ctaAllOffers: string;
  questions: OrientationQuestionSettings[];
  recommendations: Record<string, OrientationRecommendationSettings>;
}

export interface PublicPagesSettings {
  about: AboutPageSettings;
  offers: OffersPageSettings;
  faq: FaqPageSettings;
  contact: ContactPageSettings;
  blog: BlogPageSettings;
  legal: LegalPagesSettings;
  orientation: OrientationPageSettings;
}

export const DEFAULT_ORIENTATION_QUESTIONS: OrientationQuestionSettings[] = [
  {
    id: "q1",
    question: "Quel est votre objectif principal ?",
    options: [
      { value: "style", label: "Améliorer mon style au quotidien", score: { standard: 3, gold: 1 } },
      { value: "pro", label: "Renforcer mon image professionnelle", score: { gold: 2, platinum: 2 } },
      { value: "transformation", label: "Transformation complète de mon image", score: { platinum: 3, "sur-mesure": 1 } },
      { value: "special", label: "Événement ou projet spécifique", score: { gold: 1, "sur-mesure": 2 } },
    ],
  },
  {
    id: "q2",
    question: "Quel est votre niveau d'investissement souhaité ?",
    options: [
      { value: "decouverte", label: "Découverte — je veux tester", score: { standard: 3 } },
      { value: "modere", label: "Investissement modéré", score: { gold: 3 } },
      { value: "premium", label: "Expérience premium complète", score: { platinum: 3 } },
      { value: "luxe", label: "Accompagnement luxe et exclusif", score: { "sur-mesure": 3 } },
    ],
  },
  {
    id: "q3",
    question: "Avez-vous déjà consulté un conseiller en image ?",
    options: [
      { value: "non", label: "Non, c'est ma première fois", score: { standard: 2, gold: 1 } },
      { value: "oui_basique", label: "Oui, une expérience basique", score: { gold: 2, platinum: 1 } },
      { value: "oui_avance", label: "Oui, je cherche un niveau supérieur", score: { platinum: 2, "sur-mesure": 1 } },
    ],
  },
  {
    id: "q4",
    question: "Quel mode d'accompagnement préférez-vous ?",
    options: [
      { value: "presentiel", label: "Présentiel à Abidjan", score: { standard: 1, gold: 1, platinum: 1 } },
      { value: "digital", label: "100% digital", score: { standard: 2, gold: 1 } },
      { value: "hybride", label: "Hybride (présentiel + digital)", score: { gold: 2, platinum: 2 } },
    ],
  },
  {
    id: "q5",
    question: "Êtes-vous intéressé(e) par le personal shopping luxe ?",
    options: [
      { value: "oui", label: "Oui, c'est essentiel pour moi", score: { platinum: 2, "sur-mesure": 3 } },
      { value: "peut_etre", label: "Peut-être, selon les recommandations", score: { gold: 2, platinum: 1 } },
      { value: "non", label: "Non, pas pour le moment", score: { standard: 2, gold: 1 } },
    ],
  },
];

export const DEFAULT_ORIENTATION_RECOMMENDATIONS: Record<string, OrientationRecommendationSettings> = {
  standard: {
    name: "Standard",
    slug: "standard",
    description: "Parfait pour une première approche du conseil en image",
    price: "60 000 FCFA",
  },
  gold: {
    name: "Gold",
    slug: "gold",
    description: "Idéal pour une transformation en profondeur",
    price: "150 000 FCFA",
  },
  platinum: {
    name: "Platinum",
    slug: "platinum",
    description: "L'excellence pour une refonte totale de votre image",
    price: "350 000 FCFA",
  },
  "sur-mesure": {
    name: "Sur-mesure",
    slug: "sur-mesure",
    description: "Un accompagnement entièrement personnalisé",
    price: "À partir de 500 000 FCFA",
  },
};

export const DEFAULT_PUBLIC_PAGES_SETTINGS: PublicPagesSettings = {
  about: {
    overline: "À propos",
    title: "Ariane DAGO",
    paragraphs: [
      "Fondatrice de la marque Bienvenue à la mode avec Ariane, je accompagne hommes et femmes ambitieux dans l'alignement de leur image avec leur personnalité, leur fonction et leurs ambitions.",
      "Basée à Abidjan, je propose des accompagnements en présentiel et à distance pour une clientèle en Côte d'Ivoire, en Afrique et dans la diaspora.",
      "Mon approche allie expertise technique, sensibilité esthétique et compréhension des enjeux professionnels pour une transformation authentique et durable.",
    ],
    image: IMAGES.about,
    imageAlt: "Ariane DAGO - Consultante en image",
    values: [
      { title: "Mission", text: "Révéler l'image authentique de chaque personne pour qu'elle rayonne avec confiance." },
      { title: "Vision", text: "Devenir la référence du conseil en image premium en Afrique francophone." },
      { title: "Valeurs", text: "Excellence, authenticité, écoute et transformation durable." },
    ],
    ctaLabel: "Découvrir mon accompagnement",
    ctaHref: "/orientation",
  },
  offers: {
    overline: "Accompagnements",
    title: "Nos formules",
    intro:
      "Quatre niveaux d'accompagnement pensés pour répondre à chaque ambition. Chaque formule inclut un suivi personnalisé dans votre espace client.",
    helpLinkLabel: "Aide au choix",
    helpLinkHref: "/orientation",
    enterpriseTitle: "Entreprises & Sur-mesure",
    enterpriseIntro:
      "Ateliers en entreprise, accompagnements dirigeants et projets d'image sur mesure. Contactez-nous pour une proposition personnalisée.",
    enterpriseCtaLabel: "Demander une proposition",
    enterpriseCtaHref: "/contact?type=entreprise",
  },
  faq: {
    overline: "FAQ",
    title: "Questions fréquentes",
    items: [
      {
        q: "Comment choisir la bonne formule ?",
        a: "Utilisez notre questionnaire d'orientation gratuit. En 2 minutes, nous vous recommandons la formule adaptée à vos objectifs et votre budget.",
      },
      {
        q: "Puis-je payer en Mobile Money ?",
        a: "Oui. Nous acceptons Orange Money, MTN MoMo, Wave et Moov Money, ainsi que les cartes bancaires.",
      },
      {
        q: "Les séances sont-elles disponibles en digital ?",
        a: "Oui, selon la formule choisie. Vous pouvez opter pour du présentiel à Abidjan, du 100% digital ou un mode hybride.",
      },
      {
        q: "Comment annuler ou reprogrammer un rendez-vous ?",
        a: "Contactez-nous via WhatsApp ou email au moins 48h avant votre rendez-vous. Les conditions d'annulation sont détaillées dans nos CGV.",
      },
      {
        q: "Que contient mon espace client ?",
        a: "Votre parcours de coaching (rendez-vous, questionnaires, documents, livrables) et le suivi de vos commandes boutique : statuts, paiements, livraisons et historique complet.",
      },
      {
        q: "Proposez-vous des prestations pour entreprises ?",
        a: "Oui. Ateliers en entreprise, accompagnements dirigeants et programmes sur mesure. Contactez-nous pour une proposition personnalisée.",
      },
    ],
  },
  contact: {
    types: {
      general: { title: "Contact", subtitle: "Une question ? Écrivez-nous." },
      entreprise: { title: "Demande entreprise", subtitle: "Ateliers et accompagnements professionnels." },
      diagnostic: { title: "Demander un diagnostic", subtitle: "Accompagnement sur-mesure personnalisé." },
    },
    successTitle: "Message envoyé",
    successMessage: "Nous vous répondrons sous 48h ouvrées.",
    coordinatesTitle: "Coordonnées",
  },
  blog: {
    overline: "Blog",
    title: "Expertise & Inspiration",
    intro: "Conseils en image, colorimétrie, leadership visuel et communication par l'image.",
    emptyMessage: "Articles à venir prochainement.",
    articleFooterOverline: BRAND_FULL_NAME,
    articleFooterText: "Envie d'aller plus loin ? Découvrez nos accompagnements personnalisés.",
    articleFooterCtaLabel: "Voir nos prestations",
    articleFooterCtaHref: "/offres",
    relatedTitle: "Articles similaires",
  },
  legal: {
    cgv: {
      title: "Conditions générales de vente",
      intro: `Les présentes conditions générales de vente régissent les relations entre ${BRAND_FULL_NAME} et ses clients.`,
      sections: [
        {
          title: "1. Prestations",
          body: "Les prestations proposées sont des services de conseil en image et coaching. Les tarifs sont indiqués en FCFA TTC sur le site.",
        },
        {
          title: "2. Réservation et paiement",
          body: "La réservation est confirmée après paiement intégral. Les moyens de paiement acceptés sont Mobile Money et carte bancaire.",
        },
        {
          title: "3. Annulation",
          body: "Toute annulation doit être signalée au minimum 48h avant le rendez-vous. Les conditions de remboursement seront précisées ici.",
        },
      ],
      disclaimer: "Document à rédiger et valider juridiquement avant mise en production.",
    },
    confidentialite: {
      title: "Politique de confidentialité",
      intro:
        `${BRAND_FULL_NAME} s'engage à protéger vos données personnelles conformément à la réglementation applicable.`,
      sections: [
        {
          title: "Données collectées",
          body: "Nom, prénom, email, téléphone, informations de facturation, réponses aux questionnaires de coaching, historique de commandes.",
        },
        {
          title: "Finalités",
          body: "Gestion des réservations, suivi du coaching, communication transactionnelle, amélioration de nos services.",
        },
        {
          title: "Vos droits",
          body: "Vous pouvez demander l'accès, la rectification ou la suppression de vos données en contactant contact@conseil-image-ariane.com.",
        },
      ],
      disclaimer: "Document à rédiger et valider juridiquement avant mise en production.",
    },
    mentionsLegales: {
      title: "Mentions légales",
      intro: "",
      sections: [
        {
          title: "Éditeur du site",
          body: `${BRAND_FULL_NAME}\nDAGO Stéphanie Ariane\nAbidjan, Cocody — Côte d'Ivoire\ncontact@conseil-image-ariane.com`,
        },
        {
          title: "Hébergement",
          body: "Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, USA",
        },
        {
          title: "Propriété intellectuelle",
          body: "L'ensemble du contenu de ce site est protégé par le droit d'auteur. Toute reproduction est interdite sans autorisation.",
        },
      ],
      disclaimer: "Document à compléter et valider juridiquement avant mise en production.",
    },
  },
  orientation: {
    overline: "Questionnaire d'orientation",
    title: "Trouver mon accompagnement",
    progressHint: "Répondez librement, il n'y a pas de mauvaise réponse.",
    resultOverline: "Votre recommandation",
    ctaDiagnostic: "Demander mon diagnostic",
    ctaChoosePrefix: "Choisir",
    ctaAllOffers: "Voir toutes nos prestations",
    questions: DEFAULT_ORIENTATION_QUESTIONS,
    recommendations: DEFAULT_ORIENTATION_RECOMMENDATIONS,
  },
};

function parseStringArray(raw: unknown, fallback: string[]): string[] {
  if (!Array.isArray(raw)) return fallback;
  const items = raw.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, 8);
  return items.length > 0 ? items : fallback;
}

function parseValues(raw: unknown, fallback: AboutPageSettings["values"]): AboutPageSettings["values"] {
  if (!Array.isArray(raw)) return fallback;
  const items = raw
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const v = item as Partial<{ title: string; text: string }>;
      const fb = fallback[index];
      if (!fb) return null;
      return { title: str(v.title, fb.title), text: str(v.text, fb.text) };
    })
    .filter((v): v is { title: string; text: string } => v !== null);
  return items.length > 0 ? items.slice(0, 6) : fallback;
}

function parseFaqItems(raw: unknown, fallback: FaqItemSettings[]): FaqItemSettings[] {
  if (!Array.isArray(raw)) return fallback;
  const items = raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const f = item as Partial<FaqItemSettings>;
      if (!f.q || !f.a) return null;
      return { q: str(f.q, ""), a: str(f.a, "") };
    })
    .filter((f): f is FaqItemSettings => f !== null);
  return items.length > 0 ? items.slice(0, 20) : fallback;
}

function parseLegalSections(raw: unknown, fallback: LegalSectionSettings[]): LegalSectionSettings[] {
  if (!Array.isArray(raw)) return fallback;
  const items = raw
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const s = item as Partial<LegalSectionSettings>;
      const fb = fallback[index];
      if (!fb) return null;
      return { title: str(s.title, fb.title), body: str(s.body, fb.body) };
    })
    .filter((s): s is LegalSectionSettings => s !== null);
  return items.length > 0 ? items.slice(0, 12) : fallback;
}

function parseLegalPage(raw: unknown, fallback: LegalPageContentSettings): LegalPageContentSettings {
  if (!raw || typeof raw !== "object") return fallback;
  const p = raw as Partial<LegalPageContentSettings>;
  return {
    title: str(p.title, fallback.title),
    intro: str(p.intro, fallback.intro),
    sections: parseLegalSections(p.sections, fallback.sections),
    disclaimer: str(p.disclaimer, fallback.disclaimer),
  };
}

function parseOrientationOptions(
  raw: unknown,
  fallback: OrientationOptionSettings[]
): OrientationOptionSettings[] {
  if (!Array.isArray(raw)) return fallback;
  const items = raw
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Partial<OrientationOptionSettings>;
      const fb = fallback[index];
      if (!fb || !o.value) return null;
      const score =
        o.score && typeof o.score === "object"
          ? Object.fromEntries(
              Object.entries(o.score).filter(
                ([k, v]) => typeof k === "string" && typeof v === "number"
              )
            )
          : fb.score;
      return { value: str(o.value, fb.value), label: str(o.label, fb.label), score };
    })
    .filter((o): o is OrientationOptionSettings => o !== null);
  return items.length > 0 ? items : fallback;
}

function parseOrientationQuestions(
  raw: unknown,
  fallback: OrientationQuestionSettings[]
): OrientationQuestionSettings[] {
  if (!Array.isArray(raw)) return fallback;
  const items = raw
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const q = item as Partial<OrientationQuestionSettings>;
      const fb = fallback[index];
      if (!fb || !q.id) return null;
      return {
        id: str(q.id, fb.id),
        question: str(q.question, fb.question),
        options: parseOrientationOptions(q.options, fb.options),
      };
    })
    .filter((q): q is OrientationQuestionSettings => q !== null);
  return items.length > 0 ? items.slice(0, 8) : fallback;
}

function parseRecommendations(
  raw: unknown,
  fallback: Record<string, OrientationRecommendationSettings>
): Record<string, OrientationRecommendationSettings> {
  if (!raw || typeof raw !== "object") return fallback;
  const result = { ...fallback };
  for (const key of Object.keys(fallback)) {
    const item = (raw as Record<string, unknown>)[key];
    if (!item || typeof item !== "object") continue;
    const r = item as Partial<OrientationRecommendationSettings>;
    result[key] = {
      name: str(r.name, fallback[key].name),
      slug: str(r.slug, fallback[key].slug),
      description: str(r.description, fallback[key].description),
      price: str(r.price, fallback[key].price),
    };
  }
  return result;
}

function parseContactType(raw: unknown, fallback: ContactTypeHeaderSettings): ContactTypeHeaderSettings {
  if (!raw || typeof raw !== "object") return fallback;
  const t = raw as Partial<ContactTypeHeaderSettings>;
  return { title: str(t.title, fallback.title), subtitle: str(t.subtitle, fallback.subtitle) };
}

export async function getPublicPagesSettings(): Promise<PublicPagesSettings> {
  try {
    const row = await prisma.siteContent.findUnique({ where: { key: PUBLIC_PAGES_SETTINGS_KEY } });
    if (!row?.value || typeof row.value !== "object") return structuredClone(DEFAULT_PUBLIC_PAGES_SETTINGS);
    const raw = row.value as Partial<PublicPagesSettings>;

    const aboutRaw: Partial<AboutPageSettings> = raw.about && typeof raw.about === "object" ? raw.about : {};
    const offersRaw: Partial<OffersPageSettings> = raw.offers && typeof raw.offers === "object" ? raw.offers : {};
    const faqRaw: Partial<FaqPageSettings> = raw.faq && typeof raw.faq === "object" ? raw.faq : {};
    const contactRaw: Partial<ContactPageSettings> = raw.contact && typeof raw.contact === "object" ? raw.contact : {};
    const blogRaw: Partial<BlogPageSettings> = raw.blog && typeof raw.blog === "object" ? raw.blog : {};
    const legalRaw: Partial<LegalPagesSettings> = raw.legal && typeof raw.legal === "object" ? raw.legal : {};
    const orientationRaw: Partial<OrientationPageSettings> =
      raw.orientation && typeof raw.orientation === "object" ? raw.orientation : {};
    const typesRaw: Partial<ContactPageSettings["types"]> =
      contactRaw.types && typeof contactRaw.types === "object" ? contactRaw.types : {};

    return migrateBrandInObject({
      about: {
        overline: str(aboutRaw.overline, DEFAULT_PUBLIC_PAGES_SETTINGS.about.overline),
        title: str(aboutRaw.title, DEFAULT_PUBLIC_PAGES_SETTINGS.about.title),
        paragraphs: parseStringArray(aboutRaw.paragraphs, DEFAULT_PUBLIC_PAGES_SETTINGS.about.paragraphs),
        image: str(aboutRaw.image, DEFAULT_PUBLIC_PAGES_SETTINGS.about.image),
        imageAlt: str(aboutRaw.imageAlt, DEFAULT_PUBLIC_PAGES_SETTINGS.about.imageAlt),
        values: parseValues(aboutRaw.values, DEFAULT_PUBLIC_PAGES_SETTINGS.about.values),
        ctaLabel: str(aboutRaw.ctaLabel, DEFAULT_PUBLIC_PAGES_SETTINGS.about.ctaLabel),
        ctaHref: str(aboutRaw.ctaHref, DEFAULT_PUBLIC_PAGES_SETTINGS.about.ctaHref),
      },
      offers: {
        overline: str(offersRaw.overline, DEFAULT_PUBLIC_PAGES_SETTINGS.offers.overline),
        title: str(offersRaw.title, DEFAULT_PUBLIC_PAGES_SETTINGS.offers.title),
        intro: str(offersRaw.intro, DEFAULT_PUBLIC_PAGES_SETTINGS.offers.intro),
        helpLinkLabel: str(offersRaw.helpLinkLabel, DEFAULT_PUBLIC_PAGES_SETTINGS.offers.helpLinkLabel),
        helpLinkHref: str(offersRaw.helpLinkHref, DEFAULT_PUBLIC_PAGES_SETTINGS.offers.helpLinkHref),
        enterpriseTitle: str(offersRaw.enterpriseTitle, DEFAULT_PUBLIC_PAGES_SETTINGS.offers.enterpriseTitle),
        enterpriseIntro: str(offersRaw.enterpriseIntro, DEFAULT_PUBLIC_PAGES_SETTINGS.offers.enterpriseIntro),
        enterpriseCtaLabel: str(offersRaw.enterpriseCtaLabel, DEFAULT_PUBLIC_PAGES_SETTINGS.offers.enterpriseCtaLabel),
        enterpriseCtaHref: str(offersRaw.enterpriseCtaHref, DEFAULT_PUBLIC_PAGES_SETTINGS.offers.enterpriseCtaHref),
      },
      faq: {
        overline: str(faqRaw.overline, DEFAULT_PUBLIC_PAGES_SETTINGS.faq.overline),
        title: str(faqRaw.title, DEFAULT_PUBLIC_PAGES_SETTINGS.faq.title),
        items: parseFaqItems(faqRaw.items, DEFAULT_PUBLIC_PAGES_SETTINGS.faq.items),
      },
      contact: {
        types: {
          general: parseContactType(typesRaw.general, DEFAULT_PUBLIC_PAGES_SETTINGS.contact.types.general),
          entreprise: parseContactType(typesRaw.entreprise, DEFAULT_PUBLIC_PAGES_SETTINGS.contact.types.entreprise),
          diagnostic: parseContactType(typesRaw.diagnostic, DEFAULT_PUBLIC_PAGES_SETTINGS.contact.types.diagnostic),
        },
        successTitle: str(contactRaw.successTitle, DEFAULT_PUBLIC_PAGES_SETTINGS.contact.successTitle),
        successMessage: str(contactRaw.successMessage, DEFAULT_PUBLIC_PAGES_SETTINGS.contact.successMessage),
        coordinatesTitle: str(contactRaw.coordinatesTitle, DEFAULT_PUBLIC_PAGES_SETTINGS.contact.coordinatesTitle),
      },
      blog: {
        overline: str(blogRaw.overline, DEFAULT_PUBLIC_PAGES_SETTINGS.blog.overline),
        title: str(blogRaw.title, DEFAULT_PUBLIC_PAGES_SETTINGS.blog.title),
        intro: str(blogRaw.intro, DEFAULT_PUBLIC_PAGES_SETTINGS.blog.intro),
        emptyMessage: str(blogRaw.emptyMessage, DEFAULT_PUBLIC_PAGES_SETTINGS.blog.emptyMessage),
        articleFooterOverline: str(blogRaw.articleFooterOverline, DEFAULT_PUBLIC_PAGES_SETTINGS.blog.articleFooterOverline),
        articleFooterText: str(blogRaw.articleFooterText, DEFAULT_PUBLIC_PAGES_SETTINGS.blog.articleFooterText),
        articleFooterCtaLabel: str(blogRaw.articleFooterCtaLabel, DEFAULT_PUBLIC_PAGES_SETTINGS.blog.articleFooterCtaLabel),
        articleFooterCtaHref: str(blogRaw.articleFooterCtaHref, DEFAULT_PUBLIC_PAGES_SETTINGS.blog.articleFooterCtaHref),
        relatedTitle: str(blogRaw.relatedTitle, DEFAULT_PUBLIC_PAGES_SETTINGS.blog.relatedTitle),
      },
      legal: {
        cgv: parseLegalPage(legalRaw.cgv, DEFAULT_PUBLIC_PAGES_SETTINGS.legal.cgv),
        confidentialite: parseLegalPage(legalRaw.confidentialite, DEFAULT_PUBLIC_PAGES_SETTINGS.legal.confidentialite),
        mentionsLegales: parseLegalPage(legalRaw.mentionsLegales, DEFAULT_PUBLIC_PAGES_SETTINGS.legal.mentionsLegales),
      },
      orientation: {
        overline: str(orientationRaw.overline, DEFAULT_PUBLIC_PAGES_SETTINGS.orientation.overline),
        title: str(orientationRaw.title, DEFAULT_PUBLIC_PAGES_SETTINGS.orientation.title),
        progressHint: str(orientationRaw.progressHint, DEFAULT_PUBLIC_PAGES_SETTINGS.orientation.progressHint),
        resultOverline: str(orientationRaw.resultOverline, DEFAULT_PUBLIC_PAGES_SETTINGS.orientation.resultOverline),
        ctaDiagnostic: str(orientationRaw.ctaDiagnostic, DEFAULT_PUBLIC_PAGES_SETTINGS.orientation.ctaDiagnostic),
        ctaChoosePrefix: str(orientationRaw.ctaChoosePrefix, DEFAULT_PUBLIC_PAGES_SETTINGS.orientation.ctaChoosePrefix),
        ctaAllOffers: str(orientationRaw.ctaAllOffers, DEFAULT_PUBLIC_PAGES_SETTINGS.orientation.ctaAllOffers),
        questions: parseOrientationQuestions(
          orientationRaw.questions,
          DEFAULT_PUBLIC_PAGES_SETTINGS.orientation.questions
        ),
        recommendations: parseRecommendations(
          orientationRaw.recommendations,
          DEFAULT_PUBLIC_PAGES_SETTINGS.orientation.recommendations
        ),
      },
    });
  } catch {
    return structuredClone(DEFAULT_PUBLIC_PAGES_SETTINGS);
  }
}

export async function updatePublicPagesSettings(
  patch: Partial<{
    about: Partial<AboutPageSettings>;
    offers: Partial<OffersPageSettings>;
    faq: Partial<FaqPageSettings>;
    contact: Partial<ContactPageSettings>;
    blog: Partial<BlogPageSettings>;
    legal: Partial<LegalPagesSettings>;
    orientation: Partial<OrientationPageSettings>;
  }>
): Promise<PublicPagesSettings> {
  const current = await getPublicPagesSettings();
  const merged: PublicPagesSettings = {
    about: patch.about ? { ...current.about, ...patch.about } : current.about,
    offers: patch.offers ? { ...current.offers, ...patch.offers } : current.offers,
    faq: patch.faq
      ? {
          overline: patch.faq.overline !== undefined ? str(patch.faq.overline, current.faq.overline) : current.faq.overline,
          title: patch.faq.title !== undefined ? str(patch.faq.title, current.faq.title) : current.faq.title,
          items: patch.faq.items ? parseFaqItems(patch.faq.items, current.faq.items) : current.faq.items,
        }
      : current.faq,
    contact: patch.contact
      ? {
          types: patch.contact.types
            ? {
                general: patch.contact.types.general
                  ? parseContactType(patch.contact.types.general, current.contact.types.general)
                  : current.contact.types.general,
                entreprise: patch.contact.types.entreprise
                  ? parseContactType(patch.contact.types.entreprise, current.contact.types.entreprise)
                  : current.contact.types.entreprise,
                diagnostic: patch.contact.types.diagnostic
                  ? parseContactType(patch.contact.types.diagnostic, current.contact.types.diagnostic)
                  : current.contact.types.diagnostic,
              }
            : current.contact.types,
          successTitle:
            patch.contact.successTitle !== undefined
              ? str(patch.contact.successTitle, current.contact.successTitle)
              : current.contact.successTitle,
          successMessage:
            patch.contact.successMessage !== undefined
              ? str(patch.contact.successMessage, current.contact.successMessage)
              : current.contact.successMessage,
          coordinatesTitle:
            patch.contact.coordinatesTitle !== undefined
              ? str(patch.contact.coordinatesTitle, current.contact.coordinatesTitle)
              : current.contact.coordinatesTitle,
        }
      : current.contact,
    blog: patch.blog ? { ...current.blog, ...patch.blog } : current.blog,
    legal: patch.legal
      ? {
          cgv: patch.legal.cgv ? parseLegalPage(patch.legal.cgv, current.legal.cgv) : current.legal.cgv,
          confidentialite: patch.legal.confidentialite
            ? parseLegalPage(patch.legal.confidentialite, current.legal.confidentialite)
            : current.legal.confidentialite,
          mentionsLegales: patch.legal.mentionsLegales
            ? parseLegalPage(patch.legal.mentionsLegales, current.legal.mentionsLegales)
            : current.legal.mentionsLegales,
        }
      : current.legal,
    orientation: patch.orientation
      ? {
          overline:
            patch.orientation.overline !== undefined
              ? str(patch.orientation.overline, current.orientation.overline)
              : current.orientation.overline,
          title:
            patch.orientation.title !== undefined
              ? str(patch.orientation.title, current.orientation.title)
              : current.orientation.title,
          progressHint:
            patch.orientation.progressHint !== undefined
              ? str(patch.orientation.progressHint, current.orientation.progressHint)
              : current.orientation.progressHint,
          resultOverline:
            patch.orientation.resultOverline !== undefined
              ? str(patch.orientation.resultOverline, current.orientation.resultOverline)
              : current.orientation.resultOverline,
          ctaDiagnostic:
            patch.orientation.ctaDiagnostic !== undefined
              ? str(patch.orientation.ctaDiagnostic, current.orientation.ctaDiagnostic)
              : current.orientation.ctaDiagnostic,
          ctaChoosePrefix:
            patch.orientation.ctaChoosePrefix !== undefined
              ? str(patch.orientation.ctaChoosePrefix, current.orientation.ctaChoosePrefix)
              : current.orientation.ctaChoosePrefix,
          ctaAllOffers:
            patch.orientation.ctaAllOffers !== undefined
              ? str(patch.orientation.ctaAllOffers, current.orientation.ctaAllOffers)
              : current.orientation.ctaAllOffers,
          questions: patch.orientation.questions
            ? parseOrientationQuestions(patch.orientation.questions, current.orientation.questions)
            : current.orientation.questions,
          recommendations: patch.orientation.recommendations
            ? parseRecommendations(patch.orientation.recommendations, current.orientation.recommendations)
            : current.orientation.recommendations,
        }
      : current.orientation,
  };

  if (patch.about?.paragraphs) {
    merged.about.paragraphs = parseStringArray(patch.about.paragraphs, merged.about.paragraphs);
  }
  if (patch.about?.values) {
    merged.about.values = parseValues(patch.about.values, merged.about.values);
  }

  await prisma.siteContent.upsert({
    where: { key: PUBLIC_PAGES_SETTINGS_KEY },
    create: { key: PUBLIC_PAGES_SETTINGS_KEY, value: merged as unknown as Prisma.InputJsonValue },
    update: { value: merged as unknown as Prisma.InputJsonValue },
  });

  return merged;
}
