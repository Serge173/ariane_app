"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DEFAULT_PERSONAL_SHOPPING_BANNER,
  type PersonalShoppingSettings,
} from "@/lib/homepage-settings";
import { resolveNextImageSrc } from "@/lib/next-image-src";

export function PersonalShoppingBanner({ settings }: { settings: PersonalShoppingSettings }) {
  const href = settings.linkHref.trim() || DEFAULT_PERSONAL_SHOPPING_BANNER.linkHref;
  const width = settings.imageWidth > 0 ? settings.imageWidth : DEFAULT_PERSONAL_SHOPPING_BANNER.imageWidth;
  const height =
    settings.imageHeight > 0 ? settings.imageHeight : DEFAULT_PERSONAL_SHOPPING_BANNER.imageHeight;

  const [src, setSrc] = useState(() =>
    resolveNextImageSrc(settings.image, DEFAULT_PERSONAL_SHOPPING_BANNER.image)
  );

  useEffect(() => {
    setSrc(resolveNextImageSrc(settings.image, DEFAULT_PERSONAL_SHOPPING_BANNER.image));
  }, [settings.image]);

  if (!settings.enabled || !settings.image.trim()) return null;

  const isLocalStatic = src.startsWith("/");

  return (
    <section className="personal-shopping-band" aria-label="Personal Shopping">
      <div className="personal-shopping">
        <Link href={href} className="personal-shopping__link" aria-label="Découvrir le Personal Shopping">
          <Image
            src={src}
            alt={settings.imageAlt || "Personal Shopping — Ariane"}
            width={width}
            height={height}
            sizes="100vw"
            className="personal-shopping__image"
            unoptimized={isLocalStatic}
            onError={() => setSrc(DEFAULT_PERSONAL_SHOPPING_BANNER.image)}
          />
        </Link>
      </div>
    </section>
  );
}
