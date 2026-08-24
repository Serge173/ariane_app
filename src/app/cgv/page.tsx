import { Metadata } from "next";

export const metadata: Metadata = { title: "Conditions générales de vente" };

export default function CGVPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium max-w-3xl">
        <h1 className="heading-section mb-8">Conditions générales de vente</h1>
        <div className="space-y-6 text-sm text-brand-600 leading-relaxed">
          <p>Les présentes conditions générales de vente régissent les relations entre Conseil en Image avec Ariane et ses clients.</p>
          <section>
            <h2 className="font-display text-lg text-brand-950 mb-3">1. Prestations</h2>
            <p>Les prestations proposées sont des services de conseil en image et coaching. Les tarifs sont indiqués en FCFA TTC sur le site.</p>
          </section>
          <section>
            <h2 className="font-display text-lg text-brand-950 mb-3">2. Réservation et paiement</h2>
            <p>La réservation est confirmée après paiement intégral. Les moyens de paiement acceptés sont Mobile Money et carte bancaire.</p>
          </section>
          <section>
            <h2 className="font-display text-lg text-brand-950 mb-3">3. Annulation</h2>
            <p>Toute annulation doit être signalée au minimum 48h avant le rendez-vous. Les conditions de remboursement seront précisées ici.</p>
          </section>
          <p className="text-xs text-brand-400 italic pt-8">Document à rédiger et valider juridiquement avant mise en production.</p>
        </div>
      </div>
    </div>
  );
}
