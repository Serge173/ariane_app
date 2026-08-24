import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez Ariane DAGO, consultante en image premium à Abidjan.",
};

export default function AProposPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative aspect-[3/4] bg-brand-100">
            <Image
              src={IMAGES.about}
              alt="Ariane DAGO - Consultante en image"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-overline mb-4">À propos</p>
            <h1 className="heading-display mb-8">Ariane DAGO</h1>
            <p className="text-brand-600 leading-relaxed mb-6">
              Fondatrice de Conseil en Image avec Ariane, je accompagne hommes et femmes
              ambitieux dans l&apos;alignement de leur image avec leur personnalité,
              leur fonction et leurs ambitions.
            </p>
            <p className="text-brand-600 leading-relaxed mb-6">
              Basée à Abidjan, je propose des accompagnements en présentiel et à distance
              pour une clientèle en Côte d&apos;Ivoire, en Afrique et dans la diaspora.
            </p>
            <p className="text-brand-600 leading-relaxed">
              Mon approche allie expertise technique, sensibilité esthétique et
              compréhension des enjeux professionnels pour une transformation
              authentique et durable.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 text-center mb-24">
          {[
            { title: "Mission", text: "Révéler l'image authentique de chaque personne pour qu'elle rayonne avec confiance." },
            { title: "Vision", text: "Devenir la référence du conseil en image premium en Afrique francophone." },
            { title: "Valeurs", text: "Excellence, authenticité, écoute et transformation durable." },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-xl mb-4">{item.title}</h3>
              <p className="text-sm text-brand-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/orientation" className="btn-primary">Découvrir mon accompagnement</Link>
        </div>
      </div>
    </div>
  );
}
