import Link from "next/link";
import Image from "next/image";
import type { PersonalShoppingSettings } from "@/lib/homepage-settings";

export function PersonalShoppingBanner({ settings }: { settings: PersonalShoppingSettings }) {
  if (!settings.enabled || !settings.image.trim()) return null;

  const href = settings.linkHref.trim() || "/boutique?line=luxe";
  const width = settings.imageWidth > 0 ? settings.imageWidth : 1200;
  const height = settings.imageHeight > 0 ? settings.imageHeight : 200;

  const isLocalStatic = settings.image.startsWith("/");

  return (
    <section className="personal-shopping-band" aria-label="Personal Shopping">
      <div className="personal-shopping">
        <Link href={href} className="personal-shopping__link" aria-label="Découvrir le Personal Shopping">
          <Image
            src={settings.image}
            alt={settings.imageAlt || "Personal Shopping — Ariane"}
            width={width}
            height={height}
            sizes="100vw"
            className="personal-shopping__image"
            unoptimized={isLocalStatic}
          />
        </Link>
      </div>
    </section>
  );
}
