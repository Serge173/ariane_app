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

type ProductImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  fallback?: string;
  /** auto = contain si upload/Blob, cover sinon (préserve l’existant en prod) */
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
  onError,
  ...props
}: ProductImageProps) {
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

  if (!useNextImage) {
    const { sizes: _sizes, priority: _priority, ...imgProps } = props;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...imgProps}
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
      className={cn(fill ? imageFillClass(resolvedFit) : fitClass, className)}
      onError={(event) => {
        handleError();
        onError?.(event);
      }}
    />
  );
}
