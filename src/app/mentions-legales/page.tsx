import { Metadata } from "next";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium max-w-3xl prose prose-brand">
        <h1 className="heading-section mb-8">Mentions légales</h1>
        <div className="space-y-6 text-sm text-brand-600 leading-relaxed">
          <section>
            <h2 className="font-display text-lg text-brand-950 mb-3">Éditeur du site</h2>
            <p>Conseil en Image avec Ariane<br />DAGO Stéphanie Ariane<br />Abidjan, Cocody — Côte d&apos;Ivoire<br />contact@conseil-image-ariane.com</p>
          </section>
          <section>
            <h2 className="font-display text-lg text-brand-950 mb-3">Hébergement</h2>
            <p>Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
          </section>
          <section>
            <h2 className="font-display text-lg text-brand-950 mb-3">Propriété intellectuelle</h2>
            <p>L&apos;ensemble du contenu de ce site est protégé par le droit d&apos;auteur. Toute reproduction est interdite sans autorisation.</p>
          </section>
          <p className="text-xs text-brand-400 italic">Document à compléter et valider juridiquement avant mise en production.</p>
        </div>
      </div>
    </div>
  );
}
