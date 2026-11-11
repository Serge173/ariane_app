import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";
import { PublicPageIntro, PublicPageShell } from "@/components/layout/PublicPageShell";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez Ariane DAGO, consultante en image premium à Abidjan.",
};

export default async function AProposPage() {
  const { about } = await getPublicPagesSettings();

  return (
    <PublicPageShell width="wide">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 sm:mb-24">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-300/30 public-card">
            <Image
              src={about.image}
              alt={about.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <PublicPageIntro
              overline={about.overline}
              title={about.title}
              align="left"
              className="mb-6 sm:mb-8 !mb-0"
            />
            {about.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-brand-600 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-24">
          {about.values.map((item) => (
            <div key={item.title} className="public-card p-6 sm:p-8 text-center">
              <h3 className="font-display text-xl mb-4">{item.title}</h3>
              <p className="text-sm text-brand-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href={about.ctaHref} className="btn-primary rounded-full">{about.ctaLabel}</Link>
        </div>
    </PublicPageShell>
  );
}
