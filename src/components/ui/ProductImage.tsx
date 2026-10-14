"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { IMAGES } from "@/lib/images";
import {
  imageFillClass,
  imageObjectFitClass,
  resolveImageFit,
  type ImageFitPreference,
} from "@/lib/image-display";
import { isRemoteImageAllowed } from "@/lib/next-image-src";
import { cn } from "@/lib/utils";
import { ContainedMediaImage } from "@/components/ui/ContainedMediaImage";

type ProductImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  fallback?: string;
  fit?: ImageFitPreference;
};

/** Image with automatic fallback when the source URL fails (404, etc.). */
export function ProductImage({
  src,
  alt,
  fallback = IMAGES.productFallback,
  fit = "auto",
  className,
  fill,
  sizes,
  priority,
  quality: qualityProp,
  onError,
  ...props
}: ProductImageProps) {
  const quality = typeof qualityProp === "number" ? qualityProp : 90;
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
  }, [src]);

  const currentSrc = !src || errored ? fallback : src.trim();
  const useNextImage = isRemoteImageAllowed(currentSrc);
  const resolvedFit = resolveImageFit(currentSrc, fit);
  const fitClass = imageObjectFitClass(resolvedFit);

  const handleError = () => {
    setErrored(true);
  };

  if (fill && resolvedFit === "contain") {
    return (
      <div className={cn("absolute inset-0 product-frame__image--contain", className)}>
        <ContainedMediaImage
          src={currentSrc}
          alt={alt}
          frameClassName="absolute inset-0 h-full w-full"
          sizes={typeof sizes === "string" ? sizes : undefined}
          priority={priority}
          quality={quality}
          onError={() => {
            handleError();
          }}
        />
      </div>
    );
  }

  if (!useNextImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={currentSrc}
        alt={alt}
        className={cn(fill ? imageFillClass(resolvedFit) : fitClass, className)}
        onError={(event) => {
          handleError();
          onError?.(event);
        }}
      />
    );
  }

  return (
    <Image
      {...props}
      fill={fill}
      src={currentSrc}
      alt={alt}
      quality={quality}
      className={cn(fill ? imageFillClass(resolvedFit) : fitClass, className)}
      onError={(event) => {
        handleError();
        onError?.(event);
      }}
    />
  );
}
