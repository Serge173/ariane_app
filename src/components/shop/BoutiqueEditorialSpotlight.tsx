import Link from "next/link";
import { luxeImage } from "@/lib/images";
import { ProductImage } from "@/components/ui/ProductImage";
import type { BoutiqueProduct } from "@/components/shop/BoutiqueCatalog";

interface BoutiqueEditorialSpotlightProps {
  products: BoutiqueProduct[];
  title: string;
  buttonLabel: string;
}

export function BoutiqueEditorialSpotlight({
  products,
  title,
  buttonLabel,
}: BoutiqueEditorialSpotlightProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-8 lg:py-16">
      <div className="text-center mb-12 lg:mb-16 px-4">
        <h2 className="font-display text-3xl sm:text-4xl font-light italic text-brand-950">
          {title}
        </h2>
      </div>

      <div className="space-y-16 lg:space-y-24">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`relative flex flex-col ${
              index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            } items-center gap-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}
          >
            <div className="relative w-full lg:w-[58%] aspect-[3/4] lg:aspect-[4/5] bg-brand-100">
              <ProductImage
                src={product.images[0]}
                fallback={luxeImage(product.slug, 1000)}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>

            <div
              className={`relative z-10 w-full lg:w-[42%] bg-[#F7F5F0] p-8 lg:p-12 -mt-10 lg:mt-0 ${
                index % 2 === 0 ? "lg:-ml-16" : "lg:-mr-16"
              }`}
            >
              {product.brand && (
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-500 mb-3">
                  {product.brand}
                </p>
              )}
              <h3 className="font-display text-2xl lg:text-3xl font-light italic text-brand-950 mb-4">
                {product.name}
              </h3>
              <p className="font-sans text-sm text-brand-600 leading-relaxed mb-6">
                {product.shortDescription}
              </p>
              <Link
                href={`/boutique/${product.slug}`}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-brand-950 text-brand-950 font-sans text-[10px] uppercase tracking-[0.2em] hover:bg-brand-950 hover:text-white transition-colors"
              >
                {buttonLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
