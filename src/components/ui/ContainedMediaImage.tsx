"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { isRemoteImageAllowed } from "@/lib/next-image-src";

const CONTAIN_IMG =
  "block max-h-full max-w-full h-auto w-auto object-contain object-center select-none";

type ContainedMediaImageProps = {
  src: string;
  alt: string;
  /** Cadre plein (absolute inset-0) ou simple bloc */
  frameClassName?: string;
  darkFrame?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  onError?: () => void;
};

/**
 * Affiche l'image entière dans le cadre : proportions respectées, jamais étirée.
 */
export function ContainedMediaImage({
  src,
  alt,
  frameClassName,
  darkFrame = false,
  sizes = "100vw",
  priority = false,
  quality = 90,
  onError,
}: ContainedMediaImageProps) {
  const frame = cn(
    "flex items-center justify-center overflow-hidden p-1 sm:p-2",
    darkFrame ? "bg-black" : "bg-brand-50",
    frameClassName
  );

  const useNext = isRemoteImageAllowed(src);

  return (
    <div className={frame}>
      {useNext ? (
        <Image
          src={src}
          alt={alt}
          width={1920}
          height={1920}
          sizes={sizes}
          priority={priority}
          quality={quality}
          className={CONTAIN_IMG}
          style={{ width: "auto", height: "auto" }}
          onError={onError}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={CONTAIN_IMG}
          decoding="async"
          onError={onError}
        />
      )}
    </div>
  );
}
