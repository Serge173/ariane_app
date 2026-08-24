import { Metadata } from "next";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium max-w-3xl">
        <h1 className="heading-section mb-8">Politique de confidentialité</h1>
        <div className="space-y-6 text-sm text-brand-600 leading-relaxed">
          <p>Conseil en Image avec Ariane s&apos;engage à protéger vos données personnelles conformément à la réglementation applicable.</p>
          <section>
            <h2 className="font-display text-lg text-brand-950 mb-3">Données collectées</h2>
            <p>Nom, prénom, email, téléphone, informations de facturation, réponses aux questionnaires de coaching, historique de commandes.</p>
          </section>
          <section>
            <h2 className="font-display text-lg text-brand-950 mb-3">Finalités</h2>
            <p>Gestion des réservations, suivi du coaching, communication transactionnelle, amélioration de nos services.</p>
          </section>
          <section>
            <h2 className="font-display text-lg text-brand-950 mb-3">Vos droits</h2>
            <p>Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données en contactant contact@conseil-image-ariane.com.</p>
          </section>
          <p className="text-xs text-brand-400 italic pt-8">Document à rédiger et valider juridiquement avant mise en production.</p>
        </div>
      </div>
    </div>
  );
}
