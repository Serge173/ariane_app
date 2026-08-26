import { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ" };

const faqs = [
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
];

export default function FAQPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium max-w-3xl">
        <div className="text-center mb-16">
          <p className="text-overline mb-4">FAQ</p>
          <h1 className="heading-section">Questions fréquentes</h1>
        </div>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b border-brand-100 pb-6">
              <h3 className="font-display text-lg mb-3">{faq.q}</h3>
              <p className="text-sm text-brand-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
