import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez Ariane DAGO, consultante en image premium à Abidjan.",
};

export default async function AProposPage() {
  const { about } = await getPublicPagesSettings();

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative aspect-[3/4] bg-brand-100">
            <Image
              src={about.image}
              alt={about.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-overline mb-4">{about.overline}</p>
            <h1 className="heading-display mb-8">{about.title}</h1>
            {about.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-brand-600 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 text-center mb-24">
          {about.values.map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-xl mb-4">{item.title}</h3>
              <p className="text-sm text-brand-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href={about.ctaHref} className="btn-primary">{about.ctaLabel}</Link>
        </div>
      </div>
    </div>
  );
}
