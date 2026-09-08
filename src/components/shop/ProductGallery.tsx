"use client";

import { useState } from "react";
import { ProductImage } from "@/components/ui/ProductImage";

interface ProductGalleryProps {
  images: string[];
  fallback: string;
  alt: string;
}

export function ProductGallery({ images, fallback, alt }: ProductGalleryProps) {
  const gallery = images.length > 0 ? images : [fallback];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] bg-brand-100 overflow-hidden">
        <ProductImage
          src={gallery[active]}
          fallback={fallback}
          alt={alt}
          fill
          className="object-cover transition-opacity duration-300"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {gallery.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`relative w-16 h-20 flex-shrink-0 border transition-colors ${
                index === active ? "border-brand-950 ring-1 ring-brand-950" : "border-brand-200"
              }`}
            >
              <ProductImage
                src={src}
                fallback={fallback}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
