import Image from "next/image";
import Link from "next/link";
import { luxeImage } from "@/lib/images";
import type { PublicCategoryTreeNode } from "@/lib/categories";

const CATEGORY_IMAGES: Record<string, string> = {
  sacs: luxeImage("sac-cabas-cuir", 900),
  vetements: luxeImage("blazer-soie-noire", 900),
  accessoires: luxeImage("foulard-soie-signature", 900),
  parfums: luxeImage("parfum-signature-ariane", 900),
};

interface BoutiqueCollectionTilesProps {
  roots: PublicCategoryTreeNode[];
}

export function BoutiqueCollectionTiles({ roots }: BoutiqueCollectionTilesProps) {
  if (roots.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
        <h2 className="font-display text-3xl sm:text-4xl font-light italic text-brand-950 mb-4">
          Les collections
        </h2>
        <p className="font-sans text-sm text-brand-600 leading-relaxed">
          Sacs, vêtements, accessoires et parfums — une sélection pensée pour une
          garde-robe d&apos;exception.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {roots.map((root, index) => (
          <Link
            key={root.slug}
            href={`/boutique?category=${root.slug}`}
            className={`group relative overflow-hidden bg-brand-200 ${
              index === 0 ? "sm:col-span-2 sm:row-span-1 lg:col-span-2 lg:row-span-2" : ""
            } ${index === 0 ? "aspect-[16/10] lg:aspect-auto lg:min-h-[520px]" : "aspect-[4/5]"}`}
          >
            <Image
              src={CATEGORY_IMAGES[root.slug] ?? luxeImage("sac-cabas-cuir", 900)}
              alt={root.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes={index === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
            />
            <div className="absolute inset-0 bg-brand-950/20 group-hover:bg-brand-950/30 transition-colors" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/80 mb-2">
                Collection
              </p>
              <h3 className="font-display text-2xl lg:text-3xl font-light italic text-white">
                {root.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
